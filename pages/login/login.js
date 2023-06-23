// pages/login/login.js
import request from '../../utils/request'
import request_TM from '../../export/utils/request_TM'
import Event from '../../plugin/tencentIM/event'
wx.event = new Event();

import {initTIM,loginTIM}  from '../../plugin/im-init'

var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',//手机号
    password: ''//密码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  //表单项内容发生改变
  handleInput(event){
    let type = event.currentTarget.id;
    this.setData({
      [type]: event.detail.value
    })
  },
  //登录
  async login(){
    //得到数据
    let {phone,password} = this.data;
    //验证
    //手机号不为空
    if(!phone){
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return;
    }
    //正则验证是一个手机号
    //正则表达式
    let phoneReg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
    if(!phoneReg.test(phone)){
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none'
      })
      return;
    }
    //密码不为空
    if(!password){
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      })
      return;
    }

    //后端验证
    request(
      {      
        url: '/visitors/login',
        data: {
          pno: phone,
          password: password,
        },
        method : 'POST'
      }
    ).then(res=>{
      console.log('Res is')
      console.log(res)
      if (res.code == "1"&&res.data.visitor.status=="normal"){
           //登陆成功
            wx.showToast({
              title: '成功登录',
              icon: 'success'
            }).then(result=>{
            app.globalData.name = res.data.visitor.name
            app.globalData.contact_name = res.data.visitor.contact_name
            app.globalData.gender = res.data.visitor.gender
            app.globalData.pno = res.data.visitor.pno
            app.globalData.contact_pno = res.data.visitor.contact_pno
            app.globalData.avatar = res.data.visitor.image
            wx.switchTab({
              url: '/pages/index/index',
              success:function(res){
                console.log('跳转')
              },
              fail:function(res){
                console.log('登陆失败')
              }    
            })
            this.login_TM()
      }) 
    }else{
      wx.showModal({
        title: '登陆失败',
        content:'密码错误或账号不存在以及被禁用'
      })
      return
    }
  })},
  //跳转到忘记密码界面
  toforgetpwd(){
    wx.navigateTo({
      url: '/pages/forgetpwd/forgetpwd',
    })
  },

  //跳转到注册界面
  toregister(){
    wx.navigateTo({
      url: '/pages/register/register',
    })
  },
  login_TM(){
    console.log("授权微信信息")
    wx.login({
      success:(data)=>{
      console.log('code='+data.code)
      this.authImport({
        userInfo:{
          nickName: app.globalData.name,
          avatar: app.globalData.avatar
        },
        code:app.globalData.pno
      })
    }
  })
    console.log(app.globalData)
    initTIM(app.globalData)
    loginTIM(app.globalData)
},
  authImport({userInfo, code}){
    request_TM({
      url: "/wxRegister",
      method: "POST",
      data:{
        userInfo,
        code
      },
      header:{
        "content-type":"application/json"
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})