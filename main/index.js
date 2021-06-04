export default {
  components: [
    "@ioa/config",
    "@ioa/koa",
    "./@common"
  ],
  import: {
    "model": {
      "level": 20,
    },
    "extend": {
      "level": 20,
    },
    "other": {
      level: 30
    },
    "test": {
      level: 30,
      action() {
        return 666;
      }
    },
  }
}