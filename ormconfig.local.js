module.exports = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['dist/**/*.entity.{js,ts}'],
  migrations: ['dist/migrations/*.{js,ts}'],
  cli: {
    migrationsDir: 'dist/migrations',
    entitiesDir: 'dist/entities',
  },
  synchronize: false,
};
