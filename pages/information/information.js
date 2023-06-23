// pages/information/information.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar: '',
    realName: '',
    contactNumber: '',
    emergencyContactName: '',
    gender:'',
    emergencyContactNumber: ''
  },

  chooseavatar(e){
    this.setData({
      avatar: e.detail.avatarUrl
    })
},

  modifyInformation() {
    wx.navigateTo({
      url: "/pages/updateinfo/updateinfo",
    });
  },

  logout() {
    console.log(this.data.avatar)
    wx.showModal({
      title: '确认退出',
      content: '是否确认退出登录？退出后下次登录时将重新验证您的身份',
      success: (res) => {
        if (res.confirm) {
          // 用户点击了确认按钮
          // 执行退出登录操作
          // ...
  
          // 跳转到登录界面
          wx.clearStorageSync();
          wx.reLaunch({
            url: '/pages/login/login',
          });
        } else if (res.cancel) {
          // 用户点击了取消按钮
          // 不执行任何操作
        }
      },
    });
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
     
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
    console.log(app.globalData)
    this.setData({
      avatar: (app.globalData.avatar==null)?'':((app.globalData.avatar.length==0)?'':app.globalData.avatar),
      realName: app.globalData.name,
      gender: app.globalData.gender,
      contactNumber: app.globalData.pno,
      emergencyContactName: app.globalData.contact_name,
      emergencyContactNumber: app.globalData.contact_pno,
   })
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