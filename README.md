## ioa

> As the Serverless ecosystem gradually improves, the project may be deprecated in order to achieve lighter application deployment and more friendly TypeScript support.

[中文](./README-zh.md)

Unlike regular web frameworks, ioa.js is only a miniature framework that supports hierarchical loading of modules. Following the on-demand introduction principle, its core functionality is light enough and does not integrate any web-related services.

As a base framework, unlike many large frameworks, the core functionality of the ioa.js framework consists only of module loading and dynamic orchestration, and we do not want to overly constrain the developer's behaviour, as constraints will inevitably create limitations.

Applications in ioa.js are made up of multiple components, each with separate scopes, thus avoiding resource conflicts as much as possible. Sharing component resources across multiple applications is achieved through a declarative dependency configuration model.

Because it is based on a hierarchical loading strategy, developers are free to manage the lifecycle of the application at launch without the constraints of conventional frameworks.

Using ioa makes it easy to customise the framework to your liking or to use it in conjunction with existing frameworks. The project prefers to use koa, and this also applies to express.

### Features

- uses pure asynchronous module loading

- component-as-application, componentised, horizontally scalable architecture

- Each component has a relatively isolated component scope, consistent code structure and functionality

- Supports single-application, multi-application and component mode switching to meet smooth transition and incremental expansion requirements

- Support for hierarchical module loading, flexible module loading order and full lifecycle management at startup

- Subscription/publishing mechanism enables component dependency injection and multi-level dependency reuse, and new components can be combined with each other freely

- The loader can be used to treat directories, js files and functions in the application as customisable tree objects

- Support for npm releases, managing versions and dependencies between components

### Install

```
npm install ioa
```

### Usage

```js
import { createApp } from "ioa";

createApp({ main: ". /main" });
```

### Directory structure

The following directory structure is by convention only. The ioa framework itself does not restrict the directory structure or load level. Although developers are free to define the directory structure of each application in the index.js file, the only way to achieve better sharing of component resources is to follow a uniform convention.

```
project
    |project
    |─ index.js Application Portal
    |project
    |-- main app app ...
    |-- index.js
    | |-- index.js cascading configuration file
    | --- index.js
    | --- <-- 0
    | --- <-- 5
    | --- 5
    | --- 10 -- config config file directory
    | | - default.js public default configuration
    | |- localhost.js local environment configuration
    | |- development.js development environment configuration
    | └─ production.js production environment configuration
    | └─ $name.js custom environment configuration
    | | --- 15
    | - <-- 15
    | - <-- 16
    
    | 20 -- model model directory
    | | |- $name.js
    | |- $name.js
    | | - - 26
    | - - - - 26
    
    | 30 -- middleware middleware directory
    | | |- $name.js
    | |- $name.js
    | | - - - - - - - middleware
    | 40 -- service abstract service layer
    | | |- $name.js
    | ...
    | ...
    | - - - 42
    | - - - - 45
    
    | 50 --- controller Controller directory
    | | --- home Multi-level controller nesting
    | | |- $name.js
    | | |- ...
    | | |- ...
    | | |- ...
    | |- $name.js
    | | - - - - - - - - - - - - - - $name.js
    | | - <-- 60
    | | - - - - 70
    | | - - - - - - - - - - - - $name.js
    | 80 -- router.js routing configuration file
    | | - - - - - - - - - - - -
    
    |-- logger
    |-- logger log archive, grouped by date
    |-- static
    |-- static resource directory
    |-- static
```

### createApp(path, ...)

The first path is treated as the main application, and the configuration items for the child components are configured uniformly in the config directory of the main application, which is automatically distributed to the corresponding child components by the framework.

- path `string` - the path to the application, either relative or absolute

#### Multi-application configuration example

```js
import { createApp } from "ioa";

createApp({
  "main": ". /main",
  "admin": ". /admin",
  "user": ". /users"
});
```

### Hierarchical loading

The concept of directory and module loading hierarchies was introduced in ioa to manage the lifecycle of an application during the startup phase.

In traditional frameworks it is common to execute the code for a particular phase through hook functions. The advantage of lifecycle hooks is that they are relatively simple and easy to understand, but the disadvantage is that they lack flexibility and extensibility.

Since ioa uses a custom module hierarchical loading strategy to manage the lifecycle, this allows the developer to create an unlimited number of leveled or top and bottom load points at any stage of the framework load, freely managing the loading process.

> Sometimes there are still dependencies between sibling load items, in which case it is often straightforward to use import to improve the load timing, or to add new mount points

### Constrained loading levels

In order to establish a uniform loading lifecycle across multiple components and achieve cross-component compatibility, modules need to be loaded by convention.

ioa defines a few common directory and module load levels as follows.

| Node | Level |
| ---------- | ----- |
| config | 10 |
| model | 20 |
| middleware | 30 |
| service | 40 |
| controller | 50 |
| event | 60 |
| router | 80 |

### Load the project entry file index.js

Loader configuration items support both functional and declarative styles

```ts
app.component(name: string);

app.import(options: object);

app.export(options: object);
```

* `options` *Object*

    * `$name` *Object, Boolean* - Load option, $name corresponds to a directory name or a file name containing a .js, .json suffix. A value of false means that the directory or module will not be loaded

        * `level` *Number* - the load level

        * `action(options)` *Function* - function load item, a pure function load point without associated directories and files
        
        * `module(data, name)` *Function* - Callback function when the module is finished loading, this points to the current level container. If no data is returned, the output of the module is empty.

              * `data` * - The data exported by the current module

              * `name` *String* - the name of the current module, without the suffix

        * `directory(data, name)` *Function* - Callback function for when the directory is loaded, with support for subset inheritance. If no data is returned, the directory structure will not be created.

              * `data` *Object* - A collection of all subsets of exported data in the current directory

              * `name` *String* - the name of the current directory

        * `before(options)` *Function* - hook function to be executed before loading for all directories and modules under the current hierarchy (only triggered at the current level, not inherited for subsets)

              * `data` * - Exported data for the current directory, module

              * `dirList` *Array* - list of filenames in the current directory

              * `parents` *Object* - parent node

              * `root` *Object* - root node

        * `after(options)` *Function* - hook function to be executed after loading all directories and modules at the current level (triggered only at the current level, no inheritance for subsets), same arguments as before(options)

Example configuration reference:

```js
import ioa from "ioa";

const app = ioa.app();

app.component("@ioa/config");
app.component("@ioa/koa");

app.import({
  "model": {
    "level": 20,
  },
  "middleware": {
    "level": 30,
  },
  "test.js": {
    level: 30,
  },
  "abc": {
    level: 30,
    // Functional mount point
    action() {
      return 123;
    },
  },
  "controller": {
    "level": 50,
  },
});

app.export({
  "loads": { "level": 20 },
});
```

```js
// Declarative example
export default {
  "component": [
    "@ioa/config",
    "@ioa/koa"
  ],
  "import": {
    "model": {
      "level": 20,
    },
    "extend": {
      "level": 20,
    },
    "other": {
      "level": 30
    },
    "test": {
      "level": 30,
      action() {
        return 123;
      }
    },
  },
  "export": {
    "loads": { "level": 20 },
  }
}
```


### Component scopes

Components can be divided into application components and extension components according to their function, and support three import methods: relative paths, absolute paths and module paths.

Use ioa.app() to get the current component scope instance. The advantage is that when you change the name of the application or component, you don't need to modify the code, and you can add the name parameter to get the specified application instance.

```js
import ioa from "ioa";

const app = ioa.app(); // Get the current component scope instance with no arguments
const user = ioa.app("user"); // Get the specified component scope instance
```

### Componentization

In our vision, we expect applications to be built more in component form to decouple functional code and achieve a plug-and-play effect. Therefore, we have tried to implement this in ioa.js by treating each component as an independent application and creating isolation and sharing mechanisms between components.

Traditional frameworks typically use a single point container where all resources are mounted on a single root node. As the amount of application code grows, the project becomes bloated, dependencies become more and more ambiguous, and naming conflicts become more and more serious, putting a lot of pressure on subsequent project expansion and management. This can be greatly alleviated by further splitting and refining the business logic through the component mechanism in ioa, and developers are free to adjust the splitting granularity according to their own needs or personal preferences.

Many mainstream frameworks often abandon support for router and controller in plug-ins due to resource conflicts, mainly because it is difficult to elegantly resolve resource conflicts in a single app container. ioa uses multiple apps and resource isolation between components, so that developers only need to access the app object within the current component to dynamically point to the current component, avoiding the burden of The componentisation automatically locates the current component scope by obtaining the stack call path.

### Microservicing

As component applications are isolated from each other, each component can be run as a standalone application without external dependencies. This highly decoupled nature makes it easy to switch from monolithic applications to a microservices-based architecture in incremental development.

### Configuration files

ioa supports dynamic switching of configuration files via system environment variables and merging with the default configuration file.

The default environment variable names are localhost, development, and production, with production as the environment variable by default.

The framework does not restrict the use of specified environment variable names; in fact, developers are free to define environment variable names and add as many environment variable configuration files as they wish, as long as they ensure that the environment variable names match the configuration file names and that the corresponding configuration files are loaded automatically.

### System Environment Variables

ioa supports two external environment variables, NODE_ENV and PORT, which can be assigned either as global persistent environment variables or as temporary environment variables on the command line.

#### NODE_ENV

The global NODE_ENV environment variable is configured to enable differential configuration for different runtime environments.

NODE_ENV is normally defined as a global variable and temporary variables should be used if temporary switching of environment variable profiles is required.

#### Configuration example

Temporary environment variables have a higher priority than system environment variables on the command line and can therefore be overridden by passing a reference to the system environment variables on the command line.

#### Example

Temporary switch to local environment in a production environment

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