import {
  aws_ec2 as ec2,
  aws_ecs as ecs,
  aws_ecr as ecr,
  aws_iam as iam,
  aws_s3 as s3,
  aws_rds as rds,
  aws_secretsmanager as secretsmanager,
  aws_elasticloadbalancingv2 as elbv2,
  Stack,
  StackProps,
  Duration,
  RemovalPolicy,
  SecretValue,
} from "aws-cdk-lib";
import { DockerImageAsset } from "aws-cdk-lib/aws-ecr-assets";
import * as ecrdeploy from "cdk-ecr-deployment";
import * as path from "path";
import { Construct } from "constructs";

export interface CustomStackProps extends StackProps {
  projectName: string;
  myPublicCidrIp?: string;
}

export class CdkStack extends Stack {
  constructor(scope: Construct, id: string, props: CustomStackProps) {
    super(scope, id, props);

    const PROJECT_NAME = props.projectName;
    // const MY_PUBLIC_CIDR_IP = props.myPublicCidrIp || "012345";
    const ACCOUNT = props.env?.account;
    const REGION = props.env?.region;

    // VPC
    const vpc = new ec2.Vpc(this, "VPC", {
      cidr: "10.0.0.0/16",
      vpcName: `${PROJECT_NAME}-vpc`,
      maxAzs: 2,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: `${PROJECT_NAME}-public`,
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: `${PROJECT_NAME}-private`,
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    // Security groups
    // SG for ELB
    const securityGroupELB = new ec2.SecurityGroup(this, "SecurityGroupELB", {
      vpc,
      description: "Security group for ELB",
      securityGroupName: `${PROJECT_NAME}-sg-elb`,
    });
    securityGroupELB.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), "Allow all HTTP connection");

    // SG for application on ECS
    const securityGroupApp = new ec2.SecurityGroup(this, "SecurityGroupApp", {
      vpc,
      description: "Security group for App",
      securityGroupName: `${PROJECT_NAME}-sg-app`,
    });
    securityGroupApp.addIngressRule(securityGroupELB, ec2.Port.tcp(3000), "Allow HTTP connection from ELB");

    // SG for VPC endpoint
    const securityGroupPrivateLink = new ec2.SecurityGroup(this, "SecurityGroupPrivateLink", {
      vpc,
      description: "Security group for private link",
      securityGroupName: `${PROJECT_NAME}-sg-private-link`,
    });

    // SG for Bastion host
    const securityGroupBastion = new ec2.SecurityGroup(this, "SecurityGroupBastion", {
      vpc,
      description: "Security group for Bastion",
      securityGroupName: `${PROJECT_NAME}-sg-bastion`,
    });
    securityGroupBastion.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), "Allow SSH connection");

    // SG for RDS
    const securityGroupRDS = new ec2.SecurityGroup(this, "SecurityGroupRDS", {
      vpc,
      description: "Security group for RDS",
      securityGroupName: "SGRDS",
    });
    securityGroupRDS.addIngressRule(securityGroupApp, ec2.Port.tcp(3306), "Allow MySQL connection from App");
    securityGroupRDS.addIngressRule(securityGroupBastion, ec2.Port.tcp(3306), "Allow MySQL connection from Bastion");

    // VPC endpoint
    new ec2.InterfaceVpcEndpoint(this, "ECSPrivateLinkAPI", {
      vpc,
      service: new ec2.InterfaceVpcEndpointService(`com.amazonaws.${REGION}.ecr.api`),
      securityGroups: [securityGroupPrivateLink],
      privateDnsEnabled: true,
    });
    new ec2.InterfaceVpcEndpoint(this, "ECSPrivateLinkDKR", {
      vpc,
      service: new ec2.InterfaceVpcEndpointService(`com.amazonaws.${REGION}.ecr.dkr`),
      securityGroups: [securityGroupPrivateLink],
      privateDnsEnabled: true,
    });
    new ec2.GatewayVpcEndpoint(this, "ECSPrivateLinkS3", {
      vpc,
      service: ec2.GatewayVpcEndpointAwsService.S3,
    });
    new ec2.InterfaceVpcEndpoint(this, "SecretsManagerPrivateLink", {
      vpc,
      service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
      securityGroups: [securityGroupPrivateLink],
    });
    // new ec2.InterfaceVpcEndpoint(this, "ECSPrivateLinkLogs", {
    //   vpc,
    //   service: new ec2.InterfaceVpcEndpointService("com.amazonaws.ap-northeast-1.logs"),
    //   securityGroups: [securityGroupPrivateLink],
    // });

    // Bastion host
    const bastionHost = new ec2.BastionHostLinux(this, "BastionHost", {
      vpc,
      instanceName: `${PROJECT_NAME}-bastion-host`,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      securityGroup: securityGroupBastion,
      subnetSelection: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
    });
    bastionHost.instance.addUserData("yum -y update", "yum install -y mysql jq");

    // RDS Credentials
    const databaseCredentialSecret = new secretsmanager.Secret(this, "DatabaseCredentialSecret", {
      secretName: `${PROJECT_NAME}-rds-secrets`,
      generateSecretString: {
        secretStringTemplate: JSON.stringify({
          username: "dbuser",
          dbname: "production",
        }),
        excludePunctuation: true,
        includeSpace: false,
        generateStringKey: "password",
      },
    });

    // RDS
    const rdsInstance = new rds.DatabaseInstance(this, "RDSInstance", {
      engine: rds.DatabaseInstanceEngine.MYSQL,
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      securityGroups: [securityGroupRDS],
      // multiAz: true,
      removalPolicy: RemovalPolicy.DESTROY,
      credentials: rds.Credentials.fromSecret(databaseCredentialSecret),
      deletionProtection: false,
      databaseName: "production",
      parameterGroup: new rds.ParameterGroup(this, "ParameterGroup", {
        engine: rds.DatabaseInstanceEngine.mysql({
          version: rds.MysqlEngineVersion.VER_8_0_26,
        }),
        parameters: {
          character_set_client: "utf8mb4",
          character_set_server: "utf8mb4",
        },
      }),
    });

    // S3
    const s3PublicBucket = new s3.Bucket(this, "PublicBucket", {
      bucketName: `${PROJECT_NAME}-public-file-bucket`,
      publicReadAccess: true,
    });

    // IAM user for S3
    const iamUserForS3 = new iam.User(this, "iamUserForS3", {
      userName: `${PROJECT_NAME}-s3-admin`,
      managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonS3FullAccess")],
    });
    const accessKey = new iam.AccessKey(this, "AccessKeyId", { user: iamUserForS3 });

    // S3 credentials
    const iamUserForS3CredentialsSecret = new secretsmanager.Secret(this, "iamUserForS3CredentialsSecret", {
      secretName: `${PROJECT_NAME}-iam-user-for-s3-credentials`,
      secretObjectValue: {
        username: SecretValue.unsafePlainText(iamUserForS3.userName),
        accessKeyId: SecretValue.unsafePlainText(accessKey.accessKeyId),
        secretAccessKey: accessKey.secretAccessKey,
      },
    });

    // ALB
    const alb = new elbv2.ApplicationLoadBalancer(this, "ALB", {
      vpc,
      securityGroup: securityGroupELB,
      internetFacing: true,
      loadBalancerName: `${PROJECT_NAME}-alb`,
    });

    const listener = alb.addListener("Listener", {
      port: 80,
    });

    // create ECR repository
    const repository = new ecr.Repository(this, "Repository", {
      repositoryName: PROJECT_NAME,
    });

    // ECR image
    const image = new DockerImageAsset(this, "DockerImageAsset", {
      directory: path.join(__dirname, "../api"),
      file: "Dockerfile.prod",
    });

    // ECR deployment
    new ecrdeploy.ECRDeployment(this, "ECRDeployment", {
      src: new ecrdeploy.DockerImageName(image.imageUri),
      dest: new ecrdeploy.DockerImageName(`${ACCOUNT}.dkr.ecr.${REGION}.amazonaws.com/${repository.repositoryName}`),
    });

    // ECS Task definition
    const fargateTaskDefinition = new ecs.FargateTaskDefinition(this, `${PROJECT_NAME}-task-definition`, {
      memoryLimitMiB: 2048,
      cpu: 1024,
    });

    fargateTaskDefinition.addToExecutionRolePolicy(
      new iam.PolicyStatement({
        actions: ["ssm:GetParameters", "secretsmanager:GetSecretValue", "kms:Decrypt"],
        resources: [databaseCredentialSecret.secretArn],
      })
    );

    const container = fargateTaskDefinition.addContainer("Container", {
      containerName: `${PROJECT_NAME}-container`,
      image: ecs.ContainerImage.fromEcrRepository(repository),
      portMappings: [
        {
          hostPort: 3000,
          containerPort: 3000,
          protocol: ecs.Protocol.TCP,
        },
      ],
      secrets: {
        DB_PASSWORD: ecs.Secret.fromSecretsManager(databaseCredentialSecret, "password"),
        DB_PORT: ecs.Secret.fromSecretsManager(databaseCredentialSecret, "port"),
        DB_HOST: ecs.Secret.fromSecretsManager(databaseCredentialSecret, "host"),
        DB_USERNAME: ecs.Secret.fromSecretsManager(databaseCredentialSecret, "username"),
        DB_DBNAME: ecs.Secret.fromSecretsManager(databaseCredentialSecret, "dbname"),
        S3_IAM_ACCESS_KEY_ID: ecs.Secret.fromSecretsManager(iamUserForS3CredentialsSecret, "accessKeyId"),
        S3_IAM_SECRET_ACCESS_KEY: ecs.Secret.fromSecretsManager(iamUserForS3CredentialsSecret, "secretAccessKey"),
      },
      environment: {
        AWS_REGION: REGION || "ap-northeast-1",
        S3_PUBLIC_BUCKET_NAME: s3PublicBucket.bucketName,
        NODE_ENV: "production",
      },
    });

    const cluster = new ecs.Cluster(this, "FargateCluster", {
      vpc,
      clusterName: `${PROJECT_NAME}-fargate-cluster`,
    });

    const fargateService = new ecs.FargateService(this, "FargateService", {
      cluster,
      serviceName: `${PROJECT_NAME}-fargate-service`,
      desiredCount: 1, // Temp val for testing
      taskDefinition: fargateTaskDefinition,
      securityGroups: [securityGroupApp],
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
    });

    // set default capacity provider FARGATE SPOT
    const cfnService = fargateService.node.tryFindChild("Service") as ecs.CfnService;
    cfnService.launchType = undefined;
    cfnService.capacityProviderStrategy = [
      { capacityProvider: "FARGATE_SPOT", weight: 2 },
      { capacityProvider: "FARGATE", weight: 1 },
    ];

    listener.addTargets("ECS", {
      port: 80,
      targetGroupName: `${PROJECT_NAME}-tg`,
      targets: [
        fargateService.loadBalancerTarget({
          containerName: container.containerName,
          containerPort: 3000,
        }),
      ],
      stickinessCookieDuration: Duration.seconds(86400),
    });

    const autoScaling = fargateService.autoScaleTaskCount({
      minCapacity: 1,
      maxCapacity: 2,
    });
    autoScaling.scaleOnCpuUtilization("CpuScaling", {
      targetUtilizationPercent: 50,
      scaleInCooldown: Duration.seconds(60),
      scaleOutCooldown: Duration.seconds(60),
    });
    autoScaling.scaleOnMemoryUtilization("MemoryScaling", {
      targetUtilizationPercent: 50,
      scaleInCooldown: Duration.seconds(60),
      scaleOutCooldown: Duration.seconds(60),
    });
  }
}
