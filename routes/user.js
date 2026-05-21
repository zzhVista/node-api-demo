module.exports = (app) => {
    const { pool, success, fail } = app.locals;

    app.get('/api/users/:id', async (req, res) => {
        const { id } = req.params;
        
        try {
            const [rows] = await pool.execute(
                'SELECT * FROM sys_user WHERE user_id = ?', 
                [id]
            );
            
            if (rows.length === 0) {
                return fail(res, '用户不存在', 404);
            }
            
            success(res, rows[0]);
        } catch (error) {
            console.error('Database error:', error);
            fail(res, '服务器错误', 500);
        }
    });
};