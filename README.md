## 路由

### 自动寻址方案（当前使用）
采用递归controller目录方式，自动缓存控制器，排除url中action部分后，url路径于文件路径一致。不需要手动配置路由，路由会根据url自动定位到指定controller和action。支持预加载、模块预检等功能，之后不用再探测模块是否存或有语法错误。

优点：
* 简单，不需要配置路由即可使用

缺点：
* 不够灵活，使用固定的寻址规则

### 预定义路由方案（备选）

需要手动配置路由规则，路由会根据预定义路径定位到指定controller和action

优点：
* 灵活，允许随意定义url与controller的映射关系

缺点：
* 需要手动配置路由

## 控制器

使用预缓存策略，在http服务启动时被写入内存，避免每次http请求时都要重新执行controller函数

支持多层控制器，controller文件路径始终对应url路径，不含action

## 模型

模型采用惰性缓存，首次引入时加载并缓存

## 中间件

中间件在config.js配置文件中统一管理，框架将按配置顺序依次挂载中间件。方便做参数配置、调序、移除等操作

## ctx扩展变量说明

ctx.collection(collectionName)函数用于获取指定模型，当前为Mongodb

ctx.parameter用于存放url动态参数对象

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
    |    |    |- config.js
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
    |    |
    |    |-- framework
    |    |    |- index.js
    |    |    └─ start.js
    |    | 
    |    └─ db.js
    |
    └─ index.js
```

## 待续

* RESTful将采用探测controller方式实现，优先于其它url处理

* controller目录层级被限制在两层内(深层嵌套会增加管理难度)，可能在极少数场景下不适用

* 增加url地址前缀配置项

* 支持使用自定义路由和自动路由风格的混合路由

* 允许自由定义url与controller的映射关系，或者直接映射到model层，组合效果示例：

```
常规路由
R1 -> C1 -> M(x)

R2 -> C2 -> M(x)

R3 -> C3 -> M(x)
```

```
多个路由指向同一个controller，controller再路由到model
R1 -> C1 -> M1

R2 -> C1 -> M2

R3 -> C1 -> M3
```


```
路由直接指向model
R1 -> M1

R2 -> M2

R3 -> M3
```

