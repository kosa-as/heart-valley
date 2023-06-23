// components/head-component/head-componnet.js
Component({
  properties: {
    avatar: {
      type: String,
      value: ''
    },
    name: {
      type: String,
      value: ''
    }
  },

  data: {
    state: 'ongoing',
    time: '00:00:00',
    timer: null,
    startTime: 0,
  },


  methods: {
    complete() {
      // 停止计时
      if (this.data.state=='ongoing'){
      clearInterval(this.data.timer);
      this.setData({
        state: 'finished',
        timer: null,
        time: this.formatTime(new Date() - this.data.startTime)
      })
      this.triggerEvent('complete',this.data);
    };
      
      // 触发自定义事件，通知父组件或页面进行相应的处理
    },

    convey() {
      wx.navigateTo({
        url: "/pages/convey/convey",
      });
    },

    startTimer() {
      // 记录开始时间
      this.setData({
        startTime: new Date()
      });

      // 更新计时器
      this.data.timer = setInterval(() => {
        const currentTime = new Date() - this.data.startTime;
        this.setData({
          time: this.formatTime(currentTime)
        });
      }, 1000);
    },

    formatTime(time) {
      const seconds = Math.floor((time / 1000) % 60);
      const minutes = Math.floor((time / 1000 / 60) % 60);
      const hours = Math.floor((time / 1000 / 60 / 60) % 24);
      return (
        this.formatNumber(hours) +
        ':' +
        this.formatNumber(minutes) +
        ':' +
        this.formatNumber(seconds)
      );
    },

    formatNumber(num) {
      return num < 10 ? '0' + num : num;
    }
  },

  lifetimes: {
    attached() {
      // 开始计时
      this.startTimer();
    },

    detached() {
      // 清除计时器
      this.complete();
      clearInterval(this.data.timer);
    }
  }
});


