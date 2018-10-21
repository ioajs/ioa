## ioa

基于组件化、声明式的全新Node.js & Koa框架。不同于其它框架的是ioa更像是一个框架装载器，可以在隔离环境下装载多个应用，通过分级策略实现装载生命周期内的任意阶段载入指定模块代码。

ioa中的组件由多个平级应用构成，每个应用都拥有独立的模块作用域，通过声明式的依赖配置模型实现跨应用资源共享。拥有常规单体应用的所有功能和一致的代码结构，包括对独立controller、router的支持。

不管是在多应用、单应用还是npm组件模式下均可获得一致的开发体验，避免产生额外的学习和迁移成本。可以很轻松的在多种应用模式间切换，进行应用分离、应用整合或将应用发布为npm组件模块等操作。


### 特色

* 组件即应用，采用多组件、扁平化架构

* 每个组件拥有完全独立的作模块用域、一致的代码结构和功能

* 支持模块分级加载，可动态调整模块的装载顺序

* 支持多点和单点两种应用模式，框架根据目录结构自动进行模式匹配

* 通过io依赖配置文件进行资源互访，实现强大的资源隔离与共享机制

* 应用间使用只读的单向数据流传递依赖，减少跨组件污染

* 支持使用npm发布、管理组件间的版本和依赖关系

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

ioa同时支持单点和多点两种应用模式，结构如下：

#### 多点应用

在多点应用模式下，框架会为每个子应用注入独立的模块作用域，实现资源隔离，同时通过.import.js配置文件进行资源共享。

```
project
    |
    |-- apps
    |    |-- main                      默认的主应用目录
    |    |    |-- config               配置文件目录
    |    |    |    |- default.js       公用默认配置
    |    |    |    |- localhost.js     本地环境配置
    |    |    |    |- development.js   开发环境配置
    |    |    |    └─ production.js    生产环境配置
    |    |    |
    |    |    |-- model                模型目录
    |    |    |    |- $name.js
    |    |    |    └─ ...
    |    |    |
    |    |    |-- middleware           中间件目录
    |    |    |    |- $name.js
    |    |    |    └─ ...
    |    |    |
    |    |    |-- service              抽象服务层
    |    |    |    |- $name.js
    |    |    |    └─ ...
    |    |    |
    |    |    |-- controller           控制器目录
    |    |    |    |-- home            多层控制器嵌套
    |    |    |    |    |- $name.js
    |    |    |    |    └─ ...
    |    |    |    |- ...
    |    |    |    |
    |    |    |    └─ $name.js
    |    |    |
    |    |    |-- schedule             定时任务
    |    |    |
    |    |    |-- .loader.js           分级装载配置文件，支持任意子目录
    |    |    |
    |    |    |-- .import.js               依赖关系配置文件
    |    |    | 
    |    |    └─ router.js             路由配置文件
    |    |
    |    |-- app *
    |    |    |-- ....
    |    | 
    |    └─  app *
    |         |-- ...
    |
    |-- logger                         日志存档，按日期分组保存
    |
    |-- static                         静态资源目录
    |    
    |-- package-app.json               组件配置文件
    |
    └─  index.js                       启动入口
```

#### 单点应用

单节点模式即只有一个中心节点的常规应用，该模式主要用于发布npm组件，另外也可以直接驱动小型项目。

```
project
    |
    |-- app
    |    |-- config               配置文件目录
    |    |    |- default.js       公用默认配置
    |    |    |- localhost.js     本地环境配置
    |    |    |- development.js   开发环境配置
    |    |    └─ production.js    生产环境配置
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
    |    |-- .import.js               依赖关系配置文件
    |    | 
    |    └─ router.js             路由配置文件
    |
    |-- logger                    日志存档，按日期分组保存
    |
    |-- static                    静态资源目录
    |
    |-- package-app.json          组件配置文件
    |
    └─  index.js                  启动入口
```


### 装载等级

ioa中引入了目录和模块装载等级的概念，这使得你可以在框架装载的任意阶段创建无限个平级或上下级装载点，自由管理装载流程。

#### 默认装载等级

在./apps目录下的所有组件应用均采用分级加载策略，框架中内置了几个常见目录的默认装载等级：

directory | level
--- | ---
config | 10
model | 20
middleware | 30
service | 40
controller | 50

除了内置目录外的所有目录、模块（不限层级）均支持自动装载，它们的默认装载等级为100。多个模块在平级状态下装载时不分先后，意味着平级模块在装载阶段不因该存在依赖关系。

#### 自定义装载等级

当两个平级模块间存在依赖关系，水平自动装载无法满足需求时，可通过.loader.js文件调整模块间的装载顺序，且每个子目录均支持可配置的.loader.js文件。配置示例如下：

```js
module.exports = {
   'config': {
      level: 10
   },
   'models': {
      level: 20,
      module(data) {

      }
   },
   'controllers': {
      level: 40,
      directory(data) {
          
      }
   },
   'role': false
}
```

#### lloader

ioa的装载器由lloader模块提供，它是构成ioa框架的核心库，关于装载器的更多配置细节请参考[https://github.com/xiangle/lloader](https://github.com/xiangle/lloader)

### 组件化

在我们的设想中，期望应用更多的以组件形态构建，实现功能解耦、即插即用的目标。

在ioa中我们尝试并实现了这个目标，即将每个组件视为一个独立应用，通过强大的模块隔离和共享机制，使得组件彼此间结构、功能、代码一致。

传统框架中通常使用单容器、集中式架构，将所有资源都挂载到一个根容器中。随着应用代码量的不断增加，依赖关系变得越来越模糊，后续扩展和维护的成本也越来越高。

在很多主流框架中出于资源冲突的考虑，通常放弃了在插件中对router和controller的支持，根本原因是在单个app容器中很难解决资源冲突的问题。ioa中的组件化实现利用了node.js模块的就近装载原则，为每个组件目录注入独立的模块作用域，实现组件资源隔离与解耦。


### 微服务化

由于组件应用相互隔离，在无外部依赖的状态下，每个组件都可以作为独立应用单独运行。这种高度解耦特性使得在渐进式开发中，可以轻松的从单体应用切换到微服务化架构。


### IO依赖文件（可选）

每个组件内都支持.import.js接口配置文件，用于描述当前应用与其它应用之间的依赖关系。

```js
module.exports = {
   'db': {
      'Sequelize': true,
      'sequelize': true
   },
   'base': {
      'middleware': {
         cors: true
      }
   }
}
```


### 配置文件

配置文件支持系统环境变量和临时命令行参数两种方式指定环境变量配置文件，并与default配置文件合并。

#### 系统环境变量

通过配置全局的NODE_ENV变量，变量值必须与其中一个配置文件名同名。内置的配置文件名为localhost、production、development，也可以自定义，只要保证变量名与文件名一致即可。

#### 命令行传参

命令行参数的优先级要高于系统环境变量，因此可以通过命令行传参的方式重置当前命令下的环境变量。


### 路由

app对象中提供了get、post、put、delele路由声明方法，支持用resources批量定义RESTful路由，与egg的路由设计风格类似。

ioa中同时支持声明式和自动寻址两种路由模式：


#### 声明式路由

声明式路由具有高度灵活和可定制url的特性。允许随意定义url格式，调用任意middleware、controller，但每个url都需要单独定义。

```js
app.get('/', 'index.home')

app.get('/sms/:sid/sd/:id', 'index.sms')

app.post('/sms/:sid/sd/:sid', 'index.sms')

app.post('/login', 'index.login')

app.put('/login', 'index.login')

app.delele('/login', 'index.login')

// 分组路由
app.group('admin', {
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
app.controller('admin')
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
app.resources('/rest', 'rest')
```


### 中间件

在$app/middleware目录下添加中间件文件，框架自动载入并进行类型检测。

#### 路由中间件

在路由中使用中间件时，通过app.middleware引用中间件，插入到配置项中。

```js
const { test, token } = app.middleware

app.get('/',test, token, 'index.home')
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