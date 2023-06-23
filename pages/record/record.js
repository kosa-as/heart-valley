// pages/record/record.ts
const common = require('../../utils/common');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageList: [],
  },

  previewImage(e) {
    let url = e.currentTarget.dataset.url;
    wx.previewImage({
        current: url, // 当前显示图片的http链接
        urls: [url]
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(common.default);
    const messageList = common.default.messageList;
    this.setData({
      //语音已经合并，调整了一下evaluation里.content的样式，另外之前发给你的evaluating提交评价界面也加上去了。
      //a为静态数组，调用动态将下一行注释解除，并注释下下一行。第23行注释也要取消。
      messageList:messageList
      //messageList: a
    });
    console.log(this.data.messageList);
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