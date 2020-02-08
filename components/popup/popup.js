Component({
    properties: {
      course: {
        type: Object,
        value: {}
      },
      // timeplace: {
      //   type: Array,
      // },
    },
    data: {
      flag: true,
      weekDayText: ["", "一", "二", "三", "四", "五", "六", "日"]
    },
    methods: {
      //隐藏弹框
      hidePopup: function () {
        this.setData({
          flag: true
        })
      },
      //展示弹框
      showPopup () {
        this.setData({
          flag: false
        })
      },
      /*
      * 内部私有方法建议以下划线开头
      * triggerEvent 用于触发事件
      */
      _tapok () {
        //触发成功回调
        this.triggerEvent("tapok");
      }
    }
  })