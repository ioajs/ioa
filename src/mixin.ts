const { toString, hasOwnProperty } = Object.prototype;

interface Object { [n: string]: any }

/**
* 深度合并两个对象，仅扩展原有的数据结构，只增不减
* @param app 数据容器
* @param join 需要加入到容器的数据
* @returns 合并成功返回 undefined，合并失败时返回冲突属性 path
*/
export default function mixin(app: Object, join: Object): void | string {

  for (const name in join) {

    if (hasOwnProperty.call(app, name)) {

      const childData = app[name];

      if (toString.call(childData) === '[object Object]') {

        const childJoin = join[name];

        if (toString.call(childJoin) === '[object Object]') {

          if (childData === childJoin) continue; // 跳过全等对象，防止死循环

          const result = mixin(childData, childJoin);

          if (result) return `.${name}${result}`;

        } else {

          return `.${name}`;

        }

      } else {

        return `.${name}`;

      }

    } else {

      app[name] = join[name];

    }

  }

}
