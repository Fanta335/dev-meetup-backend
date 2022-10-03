export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DBNAME,
    entities: [`${__dirname}/../../dist/**/*.entity.{js,ts}`],
    migrations: [`${__dirname}/../../../dist/migrations/*.{js,ts}`],
    cli: {
      migrationsDir: `${__dirname}/../../../dist/migrations`,
    },
    // synchronize: process.env.NODE_ENV === 'develop' ? true : false,
    synchronize: true,
  },
});
