const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
//解决跨域问题
app.use(cors());

const PORT = 3000;

//设置body-parser中间件 解析JSON请求体
app.use(bodyParser.json());

//设置body-parser中间件 解析URL编码请求体
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log('Request URL:', req.url);
    console.log(`${req.method} ${req.path}`);//注意这里是``而不是'，因为这是ES6的模板字符串
    next();
}
);

//返回Cannot GET /是正常的，因为还没有设置路由
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'kappa',
    password: 'kappa',
    database: 'kappa',
    waitForConnections: true,
    connectionLimit: 10
})

//设置路由 可以正常返回Hello World!
app.get('/', (req, res) => {  res.send('Hello World!');});

pool.getConnection().then(conn => {
    console.log('Connected to MySQL database');
    conn.release();
})
.catch(err => {
    console.error('Error connecting to MySQL database:', err);
})


//统一的返回格式
const resFormat = (res,code,data,message) => {
    res.json({
        code: code,
        data: data,
        message: message
    })
}

//成功返回
const success = (res,data, message = 'success') => {
    resFormat(res,0,data,message);
}

//失败返回
const fail = (res, message = 'fail', code = 1) => {
    resFormat(res,code,null,message);
}


// 将工具函数挂载到 app 上，避免循环引用
app.locals.pool = pool;
app.locals.success = success;
app.locals.fail = fail;

// 引入路由模块（传入 app 实例）
//方案一 手动引入
//require('./user')(app);

//方案二 自动引入
const fs = require('fs');
const path = require('path');
const files = fs.readdirSync(path.join(__dirname, 'routes'));
files.forEach(file => {
    if (file.endsWith('.js')) {
        require(path.join(__dirname, 'routes', file))(app);
        console.log(`✅ 已加载路由模块:: ${file}`);
    }
})


// 导出 app（不再导出 pool，因为已挂载到 app.locals）
module.exports = app;