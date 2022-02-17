import { User } from '../users/user.entity';

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities:
      process.env.NODE_ENV === 'develop'
        ? [User]
        : ['src/**/**.entity{.ts,.js}'],
    synchronize: process.env.NODE_ENV === 'develop' ? true : false,
  },
});
