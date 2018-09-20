'use strict';

/**
 * 仅作为容器使用，搜集并保存测试函数，供全局jtf调用
 */

let tests = []

/**
 * 
 * @param {String} name 测试名
 * @param {Function} func 测试方法
 */
function jtf(name, func) {

   tests.push({ name, func })

}

/**
 * 跳过执行
 * @param {String} name 测试名
 * @param {Function} func 测试方法
 */
jtf.skip = function (name, func) {

   tests.push({ type: 'skip', name, func })

}


jtf.tests = tests


module.exports = jtf