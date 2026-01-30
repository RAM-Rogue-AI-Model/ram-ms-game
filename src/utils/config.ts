import 'dotenv/config';

const config = {
    PORT: process.env.PORT || 3002,
    DATABASE_URL: process.env.DATABASE_URL ?? '',
    DATABASE_HOST: process.env.DATABASE_HOST ?? 'localhost',
    DATABASE_USER: process.env.DATABASE_USER ?? 'user',
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD ?? '',
    DATABASE_PORT: Number(process.env.DATABASE_PORT ?? 3306),
    DATABASE_DB_NAME: process.env.DATABASE_DB_NAME ?? 'ram-ms-game-db',
};

export { config };
