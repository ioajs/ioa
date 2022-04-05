## 更新记录

### 13.0.0

- JS 转为 TS；

- 为 ioa.main 添加至 ES 模块导出，将原来的 ioa.main 赋值覆盖改为对象合并，不改变引用源；

- 统一命名规范，所有应用内部保留属性均以 $ 开头，将 app.loades 改为 app.$import；

- 对应用和组件依赖导出与根节点合并差异，使用两种不同的实例化方案；

- 使用更严格的显性合并冲突策略，只要发现命名冲突就报错，不管是初始化阶段，还是导入、导出依赖阶段；

### 9.7.5

- 提升 ioa.main 的生命周期，可以在组件入口模块根作用域中直接访问

- 提升 app.$release 的生命周期，可以在组件入口模块根作用域中直接访问

### 9.7.4

- 更新 lloader 模块，修复 lloader 中标注无效加载项目，导致 console 无法显示未加载项

### 9.7.3

- 移除目录 index 模块的特殊加载方式，index 文件名不再具有特权。

### 9.7.1

新增 app.import() api 代替 module.exports 导出，降低理解难度。

### 9.7.0

将动态 global.**scope**临时引用方案改为模块内字面量直接定义空对象作为 app 容器，去除了全局变量，让代码看起来更简单、直观。

### 9.6.0

- 使用全局变量**scope**替换原来的通过 cwd()合成 path 方案

### 9.5.0

- 将 config 拆分为组件，不再作为内置加载项

### 9.4.2

- lloader 更新至 4.3.1

- 新增在控制台显示无效加载项

- 移除@ioa-model 开发依赖

### 9.4.1

- 修复不同环境变量下 config mixin 混合失效的 bug

### 9.0.0

- 将 loggercc 替换为 consoln，提高扩展性和性能

- 修改 before、after 钩子参数结构

- config 配置文件由全加载改为按需加载

### 8.0.0

- 将 npm 组件约定 app 目录名改为 lib

- 开发环境下改用软链接代替 ioa 引用模块

### 7.2.0

- 新增组件合并时递归审查命名冲突，防止隐性覆盖

- 更新 lloader 依赖至 4.0.0，将加载.loader.js 模块的任务转移到 ioa 中处理

### 5.0.0

- 将组件内同名的 ioa 模块名改为@app，消除多态识别成本

### 4.6.4

- 升级 lloader 模块至 1.4.1，暴露 ioa.app、app.loader 函数对象

### 4.6.3

- 升级 loggercc 模块，简化控制台日志显示样式

### 4.6.2

- 增加 PORT 环境变量，用于动态修改端口号

### 4.6.1

- 将 apps 对象混入到 ioa 对象中，在 ioa 中可以直接通过 ioa[app name]访问指定应用。

### 4.6.0

- 简化.import.js 中依赖配置数据结构，使其更加直观和易于理解

- 完善.import.js 依赖配置错误提示信息

### 4.5.3

- 修复 4.5.2 中的版本自动更新失败 bug

### 4.5.2

- 新增组件作用域内的 ioa 版本自动对比、同步功能

<!-- * 完善组件配置错误提示信息 -->

### 4.5.0

- 将 package-app.json 更名为 app.config.json，同时支持.js 格式

- 增加 app.config.json 中[appName].config 参数对环境变量的支持

### 4.4.2

- 路由中支持字符串和函数两种方式注入 controller

- 完善路由定义错误时输出的错误提示信息

- 将 ctx.parameter 参数更名为 ctx.params

### 4.4.1

- 不再限制 middleware 导出类型必须为函数

- 不再限制 controller 导出类型必须为构造函数

### 4.4.0

- 将所有路由方法转移至 app.router 对象中

### 4.3.0

- 取消 ioa.main()函数，约定将 main 目录作为固定的主应用

- package-app.json 配置文件中增加 path 选项，可自定义组件路径

### 4.2.0

- 将.io.js 文件更名为.import.js

### 4.1.0

- 将 package-io.json 更名为 package-app.json

### 4.0.0

- 发布正式版

### 4.0.0-rc.11

- 更新 lloader 至 1.4.0，使用深度混合方式合并模块

- 提升 package-lock.json 中 config 配置项的优先级为顶级
