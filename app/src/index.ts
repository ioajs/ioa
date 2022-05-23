export default {
  component: [
    "@ioa/config",
    "@ioa/http",
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
    'router.js': {
      level: 80
    },
    // middleware: undefined
  }
}