Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    post: {
      type: Object,
      value: {}
    },
    author: {
      type: Object,
      value: {}
    },
    showShare: {
      type: Boolean,
      value: false
    }
  },
  data: {
    flag: true,
  },
  methods: {
    /*
    * 内部私有方法建议以下划线开头
    * triggerEvent 用于触发事件
    */
    _likePost() {
      this.triggerEvent("likePost");
    },
    _starPost() {
      this.triggerEvent("starPost");
    },
    _goPost() {
      this.triggerEvent("goPost");
    },
    _goAuthor() {
      this.triggerEvent("goAuthor");
    }
  }
})