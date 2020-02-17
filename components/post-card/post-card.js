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
    },
    curTab: {
      type: String,
      value: "comment"
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
      console.log("post-card catch like post")
      this.triggerEvent("tapLike");
    },
    _starPost() {
      console.log("post-card catch star post")
      this.triggerEvent("tapStar");
    },
    _sharePost() {
      console.log("post-card catch share post")
      this.triggerEvent("tapShare");
    },
    _commentPost() {
      console.log("post-card catch comment post")
      this.triggerEvent("tapComment");
    },
    _goAuthor() {
      console.log("post-card catch go author")
      this.triggerEvent("tapAuthor");
    }
  }
})