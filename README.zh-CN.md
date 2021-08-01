## ioa

不同于常规的 Web 框架，ioa.js 仅仅是一个支持模块分级加载的微型框架。遵循按需引入原则，其核心功能足够的轻量，且不集成任何与网络相关的服务。

作为一个基础框架，与很多大型框架不同的是，ioa.js 框架核心功能仅包含模块加载和动态编排，我们不想过度约束开发者的行为，因为约束会不可避免的产生局限性。

ioa.js 中的应用由多个组件构成，每个组件都拥有独立的作用域，从而尽量避免资源冲突。通过声明式的依赖关系配置模型，实现跨多个应用共享组件资源。

由于基于分级加载策略，因此开发者可以自由的管理应用启动阶段的生命周期，而不必受限于常规框架的种种束缚。

使用 ioa 可以按自己的喜好轻松实现定制化框架，也可以与现有框架搭配使用。该项目倾向于使用 koa，对于 express 也同样适用。

### 特性

- 使用 ES 模块，不再兼容 CommonJS

- 组件即应用，采用组件化、水平扩展架构

- 每个组件拥有相对隔离的组件作用域、一致的代码结构和功能

- 支持单应用、多应用、组件模式自由切换，满足平滑过渡、渐进式扩展需求

- 支持模块分级装载，可灵活编排模块的装载顺序，实现启动阶段的全生命周期管理

- 基于订阅/发布机制实现组件依赖注入和多级依赖复用，组件之间通过自由组合，可合成新的组件

- 在使用加载器时，可以将应用中的目录、js 文件、函数视为可定制的树状对象结构

- 支持使用 npm 发布、管理组件间的版本和依赖关系

### Install

```
npm install ioa
```

### Usage

```js
import ioa from "ioa";

ioa.apps("./main");
```

### 目录结构

以下目录结构仅为约定，ioa 框架本身并不限制目录结构和加载等级。虽然开发者可以在 index.js 文件中自由定义每个应用的目录结构，但是只有遵循统一的约定，才能更好的实现组件资源共享。

```
project
    |
    |─  index.js                 应用入口
    |
    |-- $main    $app    $app    ...
    |    |
    |    | -- index.js           分级装载配置文件
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
```

### ioa.apps(path, ...)

第一个 path 被视为主应用，子组件的配置项在主应用的 config 目录中统一配置，框架自动分发到对应的子组件。

- path `String` - 应用路径，支持相对路径或绝对路径

#### 多应用配置示例

```js
import ioa from "ioa";

ioa.apps("./main", "./admin");
```

### 分级装载

ioa 中引入了目录和模块装载等级的概念，用于管理应用在启动阶段的生命周期。

在传统框架中通常通过钩子函数来执行特定阶段的代码，生命周期钩子的优点是相对简单、易于理解，缺点是缺乏灵活性、扩展性。

由于 ioa 使用自定义模块分级装载策略来管理生命周期，这使得开发者可以在框架装载的任意阶段创建无限个平级或上下级装载点，自由管理装载流程。

> 有时候在同级加载项之间依然存在依赖关系，这种情况下通常可以直接使用 require()来提升加载时序，或者增加新的挂载点

### 约定装载等级

为了在多个组件间建立统一的加载生命周期，实现跨组件兼容，需要按约定来加载模块。

ioa 约定了几个常见目录、模块的装载等级如下：

| Node       | Level |
| ---------- | ----- |
| config     | 10    |
| model      | 20    |
| middleware | 30    |
| service    | 40    |
| controller | 50    |
| event      | 60    |
| router     | 80    |

### 装载项目入口文件 index.js

```ts
app.component(name: string);

app.import(options: object);

app.export(name: string, value: void);
```

*  `options` *Object*

      *  `$name` *Object, Boolean* - 装载选项，$name对应目录名称或包含.js、.json后缀的文件名。当值为false时表示不装载该目录或模块

         *  `level` *Number* - 加载等级

         *  `action(options)` *Function* - 函数加载项，不需要关联目录和文件的纯函数加载点
         
         *  `module(data, name)` *Function* - 模块加载完毕的回调函数，this指向当前层级容器。如果无数据返回，则该模块输出为空。

               *  `data` * - 当前模块导出数据

               *  `name` *String* - 当前模块名称，不含后缀

         *  `directory(data, name)` *Function* - 目录加载完毕的回调函数，支持子集继承。如果无数据返回，则该目录结构不会被创建。

               *  `data` *Object* - 当前目录下所有子集导出数据集合

               *  `name` *String* - 当前目录名称

         *  `before(options)` *Function* - 当前等级下所有目录、模块在加载前执行的钩子函数（仅在当前层级触发，不对子集继承）

               *  `data` * - 当前目录、模块导出数据

               *  `dirList` *Array* - 当前目录下的文件名列表

               *  `parents` *Object* - 父节点

               *  `root` *Object* - 根节点

         *  `after(options)` *Function* - 当前等级下所有目录、模块在加载后执行的钩子函数（仅在当前层级触发，不对子集继承），参数与before(options)一致

配置参考示例：

```js
import ioa from "ioa";

const app = ioa.app();

app.component("@ioa/config");
app.component("@ioa/koa");

app.import({
  model: {
    level: 20,
  },
  middleware: {
    level: 30,
  },
  "test.js": {
    level: 30,
  },
  abc: {
    level: 30,
    action() {
      // 函数型挂载点
      return 123;
    },
  },
  controller: {
    level: 50,
  },
});
```

### 组件作用域

组件按功能可分为应用类组件和扩展类组件，支持相对路径、绝对路径、模块路径三种导入方式。

框架在启动时会自动为每个组件生成私有的@app 引用模块，作为当前组件的容器。

@app 模块仅用于组件作用域内使用，在组件作用域外应该使用 ioa 模块。

```js
import ioa from "ioa";

const { middleware } = ioa.app();
```

### 组件化

在我们的设想中，期望应用更多的以组件形态构建，实现功能代码解耦，达到即插即用的效果。因此，我们尝试在 ioa.js 中实现这个功能，即将每个组件视为独立应用，并在组件间建立隔离和共享机制。

传统框架中通常使用单点容器，将所有资源都挂载到一个根节点上。随着应用代码量的不断增加，项目变得臃肿，依赖关系也越来越模糊，命名冲突问题也会越发严重，给后续项目扩展和管理带来很大压力。在 ioa 中通过组件机制，对业务逻辑进行进一步拆分和细化后，可以极大缓解上述问题，开发者也可以根据自身需求或个人喜好自由的调整拆分粒度。

很多主流框架出于资源冲突的考虑，通常放弃了在插件中对 router 和 controller 的支持，主要原因是在单个 app 容器中很难优雅的解决资源冲突问题。ioa 使用多个 app、组件间资源隔离设计方案，开发者只需要访问当前组件内的 app 对象即可动态指向当前组件，避免访问具体组件名带来的负担， 组件化通过获取堆栈调用路径，自动定位当前组件作用域。

### 微服务化

由于组件应用相互隔离，在无外部依赖的状态下，每个组件都可以作为独立应用单独运行。这种高度解耦特性使得在渐进式开发中，可以轻松的从单体应用切换到微服务化架构。

### 配置文件

ioa 支持通过系统环境变量来动态切换配置文件，并与 default 配置文件合并。

默认的环境变量名称为 localhost、development、production，缺省状态下以 production 作为环境变量。

框架并没有限制必须使用指定的环境变量名，实际上开发者可以自由的定义环境变量名和增加任意数量的环境变量配置文件，只要确保环境变量名与配置文件名命名一致即可自动装载对应的配置文件。

### 系统环境变量

ioa 支持 NODE_ENV 和 PORT 两个外部环境变量，可选择全局持久化环境变量和命令行临时环境变量两种方式进行赋值。

#### NODE_ENV

通过配置全局的 NODE_ENV 环境变量，实现不同运行环境下的差异化配置。

NODE_ENV 通常被定义为全局变量，如果需要临时切换环境变量配置文件，则应该使用临时变量。

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

- [consoln](https://github.com/xiangle/consoln) - 集成 console、日志、debug 模块

- [@ioa/config](https://github.com/ioajs/ioa-config) - 用于加载 config 目录下的配置文件

- [@ioa/koa](https://github.com/ioajs/ioa-koa) - 集成 koa.js、路由、中间件、controller 的 http 配套组件

- [@ioa/ormv](https://github.com/ioajs/ioa-ormv) - pgsql 数据库模型封装

- [@ioa/socket](https://github.com/ioajs/ioa-socket) - socket.io 服务端组件

- [@ioa/socket-client](https://github.com/ioajs/ioa-socket-client) - socket.io 客户端组件

- [@ioa/ioa-upload](https://github.com/ioajs/ioa-upload) - 文件上传
