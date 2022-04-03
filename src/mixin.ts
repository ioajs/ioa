const { toString } = Object.prototype;

/**
* 深度合并两个对象，仅扩展原有的数据结构，只增不减
* @param { object } app 数据容器
* @param { object } join 需要加入到容器的数据
* @returns { undefined, string } 合并成功返回 undefined，合并失败时返回冲突属性 path
*/
export default function mixin(app: object, join: object): void | string {

  for (const name in join) {

    const childJoin = join[name];
    const childData = app[name];

    if (childData === undefined) {

      app[name] = childJoin;

    } else if (toString.call(childData) === '[object Object]') {

      if (toString.call(childJoin) === '[object Object]') {

        if (childData !== childJoin) {

          const result = mixin(childData, childJoin);

          if (result) {

            return `.${name}${result}`;

          }

        }

      } else {

        return `.${name}`;

      }

    } else if (childJoin) {

      return `.${name}`;

    }

  }

}
