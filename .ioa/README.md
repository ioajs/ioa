## ioa框架开发依赖

放置于ioa框架根目录下的node_modules目录中，仅作为ioa的开发依赖副本，在资源丢失时手动恢复

### ./index.js

作为根index.js的代理，将来自node_modules/ioa模块的访问重定向到ioa根目录下的index.js


### ./.component

通过node_modules/ioa访问组件注入依赖