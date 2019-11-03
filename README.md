## ioa

不同于常规的Web框架，ioa.js仅仅是一个应用加载器。遵循按需引入原则，其核心功能足够的轻量，且不集成任何与http相关的服务。

ioa.js中的组件由多个平行应用构成，每个组件都拥有独立的模块作用域，从而尽量避免资源冲突。通过声明式的依赖关系配置模型，实现跨多个应用共享组件资源。

由于基于水平加载策略，因此开发者可以自由的管理应用启动阶段的生命周期，而不必受限于常规框架的种种约束。

使用ioa可以按自己的喜好轻松实现定制化框架，也可以与现有框架搭配使用。该项目倾向于使用koa，对于express也同样适用。

### 特性

* 组件即应用，采用组件化、水平扩展架构

* 每个组件拥有相对隔离的组件作用域、一致的代码结构和功能

* 支持模块分级平行装载，可灵活编排模块的装载顺序，实现启动阶段的全生命周期管理

* 通过订阅/发布机制实现组件依赖注入和多级依赖复用，组件之间通过自由组合，可合成新的组件

* 在使用加载器时，可以将应用中的目录、js文件视为可定制的树状对象结构

* 支持使用npm发布、管理组件间的版本和依赖关系

* 支持单应用、多应用、组件模式平滑过渡，满足渐进式扩展需求

* 轻量、简洁、高性能


### Install

```
npm install ioa
```


### Usage

```js
const ioa = require('ioa');

ioa.loader("./main");
```

### 目录结构

以下目录结构仅为约定，ioa框架本身并不限制目录结构和加载等级。虽然开发者可以在index.js文件中自由定义每个应用的目录结构，但是只有遵循统一的约定，才能更好的实现组件资源共享。

```
project
    |
    |-- $main    $app    $app    ...
    |    |
    |    | -- index.js           分级装载入口文件
    |    |
    |    • <--- 0
    |    • <--- 5
    |    |
    |    10 -- config             配置文件目录
    |    |    |- default.js       公用默认配置
    |    |    |- localhost.js     本地环境配置
    |    |    |- development.js   开发环境配置
    |    |    └─ production.js    生产环境配置
    |    |    └─ $name.js         自定义环境配置
    |    |
    |    • <--- 15
    |    • <--- 16
    |    |
    |    20 -- model              模型目录
    |    |    |- $name.js
    |    |    └─ ...
    |    |
    |    • <--- 26
    |    |
    |    30 -- middleware         中间件目录
    |    |    |- $name.js
    |    |    └─ ...
    |    |
    |    40 -- service            抽象服务层
    |    |    |- $name.js
    |    |    └─ ...
    |    |
    |    • <--- 42
    |    • <--- 45
    |    |
    |    50 -- controller         控制器目录
    |    |    |-- home            多层控制器嵌套
    |    |    |    |- $name.js
    |    |    |    └─ ...
    |    |    |- ...
    |    |    |
    |    |    └─ $name.js
    |    |
    |    • <--- 60
    |    • <--- 70
    |    |
    |    80 -- router.js          路由配置文件
    |    |
    |    ：
    |
    |-- logger                    日志存档，按日期分组保存
    |
    |-- static                    静态资源目录
    |
    └─  index.js                  启动入口
```


### ioa.loader([config]) 配置参数

应用配置参数用于声明要装载的应用及如何装载。

config中的第一个配置项被视为主应用，扩展组件的配置项在主应用的config目录中统一配置，框架自动分发到对应的扩展组件。

* $path `String` - 应用路径，支持相对路径或绝对路径

   * enable `Boolean` - 是否启用应用

   * components `Object` - 应用依赖的组件
   

#### 启动配置示例

```js
const ioa = require('ioa');

ioa.loader("./main", "./admin");
```


### 分级装载

ioa中引入了目录和模块装载等级的概念，用于管理应用在启动阶段的生命周期。

在传统框架中通常通过钩子函数来执行特定阶段的代码，生命周期钩子的优点是相对简单、易于理解，缺点是缺乏灵活性、扩展性。

由于ioa使用自定义模块分级装载策略来管理生命周期，这使得你可以在框架装载的任意阶段创建无限个平级或上下级装载点，自由管理装载流程。


### 约定装载等级

为了在多个组件间建立统一的加载生命周期，实现跨组件兼容，需要按约定来加载模块。

ioa约定了几个常见目录、模块的装载等级如下：

Node | Level
--- | ---
config | 10
model | 20
middleware | 30
service | 40
controller | 50
router.js | 80

#### index.js 装载项目入口文件

当两个平级模块间存在依赖关系，水平自动装载无法满足需求时，可通过index.js文件调整模块间的装载顺序。

index.js文件的解析、执行由lloader模块提供，它是构成ioa框架的核心库，关于装载器的更多功能和配置细节请参考[lloader](https://github.com/xiangle/lloader)。

配置参考示例：

```js
const app = require('@app');

app.on('@ioa/config');
app.on('@ioa/koa');

app.loader({
   "model": {
      "level": 20,
   },
   "middleware": {
      "level": 30
   },
   "controller": {
      "level": 50,
      module(func) {
         if (func.prototype) {
            return new func();
         }
         return func;
      }
   },
})
```

### 组件作用域

组件按功能可分为应用类组件和扩展类组件，支持相对路径、绝对路径、模块路径三种导入方式。

框架在启动时会自动为每个组件生成私有的@app引用模块，作为当前组件的容器。

@app模块仅用于组件作用域内使用，在组件作用域外应该使用ioa模块。

```js
const { middleware } = require('@app');
```

### 组件化

在我们的设想中，期望应用更多的以组件形态构建，实现功能解耦、即插即用的目标。

在ioa中我们尝试实现这个目标，即将每个组件视为一个独立应用，并在模块间建立隔离和共享机制。

传统框架中通常使用单一容器、集中式架构，将所有资源都挂载到一个根容器中。随着应用代码量的不断增加，依赖关系变得越来越模糊，命名冲突问题也越来越突出，后续扩展和维护的成本也越来越高。在ioa中通过组件机制对业务逻辑进行进一步拆分和细化，你可以根据需求或个人喜好自由的调整拆分粒度。

很多主流框架出于资源冲突的考虑，通常放弃了在插件中对router和controller的支持，根本原因是在单个app容器中很难优雅的解决资源冲突问题。ioa中的组件化实现利用了node.js模块的就近装载原则，为每个组件目录注入独立的模块作用域，实现组件资源隔离与解耦。

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


### 相关组件及模块

* [consoln](https://github.com/xiangle/consoln) - ioa.js集成的日志、console、debug模块

* [@ioa/config](https://github.com/ioajs/ioa-config) - ioa.js config组件，用于加载config目录下的配置文件

* [@ioa/koa](https://github.com/ioajs/ioa-koa) - 集成koa.js、路由、中间件、controller的http配套组件

* [@ioa/model](https://github.com/ioajs/ioa-model) - Ormv.js库数据库模型封装

* [@ioa/rest](https://github.com/ioajs/ioa-rest) - 客户端查询数据库通用Rest Aip组件

* [@ioa/socket](https://github.com/ioajs/ioa-socket) - socket.io服务端组件

* [@ioa/socket-client](https://github.com/ioajs/ioa-socket-client) - socket.io客户端组件