'use strict';

/**
 * cluster进程守护示例
 */

const cluster = require('cluster');

if (cluster.isMaster) {

   const numCPUs = require('os').cpus().length;

   console.log(`主进程 ${process.pid} 正在运行`);

   let agentId = 1;

   // 衍生工作进程。
   for (let i = 1; i <= numCPUs; i++) {
      if (agentId === i) {
         cluster.fork({ type: 'agent' });
      } else {
         cluster.fork({ type: 'worker' });
      }
   }

   cluster.on('exit', (worker, code, signal) => {

      console.log(`进程 ${worker.id} 已退出`);

      if (agentId === worker.id) {
         const { id } = cluster.fork({ type: 'agent' });
         agentId = id;
      } else {
         cluster.fork({ type: 'worker' });
      }

   });

} else {

   const { id } = cluster.worker;

   const { type } = process.env;

   if (type === 'agent') {

      console.log(`代理进程 ${process.pid}，cid：${id}已启动`);

   } else {

      const http = require('http');

      // 工作进程可以共享任何 TCP 连接。
      // 在本例子中，共享的是 HTTP 服务器。
      http.createServer((req, res) => {

         res.writeHead(200);

         res.end(`hello word, pid:${id}`);

      }).listen(8000);

      console.log(`工作进程 pid：${process.pid}，cid：${id}已启动`);

   }

}