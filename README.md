基于koa 2.0轻量、易扩展的声明式、组件化框架，框架以loader模块加载器为核心，通过app对象贯穿整个应用，为项目提供便捷的功能扩展及跨模块引用等特性。


### 特色

* 强大的组件继承和隔离机制，即插即用

* 多功能路由支持，可自由选择声明式或自动寻址路由

* 在应用隔离机制下可以轻松过渡到微服务化架构

* 简单、轻量、易扩展、高性能


### Usage

```js
let app = require('ioa')

// http服务是可选的，可以按需启动
app.listen(8800)
```

### Install

```
npm install ioa
```

### 目录结构

框架约定的目录结构如下：

```
project
    |-- app
    |    |-- controller              控制器目录（可选）
    |    |    |-- home               多层控制器嵌套
    |    |    |    |- c1.js
    |    |    |    |- c2.js
    |    |    |    └─ ...
    |    |    |
    |    |    └─ index.js
    |    |
    |    |-- middleware               中间件目录 (可选)
    |    |    |- middleware1.js
    |    |    |- middleware2.js
    |    |    └─ ...
    |    |
    |    |-- model                    模型目录（可选）
    |    |    |- model1.js
    |    |    |- model2.js
    |    |    └─ ...
    |    |
    |    |-- extend                    扩展目录（可选）
    |    |    |- application.js
    |    |    └─ context.js
    |    |    └─ $name.js
    |    |
    |    |-- schedule                  定时任务（可选）
    |    |    └─ $name.js
    |    | 
    |    └─ router.js                  路由配置
    |
    |--- config                        配置文件目录
    |    |- default.js                 公用默认配置（可选）
    |    |- development.js             开发环境配置（可选）
    |    |- localhost.js               本地环境配置（可选）
    |    └─ production.js              生产环境配置（可选）
    |
    |--- plugin                        组件目录（可选）
    |    |
    |    |- plugin a                   组件模块，结构与主应用完全一致
    |    |     |- app
    |    |     |- config
    |    |     └─ ...
    |    |
    |    |- plugin b
    |    |     └─ ...
    |    |     
    |    |- config.js                 组件配置文件
    |    |
    |    └─ ...
    |
    |--- static                        静态资源目录
    |    |- logo.img
    |    |- home.css
    |    └─ ...
    |
    |--- test                          测试目录
    |    |- controller
    |    |- middleware
    |    └─ ...
    |
    └─ index.js                        启动入口
```

### 配置文件

支持系统环境变量和临时命令行参数两种方式指定环境变量配置文件，并与default配置文件合并。

#### 系统环境变量

通过配置全局的NODE_ENV变量，变量值必须与其中一个配置文件名同名。内置的配置文件名为localhost、production、development，也可以自定义，只要保证变量名与文件名一致即可。

#### 命令行传参

命令行参数的优先级要高于系统环境变量，因此可以通过命令行传参的方式重置当前命令下的环境变量。


### 路由

在app对象中提供了RESTful风格的路由方法，支持get、post、put、delele、resources，与egg框架的路由设计风格相似。

另外支持目录匹配方式的自动化寻址路由


### 中间件

在app/middleware目录下添加中间件文件，框架自动载入并进行类型检测。

当需要使用全局中间件时，在config.js配置文件middleware属性中添加全局中间件名称，框架按照中间件配置顺序依次执行。

在路由中使用中间件时，通过app.middleware引用中间件，插入到配置项中


```js
// 路由示例
module.exports = app => {

    let { test, token } = app.middleware

    app.get('/', 'index.home')

    app.get('/sms/:sid/sd/:id', test, 'index.sms')

    app.post('/sms/:sid/sd/:sid', test, token, 'index.sms')

    app.post('/login', 'index.login')

    app.put('/login', 'index.login')

    app.delele('/login', 'index.login')

    app.resources('/rest', 'rest')

    // 映射到controller下指定目录
    app.controller('admin')

    // 映射到指定数据模型
    app.module('admin')

    // 路由分组
    app.group('admin', test, {
        "login": [test, 'index.login'],
        "sms": ['index.sms'],
        "cc": {
            "xx": ['index.xx'],
            "jj": ['index.jj']
        },
    })

}
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

框架约定的加载顺序依次为config > extend > plugin > models > middleware > controller


### 扩展

app/extend/目录用于app对象扩展，该目录下的所有模块均会自动加载，将导出结果提升后挂载到app对象上，支持多级目录分组。

> 文件名会被用作扩展名，使用时应避免产生命名冲突。

参考示例如下：

   * app/extend/application.js 对应 app.application
   
   * app/extend/helper.js 对应 app.helper

   * app/extend/db/postgres.js 对应 app.db.postgres

除了框架约定的加载项外，也可以通过app.loader()或config/loader.js配置文件加载指定的模块目录。

app.loader方法通过batch-import库实现，支持目录递归和包含、排除、预处理等特性，具体使用方法请参照[batch-import](https://github.com/xiangle/batch-import)。


#### 注意事项

> 所有extend中的模块如果导出为函数，则被视为注入函数，加载器会隐性执行该函数并注入app对象，最终以函数返回值作为结果，而不是导出函数本身。

> 由于加载器自动执行导出函数的特性，导致在某些场景下你希望导出结果为函数，而不是被隐性执行后的函数。目前的解决方案是使用一个空的包装函数返回另一个你真正需要导出到app的函数。参考示例如下：

```js
let typea = require('typea')

module.exports = function(){
   return typea
}
```


### 组件

在我们的设想中，期望应用更多的以组件形态构建，实现功能解耦、即插即用的目标。

在ioa中我们尝试并实现了这个目标，即将组件视为一个相对独立的子应用，通过强大的组件继承和模块隔离机制，使得组件应用拥有和主应用完全一致的结构、功能和代码。

传统的组件机制通过扩展app对象来增加新的功能，而ioa中的组件机制主要是通过继承app对象，创建新的子app。传统组件机制出于资源冲突的考虑，通常放弃了对路由的支持。但不仅仅是路由，实际上命名冲突随处可见，在同一个app对象中扩展middleware、controller等其它功能也同样面临同名资源冲突的问题。

与众不同的是ioa组件机制利用node.js的模块作用域特性，为每个组件单独注入独立的模块作用域，实现资源隔离与共享，使得组件中的代码与主应用代码完全一致，几乎没有额外的学习成本。


#### 组件继承

每个组件都继承自主应用，共享主应用资源。继承机制参考了web css样式表的继承方式，默认状态下子集以原型的方式继承自父级，使得资源单向传递，子集不会改变父级的状态，父级的状态与子集保持同步。

主应用中通常用于存放公共资源代码，资源会自动继承给子应用。


<!-- #### IO文件（可选）

每个组件中包含io.js，用于管理输入和输出，默认为继承模式。 -->


#### 路由、控制器、模型（可选）

组件内允许定义路由、控制器、模型，使用方法与主应用完全一致。

在框架内middleware、controller等通过模块作用域和多实例，可以实现同名资源隔离，避免访问冲突。

唯独路由是一个例外，所有应用共享同一个路由实例，当存在同名冲突时会进行覆盖并发出警告。


### 微服务化

由于组件应用与主应用完全一致且彼此隔离，在没有主应用依赖的状态下，组件可以作为独立应用单独运行。这种隔离特性使得在渐进式开发中，可以轻松的从单体应用切换到微服务化架构。