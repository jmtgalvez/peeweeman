import mysql from 'serverless-mysql';

const db = mysql({
    config: {
        host: process.env.MYSQL_HOST || 'localhost',
        port: process.env.MYSQL_PORT || 3306,
        database: process.env.MYSQL_DATABASE || 'peeweeman',
        user: process.env.MYSQL_USER || 'peeweeman',
        password: process.env.MYSQL_PASSWORD || 'peeweeman',
    }
});

export default async function executeQuery({ query, values }) {
    try {
        const results = await db.query(query, values);
        await db.end();
        return results;
    } catch (error) {
        return { error };
    }
}