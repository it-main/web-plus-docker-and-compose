import * as process from 'node:process';

export default () => ({
  port: parseInt(process.env.PORT) || 3000,
  jwt: {
    secret: process.env.JWT_SECRET || 'secret',
    ttl: process.env.JWT_TTL || '1800s',
  },
  database: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT) || 5432,
    username: process.env.POSTGRES_USER || 'student',
    password: process.env.POSTGRES_PASSWORD || 'student',
    dbname: process.env.POSTGRES_DB || 'kupipodariday',
  },
});
