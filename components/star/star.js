Component({
  properties:{
    starValue:{
      value: 0,//父组件传过来的评分数字
      type:Number
    },
    disabled:{//是否只读，disabled="true"只显示，disabled="false"可评分
      value:true,
      type:Boolean
    },
    isShowStarValue:{
      value:false,//父组件传过来的是否显示评分
      type:Boolean
    },
    WH:{
      value: 20,//父组件设置评分星星的宽高
      type:Number
    },
  },
 
  data: {
    stars: [0, 1, 2, 3, 4],
    normalSrc: '/static/images/star/empty.png',//没有点亮的星星图片
    selectedSrc: '/static/images/star/full.png',//完全点亮的星星图片
    halfSrc: '/static/images/star/half.png',//点亮一半的星星图片
  },

  methods: {
    rateStar: function (event) {
      if (this.properties.disabled) {
        return; // 如果组件是只读状态，则不执行评分操作
      }
      const index = event.currentTarget.dataset.index; // 获取点击的星星索引值
      const starValue = index + 1; // 计算评分值
      this.setData({
        starValue: starValue // 更新评分值
      });
      this.triggerEvent('change', { starValue: starValue }); // 触发自定义事件，将评分值传递给父组件
    }
  }
  /*
  触发自定义事件 change，并将评分值传递给父组件。
  当监听到 change 事件时，可以获取到评分值，并进行相应的处理。以下是一个示例：

  <!-- 在使用组件的页面或组件中 -->
  <Rate starValue="{{starValue}}" disabled="{{disabled}}" isShowStarValue="{{isShowStarValue}}" WH="80" bind:change="onRateChange"></Rate>
  在上述代码中，将 starValue、disabled 和 isShowStarValue 属性绑定到相应的数据或变量上，并通过 bind:change 将 change 事件绑定到名为 onRateChange 的事件处理函数上。

  接下来，在对应的 JavaScript 部分，实现 onRateChange 事件处理函数：

  Page({
    onRateChange: function (event) {
      const starValue = event.detail.starValue; // 获取评分值
      console.log('评分值：', starValue);
      // 进行相应的处理逻辑
    }
  });
  */
  
 })
 