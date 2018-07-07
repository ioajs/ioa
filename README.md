基于Koa 2.0的易扩展、声明式框架，看起来其实更像一个基于约定的loader模块加载器，通过app对象贯穿整个应用，为项目提供便捷的功能扩展及快速引用等特性。

### Install

```
npm install newseed
```

### Usage

```js
// 仅使用框架来管理模块
let app = require('newseed')

// http服务不是必备的，可以按需启动
app.listen({ port: 8800 })
```

## 中间件

在app/middleware目录下创建中间件文件，框架自动载入并进行类型检测。

当使用全局中间件时，在config.js配置文件中通过middleware属性添加全局中间件，框架按照中间件配置顺序依次挂载。

在路由中使用中间件时，通过app.middleware引用中间件，插入到配置项中

## 路由

在app对象中提供了RESTful风格的路由方法，支持get、post、put、delele、resources，与egg框架的路由设计风格相同

### resources路由与controller的映射关系

* GET /test - index
* GET /test/:id - details
* POST /test - create
* PUT /test/:id - update
* DELETE /test/:id - destroy

```js
// 路由中间件配置示例
module.exports = app => {

   let { test, token } = app.middleware

   app.get('/', 'index.home')

   app.get('/sms/:sid/sd/:id', test, 'index.sms')

   app.post('/sms/:sid/sd/:sid', test, token, 'index.sms')

   app.post('/login', 'index.login')

   app.put('/login', 'index.login')

   app.delele('/login', 'index.login')
   
   app.resources('/rest', 'rest')

}
```

<!-- ### 手动配置路由（当前）

手动配置路由规则，路由会根据预定义路径定位到指定controller和action

优点：

* 灵活，允许随意定义url与controller的映射关系

缺点：

* 需要手动配置路由


### 自动寻址路由（弃用）

利用目录/文件映射关系自动寻址，不需要手动配置路由，路由会根据url规则自动定位到指定action。

优点：

* 简单，不需要配置路由即可使用

缺点：

* 不够灵活，使用固定的寻址规则，会与手动路由参数冲突。 -->


## 模型（可选）

在app/models目录下创建模型文件，框架自动载入并进行类型检测，在controller中通过app.models引用。

常见ORM库通常使用独立模型文件，框架仅提供app/models目录下模型文件的批量导入功能。


## 控制器

在app/controller目录下创建控制器文件，框架自动载入并进行类型检测。


## 目录结构

```
example
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
    |    |-- extend
    |    |    |- application.js
    |    |    └─ context.js
    |    |
    |    |
    |    |
    |    |--- plugin
    |    |    |- plugin1.js
    |    |    |- plugin2.js
    |    |    |- ...
    |    |    └─ ...
    |    | 
    |    | 
    |    └─ router.js
    |
    └─ index.js
```


## 加载顺序

   框架约定的加载顺序依次为config > extend > plugin > models > middleware > controller


## 框架扩展

   框架app/extend/目录提供application.js、context.js用于app、ctx对象扩展。

   除了框架约定的加载项外，我们还提供app.loader方法用于自定义加载模块目录，方便开发者进行框架扩展。

   app.loader方法通过batch-import库实现，支持目录递归和包含、排除、预处理等特性，具体使用方法请参照[https://github.com/xiangle/batch-import](https://github.com/xiangle/batch-import)。


## 插件（开发中）

我们期望应用更多的以插件方式构建，每个插件相当于一个微型应用，其目录结构与主应用完全一致，拥有独立的运行环境，同时允许应用间资源共享。实现功能模块化、标准化、即插即用的需求。

### 公共区

每个插件中包含common.js，用于资源互访。

### 路由（可选）

插件中允许定义路由，当存在路由冲突时会发出警告。

### 控制器

和主应用一致，但彼此隔离

### 模型（可选）

和主应用一致，但彼此隔离