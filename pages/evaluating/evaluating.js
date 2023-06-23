// pages/evaluating/evaluating.js
import request from '../../utils/request'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    consultant: {
      avatar: "/static/images/tabs/tab-personal-current.png",
      name: '咨询师姓名',
    },
    comment: "",
    Value: 0,
    start_time: -1,
    duration: -1
  },

  inputComment(e) {
    this.setData({
      comment: e.detail.value,
    });
  },

  onRateChange: function (event) {
    const starValue = event.detail.starValue; // 获取评分值
    this.setData({
      Value : starValue// 获取评分值
    });
    // 进行相应的处理逻辑
  },

  submitComment() {
    console.log("评价内容: ", this.data.comment);
    console.log('评分值：', this.data.Value);
    wx.showToast({
      title: '提交评价成功，感谢您的参与',
      icon: 'none',
      duration: 1500
    })
    request({
      url: '/records/insert',
      data:{
      v_name: app.globalData.name, 
      c_name: app.globalData.choosed_consulor_name,
      pno: app.globalData.pno,
      c_username: app.globalData.username,
      duration: this.data.duration, 
      level: this.data.Value,
      evaluate: this.data.comment,
      starttime: this.data.start_time
      },
      method:'POST'
    }).then(res=>{
      request({
            url: '/counselors/subCurrent/'+app.globalData.username,
            method:'GET'
          })
    })
      console.log('InserT OK!')
    setTimeout(() => {
      wx.switchTab({
        url: '/pages/index/index',
      });
    }, 1000);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
   this.setData({
     start_time: options.start_time,
     duration: options.duration,
     consultant: {
       avatar: this.data.consultant.avatar,
       name:app.globalData.choosed_consulor_name
     }
   })
   console.log(this.data)
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