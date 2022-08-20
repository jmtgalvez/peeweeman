import executeQuery from "../../../lib/db";

export default async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await executeQuery({
            query: 'INSERT INTO users (username, password) VALUES (?, ?)',
            values: [ username, password ],
        });
        res.status(200).json({ id: result.insertId});
    } catch (error) {
        res.status(500).json({ error });
    }
}