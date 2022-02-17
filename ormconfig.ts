import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

const options: MysqlConnectionOptions = {
  type: 'mysql',
  host: 'db', // dbのdocker containerの名前
  port: 3306,
  username: 'develop',
  password: 'password',
  database: 'develop', //dockerのdb名
  entities: ['dist/src/**/*.entity.js'],
  migrations: ['dist/migration/**/*.migration.js'],
  cli: {
    migrationsDir: 'migration',
  },
};

export default options;
