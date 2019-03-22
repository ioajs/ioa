## ioa

基于组件化、声明式的全新Node.js框架。

ioa中的组件由多个平级应用构成，每个应用都拥有独立的模块作用域，通过声明式的依赖配置模型实现跨应用资源共享。

不同于常规框架的是ioa更像是一个可定制的应用装载器，它可以在隔离环境下装载多个应用，从而避免资源冲突。通过分级装载策略实现装载生命周期内的任意阶段载入指定模块。

包含主应用、扩展应用、npm组件三种应用模式，在三种模式下均可获得一致的代码结构、同步的生命周期和开发体验，避免产生额外的学习和迁移成本。

ioa框架遵循按需引入原则，其核心部分足够的精简，即使http服务也是以组件扩展的方式按需引入的。

### 特性

* 组件即应用，采用组件化、水平扩展架构

* 每个组件拥有完全独立的模块作用域、一致的代码结构和功能

* 支持模块分级同步装载，可动态调整模块的装载顺序，实现框架全生命周期管理

<!-- * 支持异步模块装载，减少async/await异步函数链，优化异步编程体验 -->

* 可通过依赖配置文件进行资源互访，实现强大的资源隔离与共享机制

* 应用间使用只读的单向数据流传递依赖，减少跨组件污染

* 支持使用npm发布、管理组件间的版本和依赖关系

* 支持渐进式开发，从单点、多点应用再到微服务化、分布式架构，满足弹性扩张需求

* 在应用隔离机制下可以轻松过渡到微服务化架构

* 多功能路由支持，可自由选择声明式或自动寻址路由

* 简单、轻量、易扩展、高性能


### Install

```
npm install ioa
```


### Usage

```js
const ioa = require('ioa')

ioa.http()
```

### 目录结构

```
project
    |
    |-- main
    |    |-- config               配置文件目录
    |    |    |- default.js       公用默认配置
    |    |    |- localhost.js     本地环境配置
    |    |    |- development.js   开发环境配置
    |    |    └─ production.js    生产环境配置
    |    |    └─ $name.js         自定义环境配置
    |    |
    |    |-- model                模型目录
    |    |    |- $name.js
    |    |    └─ ...
    |    |
    |    |-- middleware           中间件目录
    |    |    |- $name.js
    |    |    └─ ...
    |    |
    |    |-- service              抽象服务层
    |    |    |- $name.js
    |    |    └─ ...
    |    |
    |    |-- controller           控制器目录
    |    |    |-- home            多层控制器嵌套
    |    |    |    |- $name.js
    |    |    |    └─ ...
    |    |    |- ...
    |    |    |
    |    |    └─ $name.js
    |    |
    |    |-- schedule             定时任务
    |    |
    |    |-- .loader.js           分级装载配置文件，支持任意子目录
    |    |
    |    |-- .import.js           依赖关系配置文件
    |    | 
    |    └─ router.js             路由配置文件
    |
    |-- logger                    日志存档，按日期分组保存
    |
    |-- static                    静态资源目录
    |
    |-- app.config.js             组件配置文件，支持.json格式
    |
    └─  index.js                  启动入口
```

### 分级装载

ioa中引入了目录和模块装载等级的概念，用于管理应用在启动阶段的生命周期。

在传统框架中通常通过钩子函数来执行特定阶段的代码，生命周期钩子的优点是相对简单、易于理解，缺点是缺乏灵活性、扩展性。

ioa中使用模块分级装载策略来管理生命周期，这使得你可以在框架装载的任意阶段创建无限个平级或上下级装载点，自由管理装载流程。


### 约定装载等级

为了在多个组件间建立统一的加载生命周期，实现跨组件兼容，需要按约定来加载模块。

ioa约定了几个常见目录的装载等级如下：

directory | level
--- | ---
config | 10
model | 20
middleware | 30
service | 40
controller | 50


#### .loader.js 自定义装载等级配置文件

当两个平级模块间存在依赖关系，水平自动装载无法满足需求时，可通过.loader.js文件调整模块间的装载顺序，且每个子目录均支持可选的.loader.js文件。

.loader.js配置文件的解析、执行由lloader模块提供，它是构成ioa框架的核心库，关于装载器的更多功能和配置细节请参考[lloader](https://github.com/xiangle/lloader)。

配置参考示例：

```js
module.exports = {
   'config': {
      level: 10
   },
   'models': {
      level: 20
   },
   'controllers': {
      level: 40
   }
}
```

### 组件作用域

框架在启动时会为每个组件生成私有的@app引用模块，用于访问当前组件级对象。

@app模块仅用于组件作用域内使用，在组件作用域外应该使用ioa模块。

```js
const { middleware } = require('@app')
```

#### 组件对象示例

```js
{
   apps: Object,
   config: {
      middleware: [String]
   },
   model: {
      compcerts: Object
   },
   middleware: {
      cors: Function,
      token: Function
   },
   AppMiddleware: [Function],
   controller: {
      user: {
         index: Function,
         details: Function,
         create: Function,
         update: Function,
         destroy: Function
      }
   },
   router: {
      get: Function,
      post: Function,
      put: Function,
      delete: Function,
      resources: Function
   }
}
```


### 组件化

在我们的设想中，期望应用更多的以组件形态构建，实现功能解耦、即插即用的目标。

在ioa中我们尝试并实现了这个目标，即将每个组件视为一个独立应用，通过强大的模块隔离和共享机制，使得组件彼此间结构、功能、代码一致。

传统框架中通常使用单容器、集中式架构，将所有资源都挂载到一个根容器中。随着应用代码量的不断增加，依赖关系变得越来越模糊，后续扩展和维护的成本也越来越高。在ioa中通过组件机制对业务逻辑进行进一步拆分和细化，你可以根据需求或个人喜好自由的调整拆分粒度。

在很多主流框架中出于资源冲突的考虑，通常放弃了在插件中对router和controller的支持，根本原因是在单个app容器中很难解决资源冲突的问题。ioa中的组件化实现利用了node.js模块的就近装载原则，为每个组件目录注入独立的模块作用域，实现组件资源隔离与解耦。


### 微服务化

由于组件应用相互隔离，在无外部依赖的状态下，每个组件都可以作为独立应用单独运行。这种高度解耦特性使得在渐进式开发中，可以轻松的从单体应用切换到微服务化架构。


### 配置文件

ioa支持通过系统环境变量来动态切换配置文件，并与default配置文件合并。

默认的环境变量名称为localhost、development、production，缺省状态下以production作为环境变量。

框架并没有限制必须使用指定的环境变量名，实际上你可以自由的定义环境变量名和增加任意数量的环境变量配置文件，只要确保环境变量名与配置文件名命名一致即可自动装载对应的配置文件。

### 系统环境变量

ioa支持NODE_ENV和PORT两个外部环境变量，可选择全局持久化环境变量和命令行临时环境变量两种方式进行赋值。

#### NODE_ENV

通过配置全局的NODE_ENV环境变量，实现不同运行环境下的差异化配置。

NODE_ENV通常被定义为全局变量，如果需要临时切换环境变量配置文件，则应该使用零时变量。

#### PORT

PORT变量通常被定义为临时变量，如在应用上线前做最后的生产环境测试，为了避免端口占用导致启动失败，需要临时调整端口号。

PORT环境变量优先级高于配置文件中的app.config.port值

#### 配置示例

命令行中临时环境变量的优先级要高于系统环境变量，因此可以通过命令行传参的方式覆盖系统环境变量。

#### 示例

在生产环境下临时切换到本地环境

Linux
```sh
NODE_ENV=localhost node index.js
```

PowerShell
```ps
$env:NODE_ENV='localhost'; node index.js
```

CMD
```ps
set NODE_ENV='localhost' & node index.js
```

### app.config.js 组件配置文件

组件配置文件用于定义组件名称、组件类型、管理组件状态以及如何装载组件。

* $name `String` - 组件名称（当package、path属性均为缺省状态时，$name对应apps目录中的组件名）

   * enable `Boolean` - 是否启用当前组件

   * package `String` - 指定npm组件名，框架以npm模块方式加载组件

   * path `String` - 通过绝对路径加载组件，路径中需要包含应用名

#### 示例

```js
module.exports = {
   "admin": {
      "enable": true
   },
   "other": {
      "enable": true
   },
   "user": {
      "enable": true,
      "path": "D:/Nodejs/Project/user"
   }
}
```

### 路由

app.router对象中提供了get、post、put、delele路由声明方法，支持用resources批量定义RESTful路由，与egg的路由设计风格类似。

ioa中同时支持声明式和自动寻址两种路由模式：


#### 声明式路由

声明式路由具有高度灵活和可定制url的特性。允许随意定义url格式，调用任意middleware、controller，但每个url都需要单独定义。

```js
const { router } = require('@app')

router.get('/', 'index.home')

router.get('/sms/:sid/sd/:id', 'index.sms')

router.post('/sms/:sid/sd/:sid', 'index.sms')

router.post('/login', 'index.login')

router.put('/login', 'index.login')

router.delele('/login', 'index.login')

// 分组路由
router.group('admin', {
    "login": ['index.login'],
    "sms": ['index.sms'],
    "cc": {
        "xx": ['index.xx'],
        "jj": ['index.jj']
    },
})
```

#### 自动寻址路由

指定一个controller目录，路由解析器根据目录结构自动寻址，不再需要单独配置每个路由。这对于常规、标准化路由的定义非常方便，但是缺乏灵活性。

```js
// 映射到controller/admin目录
router.controller('admin')
```

#### RESTful路由

RESTful路由与Controller的映射关系

Method | Path |  Controller.Action
--- | --- | ---:
GET | /test | index
GET | /test/:id | details
POST | /test | create
PUT | /test/:id | update
DELETE | /test/:id | destroy


```js
// 自动生成get、post、put、delete
router.resources('/rest', 'rest')
```


### 中间件

在$app/middleware目录下添加中间件文件，框架自动载入并进行类型检测。

#### 路由中间件

在路由中使用中间件时，通过app.middleware引用中间件，插入到配置项中。

```js
const { test, token } = app.middleware

router.get('/', test, token, 'index.home')
```

#### 应用级中间件

应用级中间件的作用域仅在当前应用内有效，通过config/$.js文件中的middleware数组中进行配置，在数组中添加中间件名称，框架按顺序调用中间件。

```js
module.exports = {
   middleware: ['cors', 'a', 'b']
}
```


#### 全局中间件

当需要使用全局中间件时，通过app.AppsMiddleware数组进行添加。

```js
const cors = require('@koa/cors')

app.AppsMiddleware.push(cors({ origin: '*' }))
```


### model

在$app/model目录下创建模型配置文件，框架自动载入并进行类型检测，在controller中通过app.model访问模型，支持多级目录分组。


### controller

在$app/controller目录下创建控制器文件，框架自动载入并进行类型检测，支持多级目录分组。


### 日志

日志功能由loggercc模块提供，参考链接：https://github.com/xiangle/loggercc