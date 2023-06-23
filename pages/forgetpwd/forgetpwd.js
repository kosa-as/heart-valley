// pages/forgetpwd/forgetpwd.js
import request from '../../utils/request';
import config from '../../utils/config';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    phone: '', // 手机号
    newPassword: '', // 新密码
    confirmPassword: '', // 确认密码
  },

  /**
   * 表单项内容发生改变
   */
  handleInput(event) {
    const type = event.currentTarget.id;
    this.setData({
      [type]: event.detail.value,
    });
  },

  /**
   * 重置密码
   */
  async resetPassword() {
    const { phone, newPassword, confirmPassword } = this.data;
    let phoneReg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
    if(!phoneReg.test(phone)){
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none'
      })
      return;
    }
    // 新密码不为空
    if (!newPassword) {
      wx.showToast({
        title: '新密码不能为空',
        icon: 'none',
      });
      return;
    }

    // 新密码与确认密码一致
    if (newPassword !== confirmPassword) {
      wx.showToast({
        title: '新密码与确认密码不一致',
        icon: 'none',
      });
      return;
    }
    
    // 后端验证
    wx.request({
      url:config.host + '/visitors/updatePassword/'+phone,//请求地址
      data:{
        password:newPassword,
      },//请求参数对象
      method: 'POST',//请求方法
      header: {
       'content-type':'application/x-www-form-urlencoded'
      },
      success:(res)=>{
        wx.showModal({
          title:'修改成功!',
          content:'是否立刻回到登录界面?',
          confirmText: '确定',
          cancelText: '取消',
          complete: (res)=>{
            if (res.cancel){
              return 
            }
            if (res.confirm){
              wx.redirectTo({
                url: '/pages/login/login',
              })
            }
          }})
      },
      fail:(err)=>{
        console.log(err)
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  // 跳转到主页
  tologin() {
    wx.navigateTo({
      url: '/pages/index/index',
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
