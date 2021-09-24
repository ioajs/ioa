## ioa

Unlike regular web frameworks, ioa.js is only a miniature framework that supports hierarchical loading of modules. Following the on-demand introduction principle, its core functionality is light enough and does not integrate any web-related services.

As a base framework, unlike many large frameworks, the core functionality of the ioa.js framework consists only of module loading and dynamic orchestration, and we do not want to overly constrain the developer's behaviour, as constraints will inevitably create limitations.

Applications in ioa.js are made up of multiple components, each with separate scopes, thus avoiding resource conflicts as much as possible. Sharing component resources across multiple applications is achieved through a declarative dependency configuration model.

Because it is based on a hierarchical loading strategy, developers are free to manage the lifecycle of the application at launch without the constraints of conventional frameworks.

Using ioa makes it easy to customise the framework to your liking, or to use it with existing frameworks. The project prefers to use koa, and this also applies to express.

### Features

- Uses ES modules, no longer compatible with CommonJS

- Use pure asynchronous module loading method

- Component-as-an-application, with a component-based, horizontally scalable architecture

- Each component has a relatively isolated component scope, consistent code structure and functionality

- Support for single-application, multi-application and component mode switching to meet smooth transition and incremental expansion requirements

- Support for hierarchical module loading, flexible module loading order and full lifecycle management at startup

- Subscription/publishing mechanism enables component dependency injection and multi-level dependency reuse, and new components can be combined with each other freely

- The loader can be used to treat directories, js files and functions in the application as customisable tree objects

- Support for npm publishing and managing versioning and dependencies between components

### Install

```
npm install ioa
```

### Usage

```js
import ioa from "ioa";

ioa.apps("./main");
```

### Directory structure

The following directory structure is by convention only. The ioa framework itself does not restrict the directory structure or loading levels. Although developers are free to define the directory structure for each application in the index.js file, the only way to achieve better sharing of component resources is to follow a consistent convention.

```
project
    |
    |─  index.js                 Application Portal
    |
    |-- $main    $app    $app    ...
    |    |
    |    | -- index.js           Graded loading profiles
    |    |
    |    • <--- 0
    |    • <--- 5
    |    |
    |    10 -- config             Configuration file directory
    |    |    |- default.js       Public default configuration
    |    |    |- localhost.js     Local environment configuration
    |    |    |- development.js   Development environment configuration
    |    |    └─ production.js    Production environment configuration
    |    |    └─ $name.js         Customised environment configuration
    |    |
    |    • <--- 15
    |    • <--- 16
    |    |
    |    20 -- model              Model Directory
    |    |    |- $name.js
    |    |    └─ ...
    |    |
    |    • <--- 26
    |    |
    |    30 -- middleware         Middleware Directory
    |    |    |- $name.js
    |    |    └─ ...
    |    |
    |    40 -- service            Abstract Service Layer
    |    |    |- $name.js
    |    |    └─ ...
    |    |
    |    • <--- 42
    |    • <--- 45
    |    |
    |    50 -- controller         Controller Directory
    |    |    |-- home            Multi-level directory support
    |    |    |    |- $name.js
    |    |    |    └─ ...
    |    |    |- ...
    |    |    |
    |    |    └─ $name.js
    |    |
    |    • <--- 60
    |    • <--- 70
    |    |
    |    80 -- router.js          Routing profiles
    |    |
    |    ：
    |
    |-- logger                    Log archiving, grouped by date
    |
    |-- static                    Static Resource Catalogue
    |
```

### ioa.apps(path, ...)

The first path is considered to be the main application and the configuration items of the child components are configured uniformly in the config directory of the main application and the framework is automatically distributed to the corresponding child components.

- path `String` - the path to the application, either relative or absolute

#### Multi-application configuration example

```js
import ioa from "ioa";

ioa.apps("./main", "./admin");
```

### Graded loading

The concept of a directory and module loading hierarchy was introduced in ioa to manage the lifecycle of an application during the startup phase.

In traditional frameworks it is common to execute code at a specific stage through hook functions. The advantage of lifecycle hooks is that they are relatively simple and easy to understand, but the disadvantage is that they are inflexible and not scalable.

As ioa uses a custom module hierarchy loading strategy to manage the lifecycle, this allows the developer to create an unlimited number of leveled or up/down loading points at any stage of the framework loading and freely manage the loading process.

> Sometimes there are still dependencies between sibling loaders, in which case you can usually just use import to improve the load timing or add a new mount point

### Conventional loading hierarchy

In order to establish a uniform loading lifecycle across multiple components and achieve cross-component compatibility, modules need to be loaded by convention.

ioa defines several common directories and loading levels for modules as follows.

| Node       | Level |
| ---------- | ----- |
| config     | 10    |
| model      | 20    |
| middleware | 30    |
| service    | 40    |
| controller | 50    |
| event      | 60    |
| router     | 80    |

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

### Component scope

Components can be divided into application components and extension components according to their functions, and they support three import methods: relative path, absolute path and module path.

Use ioa.app() to get the current component scope instance, and add the name parameter to get the specified application instance.

```js
import ioa from "ioa";

// Get the current component scope instance by default
const app = ioa.app(); 

// Get the specified component scope instance
const main = ioa.app('main'); 

const user = ioa.app('user');
```

### Componentisation

In our vision, we expect applications to be built more in component form to decouple functional code and achieve a plug-and-play effect. We therefore tried to implement this in ioa.js by treating each component as an independent application and creating isolation and sharing mechanisms between components.

Traditional frameworks typically use a single point container where all resources are mounted on a single root node. As the amount of application code grows, the project becomes bloated, dependencies become more and more ambiguous, and naming conflicts become more and more serious, putting a lot of pressure on subsequent project expansion and management. This can be greatly alleviated by further splitting and refining the business logic in ioa through the component mechanism, and developers are free to adjust the splitting granularity according to their own needs or personal preferences.

Many mainstream frameworks often abandon support for router and controller in plugins due to resource conflict concerns, mainly because it is difficult to elegantly resolve resource conflicts in a single app container. ioa uses multiple apps and resource isolation between components, so developers only need to access the app object within the current component The componentisation automatically locates the current component scope by obtaining the stack call path.

### Microservicing

Thanks to the isolation of component applications from each other, each component can be run separately as an independent application in a state free of external dependencies. This highly decoupled nature makes it easy to switch from monolithic applications to a microservice-oriented architecture in progressive development.

### Configuration files

ioa supports dynamically switching configuration files via system environment variables and merging them with the default configuration file.

The default environment variable names are localhost, development, and production, with production as the environment variable by default.

The framework does not restrict the use of the specified environment variable names, in fact, developers are free to define environment variable names and add as many environment variable profiles as they like, as long as they ensure that the environment variable names are named the same as the profile names to automatically load the corresponding profiles.

### System Environment Variables

ioa supports two external environment variables, NODE_ENV and PORT, which can be assigned either as global persistent environment variables or as temporary environment variables on the command line.

#### NODE_ENV

Differentiated configuration for different runtime environments is achieved by configuring the global NODE_ENV environment variable.

NODE_ENV is normally defined as a global variable and should be used as a temporary variable if you need to switch environment variable profiles temporarily.

#### Configuration example

Temporary environment variables have a higher priority than system environment variables on the command line and can therefore be overridden by passing a reference to the system environment variables on the command line.

#### Example

Temporary switch to local environment in production environment

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
