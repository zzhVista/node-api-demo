// server.js
const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
    const numCPUs = os.cpus().length;
    console.log(`主进程启动，fork ${numCPUs} 个工作进程`);
    
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    
    // 可选：监听进程退出，自动重启
    cluster.on('exit', (worker, code, signal) => {
        console.log(`工作进程 ${worker.process.pid} 退出，正在重启...`);
        cluster.fork();
    });
} else {
    require('./app.js');
}