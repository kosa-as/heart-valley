// pages/waiting/waiting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttonText: "请等待...",
    canAgree: false,
    countNumber: 2,
  },

  startCountdown() {
    let count = this.data.countNumber;
    const timer = setInterval(() => {
      if (count <= 0) {
        clearInterval(timer);
        this.setData({
          buttonText: "我同意",
          canAgree: true,
        });
      } else {
        this.setData({
          buttonText: `我同意（${count}）`,
          countNumber: count,
        });
        count--;
      }
    }, 1000);
  },

  onAgree() {
    if (!this.data.canAgree) {
      return; // 用户还未等待完成，不执行任何操作
    }

    // 用户点击同意按钮后的逻辑处理，如跳转到选择咨询师界面
    wx.navigateTo({
      url: "/pages/chooseCounselor/chooseCounselor",
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.startCountdown();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})