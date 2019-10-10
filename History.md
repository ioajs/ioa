## 更新记录

### 2.5.0

* 增加环境变量配置文件

* 升级依赖，为了避免混合数组导致的乱序，新的T.mixin()方法将对数组执行全覆盖操作

* 完善测试用例

* 添加debug模块

* 将app.models改为app.model

### 3.0.0-alpha.1

* 重构代码，增加模块化支持

### 3.0.0-alpha.3

* 取消app注入函数

* 增加组件继承

* 每个组件都拥有独立的模块作用域和app实例，实现应用隔离和继承

### 3.0.0-alpha.4

* 修复组件config未合并的bug


### 3.0.0-alpha.8

* 修改组件app的继承方式

* 各种bug修复

### 3.0.0-alpha.11

* 修复起始中间件未执行的bug

* 实现子组件与根组件的中间件配置隔离

* 优化路由加载顺序

### 3.0.0-alpha.13

* 修改命名规范，将public替换成component

### 3.0.0-alpha.14

* 调整目录结构，将config目录转移到app目录中

### 3.0.0计划

* 路由增强，支持目录自动路由

* 使用分级策略管理加载顺序，更好的进行流程控制

### 4.0.0-alpha.4

* 使用require()加载未知路由模块前先判断该模块是否存在，如果不存在则忽略

### 4.0.0-alpha.5

* lloader模块升级至1.0.3，...load.js文件更名为.loader.js

### 4.0.0-rc.1

* 重新引入io依赖配置文件，通过geter代理取值

### 4.0.0-rc.2

* 升级lloader核心模块至1.1.0

* 修复跨应用依赖返回值为空的bug

### 4.0.0-rc.3

* 升级lloader核心模块至1.1.2

* 修复使用4.0.0-rc.2

### 4.0.0-rc.4

* 升级lloader核心模块至1.1.3，为get增加set属性消除赋值限制

### 4.0.0-rc.6

* 为内置加载对象添加缺省状态下的初始值

### 4.0.0-rc.7

* 增加组件依赖自动注入功能

* 通过为ioa框架手动注入开发环境自我依赖，使开发环境与生产环境代码保持一致

### 4.0.0-rc.8

增加自动识别单应用模式和多应用模式

### 4.0.0-rc.9

* 增加npm发布组件的支持

### 4.0.0-rc.10

* 将config.js从app、apps中移出，放置于顶层目录，重命名为package-app.json

* 将ioa.default()改为ioa.main()，供多应用模式下自定义ioa.app主节点

* 新增ioa.AppsMiddleware、app.AppsMiddleware用于添加全局中间件

### 4.0.0-rc.11

* 更新lloader至1.4.0，使用深度混合方式合并模块

* 提升package-lock.json中config配置项的优先级为顶级

### 4.0.0

* 发布正式版

### 4.1.0

* 将package-io.json更名为package-app.json

### 4.2.0

* 将.io.js文件更名为.import.js

### 4.3.0

* 取消ioa.main()函数，约定将main目录作为固定的主应用

* package-app.json配置文件中增加path选项，可自定义组件路径

### 4.4.0

* 将所有路由方法转移至app.router对象中

### 4.4.1

* 不再限制middleware导出类型必须为函数

* 不再限制controller导出类型必须为构造函数

### 4.4.2

* 路由中支持字符串和函数两种方式注入controller

* 完善路由定义错误时输出的错误提示信息

* 将ctx.parameter参数更名为ctx.params

### 4.5.0

* 将package-app.json更名为app.config.json，同时支持.js格式

* 增加app.config.json中[appName].config参数对环境变量的支持

### 4.5.2

* 新增组件作用域内的ioa版本自动对比、同步功能

<!-- * 完善组件配置错误提示信息 -->

### 4.5.3

* 修复4.5.2中的版本自动更新失败bug

### 4.6.0

* 简化.import.js中依赖配置数据结构，使其更加直观和易于理解

* 完善.import.js依赖配置错误提示信息

### 4.6.1

* 将apps对象混入到ioa对象中，在ioa中可以直接通过ioa[app name]访问指定应用。

### 4.6.2

* 增加PORT环境变量，用于动态修改端口号

### 4.6.3

* 升级loggercc模块，简化控制台日志显示样式

### 4.6.4

* 升级lloader模块至1.4.1，暴露ioa.loader、app.loader函数对象

### 5.0.0

* 将组件内同名的ioa模块名改为@app，消除多态识别成本

### 7.2.0

* 新增组件合并时递归审查命名冲突，防止隐性覆盖

* 更新lloader依赖至4.0.0，将加载.loader.js模块的任务转移到ioa中处理

### 8.0.0

* 将npm组件约定app目录名改为lib

* 开发环境下改用软链接代替ioa引用模块

### 9.0.0

* 将loggercc替换为consoln，提高扩展性和性能

* 修改before、after钩子参数结构

* config配置文件由全加载改为按需加载

### 9.4.1

* 修复不同环境变量下config mixin混合失效的bug


### 9.4.2

* lloader更新至4.3.1

* 新增在控制台显示无效加载项

* 移除@ioa-model开发依赖