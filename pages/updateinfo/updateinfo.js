// pages/updateinfo/updateinfo.js
// pages/updateinfo/updateinfo.js
import request from '../../utils/request'
var app = getApp()
let pages = ''
let prev_page = ''

Page({
  data: {
    avatar: '',
    realName: '',
    gender: '',
    emergencyContactName: '',
    emergencyContactNumber: ''
  },

  chooseavatar(e) {
    this.setData({
      avatar: e.detail.avatarUrl
    });
  },

  inputRealName(e) {
    this.setData({
      realName: e.detail.value
    });
  },

  handleGenderChange(event) {
    console.log(event.detail);
    this.setData({
    gender: event.detail.value,
    });
  },

  inputEmergencyName(e) {
    this.setData({
      emergencyContactName: e.detail.value
    });
  },

  inputEmergencyNumber(e) {
    this.setData({
      emergencyContactNumber: e.detail.value
    });
  },

  saveInformation() {
    // 执行保存修改操作
    const { avatar, realName, gender, emergencyContactName, emergencyContactNumber } = this.data;
    if (realName==''||emergencyContactName==''||emergencyContactNumber==''){
      wx.showToast({
        title: '姓名和紧急联系人信息不能为空',
        icon: 'none'
      })
      return;
    }
    let phoneReg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
    if(!phoneReg.test(emergencyContactNumber)){
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none'
      })
      return;
    }
    if (!gender) {
      wx.showToast({
      title: '请选择性别',
      icon: 'none',
      });
      return;
    }
    var promise = '';
    request({
      url:'/visitors/update',
      method: 'PATCH',
      data:{
        name: realName,
        image: avatar, 
        contact_pno: emergencyContactNumber,
        gender: gender,
        contact_name: emergencyContactName,
        pno: app.globalData.pno
      }
    }).then(res=>{
      if (res.code == "1"){
        wx.showToast({
          title: '成功修改个人信息并保存',
          icon: 'success'
        }).then(
          app.globalData.avatar = avatar,
          app.globalData.contact_pno = emergencyContactNumber,
          app.globalData.contact_name = emergencyContactName,
          app.globalData.name =  realName,
          app.globalData.gender =  gender,
          pages = getCurrentPages(),
          prev_page = pages[pages.length-1],
          prev_page.setData({
            avatar: (app.globalData.avatar==null)?'':((app.globalData.avatar.length==0)?'':app.globalData.avatar),
            realName: app.globalData.name,
            gender: app.globalData.gender,
            contactNumber: app.globalData.pno,
            emergencyContactName: app.globalData.contact_name,
            emergencyContactNumber: app.globalData.contact_pno,
         }),
         // 修改个人标配资料
            promise =app.globalData.TIM.updateMyProfile({
  nick: app.globalData.name,
  avatar: (app.globalData.avatar==null)?'':((app.globalData.avatar.length==0)?'':app.globalData.avatar),
  }),
  promise.then(function(imResponse) {
  console.log(imResponse.data); // 更新资料成功
}).catch(function(imError) {
  console.warn('updateMyProfile error:', imError); // 更新资料失败的相关信息
}),
          console.log('更新成功'),
          wx.navigateBack()
        )
      }else{
        wx.showToast({
          title:'修改失败！',
          icon: 'error'
        })
      }
    })

    // 保存成功后给出提示
    wx.showToast({
      title: "保存成功",
      icon: "success",
      duration: 2000,
      success: function () {
        // 保存成功后返回上一页或其他操作
        wx.navigateBack();
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      avatar: (app.globalData.avatar==null)?'':((app.globalData.avatar.length==0)?'':app.globalData.avatar),
      realName: app.globalData.name,
      gender: app.globalData.gender,
      emergencyContactName: app.globalData.contact_name,
      emergencyContactNumber: app.globalData.contact_pno,
   })
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