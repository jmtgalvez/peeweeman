import executeQuery from "../../../lib/db";

export default async (req, res) => {
    try {
        const { id } = req.query;
        if ( req.method === 'GET' ) {
            const result = await executeQuery({
                query: 'SELECT metadata FROM users WHERE id = ?',
                values: [ id ],
            });
            res.status(200).json(result[0]);
        } else if ( req.method === 'PUT' ) {
            const { data } = req.body;
            const result = await executeQuery({
                query: 'UPDATE users SET metadata = ? WHERE id = ?',
                values: [ data, id ]
            });
            res.status(200).json(result);
        }
    } catch (error) {
        res.status(500).json({ error });
    }
}