import executeQuery from "../../../lib/db";

export default async (req, res) => {
    try {
        const result = await executeQuery({
            query: 'SELECT id, password FROM users WHERE username = ?',
            values: [req.body.username],
        });=
        res.status(200).end({ result })
    } catch (error) {
        console.log(error);
    }
}