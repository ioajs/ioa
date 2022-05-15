export default {
  component: [
    "@ioa/config",
    "@ioa/koa",
    "./@common"
  ],
  import: {
    model: {
      level: 20,
    },
    extend: {
      level: 20,
    },
    other: {
      level: 30
    },
    virtual: {
      level: 30,
      action() {
        return 888;
      }
    },
    // middleware: undefined
  }
}