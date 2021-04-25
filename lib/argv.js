// argv参数解析
const [, , ...processArgv] = process.argv;

let key = 'default';
const argv = { default: [] };

for (const item of processArgv) {
   if (item[0] === '-') {
      key = item.replace(/^-{1,2}/, '');
      argv[key] = [];
   } else {
      argv[key].push(item);
   }
}

export default argv;
