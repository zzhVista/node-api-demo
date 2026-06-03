module.exports = (app) => {
    const { pool, success, fail } = app.locals;

    app.get('/api/roles/:id', async (req, res) => {
        const { id } = req.params;
        
        try {
            const [rows] = await pool.execute(
                'SELECT * FROM sys_role WHERE role_id = ?', 
                [id]
            );
            
            if (rows.length === 0) {
                return fail(res, '角色不存在', 404);
            }
            
            success(res, rows[0]);
        } catch (error) {
            console.error('Database error:', error);
            fail(res, '服务器错误', 500);
        }
    });

       // 获取角色列表
    app.get('/api/roles', async (req, res) => {
        try {
            const [rows] = await pool.execute('SELECT * FROM sys_role');
            success(res, rows);
        } catch (error) {
            fail(res, '服务器错误', 500);
        }
    });

};