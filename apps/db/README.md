# base-db通用抽象模型角色权限控制

> 用于抽象数据模型接口中，通用模型增删改查操作的角色与权限管理。

## 依赖

* sequelize

* model中间件

* model控制器

## 选项配置文件

约定app/roles/目录作为模型角色权限配置文件目录，每一个文件对应一个角色，角色下面对应相应数据模型及约束条件。

## 获取选项配置

### 在middleware中

通过app.roles获取所有配置项（app.roles的引用）

### 在controller中

通过app.roles或app.roles获取所有配置项，通过ctx.resources获取当前模型的约束条件

## model中间件

* 获取当前路由对应的模型，添加到ctx.Model

* 签名验证与解析，添加到ctx.auth

* 登录状态识别，区分游客和登录用户

## model控制器


