// pages/consultation/consultation.js
import request from '../../utils/request'
const {getDatePattern,isJSON} = require('../../utils/util')
let DATA_APP = {};
let DATA_TIM = {};
let TIM_MSG = [];
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sessionList: [
    ],
  },
  //改动todetail函数，查看完整聊天记录
  todetail(event){
    app.globalData.username = event.currentTarget.dataset.otherid;
    app.globalData.choosed_consulor_name = event.currentTarget.dataset.name;
    if(app.globalData.username!=null){
      wx.navigateTo({
        url: '/pages/chat/chat',
      }).then(res=>{
        request({
          url: '/counselors/addCurrent/'+app.globalData.username,
          method:'GET'
        })
      })
    }
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
    const that = this 
    this.data.timer = setInterval(function(){
      DATA_APP = getApp() && getApp().globalData || {};
      DATA_TIM = DATA_APP.TIM || {};
      let promise = DATA_TIM.getConversationList();
      var tempList = [];
      var fromAccountList = [];
      promise.then(function(imResponse) {
        const conversationList = imResponse.data.conversationList; // 全量的会话列表，用该列表覆盖原有的会话列表
        const isSyncCompleted = imResponse.data.isSyncCompleted; // 从云端同步会话列表是否完成
        for (let i=0; i<conversationList.length; i++){
          const conversation = conversationList[i];// 提取所需的字段
          const conversationID = conversation.conversationID;
          const userProfile = conversation.userProfile;
          const nickname = userProfile.nick ;
          const lastMessage = conversation.lastMessage;
          const fromAccount = lastMessage.fromAccount;
          const messageForShow = lastMessage.messageForShow;
          const lastTime = lastMessage.lastTime;
          // 创建一个对象，存储提取的会话信息
          const extractedItem = {
          id: i,
          avatar: "/static/images/tabs/tab-personal-current.png",
          username: conversationID.substring(3),
          message: messageForShow,
          fromAccount: fromAccount,
          time: getDatePattern(new Date(lastTime * 1000), 'yyyy-MM-dd HH:mm'),
          name: nickname.length!=0? nickname: conversationID.substring(3),
    };
          tempList.push(extractedItem);
          fromAccountList.push(fromAccount)
        }
        promise = DATA_TIM.getUserProfile({userIDList:fromAccountList});
        var fromAccount_nickName = '';
        var tempnickName = {}
        promise.then(function(imResponse){
          fromAccount_nickName = imResponse.data;
          for (let i=0; i<fromAccount_nickName.length;i++){
            tempnickName[fromAccountList[i]] = fromAccount_nickName[i].nick
          }
          tempList.forEach(item=>{
            item.message = tempnickName[item.fromAccount]+':'+ item.message
          });
          that.setData({
            sessionList:tempList
          });
        });
      }).catch(function(imError) {
        console.warn('getConversationList error:', imError); // 获取会话列表失败的相关信息
        return 
      })
    }, 200);

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