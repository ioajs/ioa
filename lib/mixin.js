const { toString } = Object.prototype;

/**
* 深度合并两个app，仅扩展已有的对象结构，而不改变数据类型
* @param {Object} app 数据容器
* @param {Object} join 需要加入到容器的数据
* @returns { Undefined, String } 合并成功返回undefined，合并失败时返回冲突属性path
*/
export default function mixin(app, join) {

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
