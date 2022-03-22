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
        ? [`${__dirname}/../../dist/**/*.entity.{js,ts}`]
        : [`${__dirname}/../**/*.entity.{js,ts}`],
    migrations: ['dist/migrations/*.{js,ts}'],
    cli: {
      migrationsDir: 'src/migrations',
    },
    // synchronize: process.env.NODE_ENV === 'develop' ? true : false,
    synchronize: false,
  },
});
