export default {
  component: [
    "@ioa/config",
    "@ioa/koa"
  ],
  import: {
    "model": {
      "level": 20,
    },
    "test": {
      "level": 30,
      action() {
        return 999;
      }
    },
  }
}