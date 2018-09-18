基于koa 2.0轻量、易扩展的声明式、组件化框架。框架以loader模块加载器为核心，通过app对象贯穿整个应用，为项目提供便捷的功能扩展及跨模块引用等特性。


### 特色

* 组件即应用，创新的组件化设计拥有与主应用完全一致的功能和代码结构

* 强大的组件隔离和共享机制，通过io接口文件进行资源互访

* 多功能路由支持，可自由选择声明式或自动寻址路由

* 在应用隔离机制下可以轻松过渡到微服务化架构

* 简单、轻量、易扩展、高性能

### Install

```
npm install ioa
```

### Usage

```js
const app = require('ioa')

app.listen(8800)
```

### 目录结构

框架约定的目录结构如下：

```
project
    |
    |-- app
    |    |
    |    |-- config                  配置文件目录（可选）
    |    |    |
    |    |    |- default.js          公用默认配置（可选）
    |    |    |- development.js      开发环境配置（可选）
    |    |    |- localhost.js        本地环境配置（可选）
    |    |    └─ production.js       生产环境配置（可选）
    |    |
    |    |-- extend                  扩展目录（可选）
    |    |    |
    |    |    └─ $name.js
    |    |
    |    |-- model                   模型目录（可选）
    |    |    |
    |    |    |- $name.js
    |    |    └─ ...
    |    |
    |    |-- middleware              中间件目录 (可选)
    |    |    |
    |    |    |- $name.js
    |    |    └─ ...
    |    |
    |    |-- controller              控制器目录（可选）
    |    |    |
    |    |    |-- home               多层控制器嵌套（可选）
    |    |    |    |- $name.js
    |    |    |    └─ ...
    |    |    |- ...
    |    |    |
    |    |    └─ index.js
    |    |
    |    |-- schedule                定时任务（可选）
    |    | 
    |    └─ router.js                路由配置（可选）
    |
    |-- component                    组件目录（可选）
    |    |
    |    |- component A              组件模块，结构与主应用完全一致
    |    |     |- app
    |    |     └─ ...
    |    |
    |    |- component B 
    |    |     |- app
    |    |     └─ ...
    |    |- ...
    |    |
    |    └─ config.js                组件配置文件（可选）
    |
    |-- logger                       日志存档，按日期分组保存（可选）
    |
    |-- static                       静态资源目录（可选）
    |
    └─  index.js                     启动入口（可选）
```

### 配置文件

支持系统环境变量和临时命令行参数两种方式指定环境变量配置文件，并与default配置文件合并。

#### 系统环境变量

通过配置全局的NODE_ENV变量，变量值必须与其中一个配置文件名同名。内置的配置文件名为localhost、production、development，也可以自定义，只要保证变量名与文件名一致即可。

#### 命令行传参

命令行参数的优先级要高于系统环境变量，因此可以通过命令行传参的方式重置当前命令下的环境变量。


### 路由

app对象中提供了get、post、put、delele路由声明方法，支持用resources批量定义RESTful路由，与egg的路由设计风格类似。

ioa中同时支持声明式和自动寻址两种路由模式：

#### 声明式路由

声明式路由具有高度灵活和可定制url的特性。允许随意定义url格式，调用任意middleware、controller，但每个url都需要单独定义。

#### 自动寻址路由

指定一个controller目录，路由解析器根据目录结构自动寻址，不再需要单独配置每个路由。这对于常规、标准化路由的定义非常方便，但是缺乏灵活性。

#### 示例

```js
app.get('/', 'index.home')

app.get('/sms/:sid/sd/:id', 'index.sms')

app.post('/sms/:sid/sd/:sid', 'index.sms')

app.post('/login', 'index.login')

app.put('/login', 'index.login')

app.delele('/login', 'index.login')

app.resources('/rest', 'rest')

// 映射到controller/admin目录
app.controller('admin')

// 路由分组
app.group('admin', {
    "login": ['index.login'],
    "sms": ['index.sms'],
    "cc": {
        "xx": ['index.xx'],
        "jj": ['index.jj']
    },
})
```

### 中间件

在app/middleware目录下添加中间件文件，框架自动载入并进行类型检测。

当需要使用全局中间件时，在config.js配置文件middleware属性中添加全局中间件名称，框架按照中间件配置顺序依次执行。

在路由中使用中间件时，通过app.middleware引用中间件，插入到配置项中

#### 示例

```js
const { test, token } = app.middleware

app.get('/',test, token, 'index.home')
```


#### RESTful路由与Controller映射关系

Method | Path |  Controller.Action
--- | --- | ---:
GET | /test | index
GET | /test/:id | details
POST | /test | create
PUT | /test/:id | update
DELETE | /test/:id | destroy


### 模型（可选）

在app/models目录下创建模型文件，框架自动载入并进行类型检测，在controller中通过app.models引用，支持多级目录分组。

常见ORM库通常使用独立模型文件，框架仅提供app/models目录下模型文件的批量导入功能。


### 控制器

在app/controller目录下创建控制器文件，框架自动载入并进行类型检测，支持多级目录分组。


### 加载顺序

框架约定的加载顺序依次为config > extend > models > middleware > controller


### 扩展

app/extend目录用于扩展app对象，该目录下的所有模块均会自动加载，将导出结果提升后挂载到app对象上，支持多级目录分组。

> 文件名会被用作扩展名，使用时应避免产生命名冲突。

参考示例如下：

```
app/extend/application.js 对应 app.application

app/extend/helper.js 对应 app.helper

app/extend/db/postgres.js 对应 app.db.postgres
```


### 组件

在我们的设想中，期望应用更多的以组件形态构建，实现功能解耦、即插即用的目标。

在ioa中我们尝试并实现了这个目标，即将组件视为一个相对独立的子应用，通过强大的模块隔离和共享机制，使得组件应用拥有和主应用完全一致的结构、功能和代码。

传统插件机制出于资源冲突的考虑，通常放弃了对路由的支持。实际上不仅仅是路由，在同一个app对象中扩展middleware、controller等其它功能也同样面临同名资源冲突的问题。

ioa组件机制利用node.js的模块作用域特性，为每个组件单独注入独立的模块作用域，实现资源隔离与共享，使得组件中的代码与主应用代码完全一致，几乎没有额外的学习成本。


#### IO共享文件（可选）

每个组件都可以通过io.js接口配置文件与主框架共享资源，通过声明式的in/out对象模型，可直观的查看和管理资源的输入、输出。


#### 路由、控制器、模型（可选）

组件内允许定义路由、控制器、模型，使用方法与主应用完全一致。

在框架内middleware、controller等通过模块作用域和多实例，可以实现同名资源隔离，避免访问冲突。

唯独路由是一个例外，所有应用共享同一个路由实例，当存在同名冲突时会进行覆盖并发出警告。


### 微服务化

由于组件应用与主应用完全一致且彼此隔离，在没有主应用依赖的状态下，组件可以作为独立应用单独运行。这种隔离特性使得在渐进式开发中，可以轻松的从单体应用切换到微服务化架构。


### 日志

日志功能由loggercc模块提供，参考链接：https://github.com/xiangle/loggercc