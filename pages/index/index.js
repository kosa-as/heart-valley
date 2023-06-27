// pages/index/index.js
import request from '../../utils/request'
const app = getApp()
Page({
  data: {
    consultationRecords: [{
    }],
  choosedId: -1,
  },

  goToConsultation() {
    
    wx.navigateTo({
      url: "/pages/waiting/waiting",
    });
  },

  goToRecordDetails(event) {
    console.log(event)
    const recordId = event.currentTarget.dataset.recordid;
    this.setData({
      choosedId: recordId
    })
    wx.navigateTo({
      url: '/pages/evaluation/evaluation',
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
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
    let promise = app.globalData.TIM.getMyProfile()
    promise.then(function(imResponse) {
      app.globalData.avatar = imResponse.data.avatar; // 存储用户资料的数组 - [Profile]
    }).catch(function(imError) {
      console.warn('getUserProfile error:', imError); // 获取其他用户资料失败的相关信息
    })
    request({
      url: '/records/recordForVisitor/'+app.globalData.pno,
    }).then(res=>{
      this.setData(
        {
         consultationRecords: res.data.records
        }
      )
    }).then(
      console.log('-----------'),
      console.log(this.data.consultationRecords),
      )
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

