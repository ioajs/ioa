const { toString, hasOwnProperty } = Object.prototype;
export default function mixin(app, join) {
    for (const name in join) {
        if (hasOwnProperty.call(app, name)) {
            const childData = app[name];
            if (toString.call(childData) === '[object Object]') {
                const childJoin = join[name];
                if (toString.call(childJoin) === '[object Object]') {
                    if (childData === childJoin)
                        continue;
                    const result = mixin(childData, childJoin);
                    if (result)
                        return `.${name}${result}`;
                }
                else {
                    return `.${name}`;
                }
            }
            else {
                return `.${name}`;
            }
        }
        else {
            app[name] = join[name];
        }
    }
}
