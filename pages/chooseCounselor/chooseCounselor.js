// pages/chooseCounselor/chooseCounselor.js
import request from '../../utils/request'
var that = ''
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    counselor: [
    ],
  },

  choose(event) {
    console.log(event);
    const { item, _} = event.currentTarget.dataset;
    console.log(item)
    if (item.is_Busy === 'busy') {
      wx.showModal({
        title: '咨询师忙碌',
        content: '该咨询师当前忙碌，请问是否愿意等待？',
        confirmText: '等待',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            // 用户点击等待，执行排队队列的操作
            console.log('进入排队队列');
            wx.showToast({
              title: '已加入排队队列！',
            })
          } else if (res.cancel) {
            // 用户点击取消，回到咨询师列表
            console.log('取消选择咨询师');
          }
        },
      });
    } else if (item.is_Busy == 'free') {
      wx.showModal({
        title: '确认咨询',
        content: '是否确认选择该咨询师进行咨询？',
        confirmText: '确定',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            // 用户点击确定，创建咨询会话，进入会话界面
            console.log('创建咨询会话，进入会话界面');
            this.create_session(item)
          } else if (res.cancel) {
            // 用户点击取消，回到咨询师列表
            console.log('取消选择咨询师');
          }
        },
      });
    }else{
      wx.showToast({
        title: '此账号暂时异常',
        icon: 'error'
      })
    }
  },
  create_session(item){
      console.log('----------')
      app.globalData.username = item.username
      request({
        url: '/counselors/addCurrent/'+app.globalData.username,
        method:'GET'
      })
      wx.redirectTo({
        url: '/pages/chat/chat',
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options){
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    request({
      url:'/counselors/online/list',
      method: 'GET',
    }).then(res=>{
      console.log(res.data)
      console.log(that.data)
      this.setData(
        {
          counselor: res.data.counselors
        }
      )
      that.data.counselor = that.data.counselor.map((member, index)=>{
        return {...member, id: index}
      })
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow:function() {
    that = this
    that.data.timer = setInterval(function(){
      request({
        url:'/counselors/online/list',
        method: 'GET',
      }).then(res=>{
        that.setData(
          {
            counselor: res.data.counselors
          }
        )
        that.data.counselor = that.data.counselor.map((member, index)=>{
          return {...member, id: index}
        })
        console.log(that.data.counselor)
      })
   },10000)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    clearInterval(this.data.timer);
    this.setData({
      timer: null
    });
    console.log(this.data.timer)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    clearInterval(this.data.timer);
    this.setData({
      timer: null
    });
    console.log(this.data.timer)

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    request({
      url:'/counselors/online/list',
      method: 'GET',
    }).then(res=>{
      this.setData(
        {
          counselor: res.data.counselors
        }
      )
    })

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