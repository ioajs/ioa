## 路由

### 自动寻址方案（当前使用）
> 不需要手动配置路由，路由会根据url自动定位到指定controller和action，仅支持惰性缓存

优点：
* 简单，不需要配置路由即可使用

缺点：
* 不够灵活，使用固定的寻址规则

### 预定义路由方案（备选，以后可能会用）

> 需要手动配置路由规则，路由会根据预定义路径定位到指定controller和action，既可以选择惰性加载，也可以使用预缓存

优点：
* 灵活，允许随意定义url与controller的映射关系
* 高效，可以实现模块的全量预加载、模块预检等功能，之后不用再探测模块是否存

缺点：
* 需要手动配置路由

## 控制器

使用惰性缓存策略，已加载过的控制器会被写入内存中，避免每次http请求时都要重新导入controller

支持多层控制器，controller文件路径始终对应url路径，不含action

## 模型

模型使用sequelize.js模块，提供强大的ORM和验证支持

暂未添加模型缓存

## 中间件

使用方法与Koa一致

## 目录结构

```
koa-example
    |-- app
    |    |-- controller
    |    |    |-- home
    |    |    |    |- index.js
    |    |    |    |- c1.js
    |    |    |    |- c2.js
    |    |    |    |- ...
    |    |    |    └─ ...
    |    |    |
    |    |    └─ index.js
    |    |
    |    |
    |    |-- middleware
    |    |    |- middleware1.js
    |    |    |- middleware2.js
    |    |    |- ...
    |    |    └─ ...
    |    |
    |    |
    |    |-- model
    |    |    |- model1.js
    |    |    |- model2.js
    |    |    |- ...
    |    |    └─ ...
    |    | 
    |    └─ db.js
    |
    └─ index.js
```