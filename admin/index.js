export default {
  components: [
    "@ioa/config",
    "@ioa/koa"
  ],
  import: {
    "model": {
      "level": 20,
    },
    "xxx": {
      "level": 30,
      action() {
        return 666;
      }
    },
  }
}