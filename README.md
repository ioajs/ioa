基于koa 2.0轻量、易扩展的声明式框架，整体看起来其实更像一个基于约定的loader模块加载器，通过app对象贯穿整个应用，为项目提供便捷的功能扩展及快速引用等特性。

### Install

```
npm install ioa
```

### Usage

```js
// 仅使用框架来管理模块
let app = require('ioa')

// http服务不是必备的，可以按需启动
app.listen(8800)
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
    |    |    |- application.js
    |    |    └─ context.js
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
    |--- plugin                        插件目录（可选）
    |    |
    |    |- plugin1
    |    |     |- app
    |    |     |- config
    |    |     |- static
    |    |     └─ ...
    |    |
    |    |- plugin2
    |    |     └─ ...
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
    └─ index.js                        启动入口文件
```

### 配置文件

支持系统环境变量和命令行传参两种方式来指定配置文件。

#### 系统环境变量

通过配置全局的NODE_ENV变量，变量值必须与其中一个配置文件名同名。内置的配置文件名为localhost、production、development，也可以自定义，只要保证变量名与文件名一致即可。

#### 命令行传参

命令行参数的优先级要高于系统环境变量，因此可以通过命令行传参的方式重置当前命令下的环境变量。


### 中间件

在app/middleware目录下创建中间件文件，框架自动载入并进行类型检测。

当需要使用全局中间件时，在config.js配置文件middleware属性中添加全局中间件名称，框架按照中间件配置顺序依次执行。

在路由中使用中间件时，通过app.middleware引用中间件，插入到配置项中

### 路由

在app对象中提供了RESTful风格的路由方法，支持get、post、put、delele、resources，与egg框架的路由设计风格相同

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


### 模型（可选）

在app/models目录下创建模型文件，框架自动载入并进行类型检测，在controller中通过app.models引用。

常见ORM库通常使用独立模型文件，框架仅提供app/models目录下模型文件的批量导入功能。


### 控制器

在app/controller目录下创建控制器文件，框架自动载入并进行类型检测。


### 加载顺序

框架约定的加载顺序依次为config > extend > plugin > models > middleware > controller


### app扩展

框架app/extend/目录用于app对象扩展，该目录拥有自动加载特性，目录下的所有模块都会以模块路径映射的方式挂载到app目录下，且不限制层级。

文件名被用于扩展名，使用时应避免产生命名冲突。

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
let check = require('check-data')

module.exports = function(){
   return check
}
```


### 插件（规划中）

我们期望应用更多的以插件方式构建，真正实现插件即应用的目标。每个插件可以视为一个完全独立的微型应用，其目录结构与主应用完全一致，也可以作为一个独立应用单独运行。

实现功能模块化、标准化、即插即用的需求。

框架提供了一种混合机制，可以将多个小应用合并为一个更大的应用，也可以轻松的拆分他们单独运行。

当微应用以插件形态工作时，插件会共享主应用资源。

#### 接口文件

每个插件中包含io.js，用于资源互访。

#### 路由（可选）

插件中允许定义路由，当存在路由冲突时会发出警告。

#### 控制器

和主应用一致，但彼此隔离

#### 模型（可选）

和主应用一致，但彼此隔离