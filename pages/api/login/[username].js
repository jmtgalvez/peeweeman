import executeQuery from "../../../lib/db";

export default async (req, res) => {
    try {
        const { username } = req.query;
        const result = await executeQuery({
            query: 'SELECT * FROM users WHERE username = ?',
            values: [ username ],
        });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error });
    }
}