// pages/convey/convey.js
import request from '../../utils/request';
import TIM from "tim-wx-sdk";
const app = getApp()
const common = require('../../utils/common')
const {getDatePattern,isJSON,msToDate} = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    consultationRecords: [
    ],
    
    selectedRecords: []
  },

  checkboxChange(event) {
    this.setData({selectedRecords: event.detail.value });
  },

  sendRecords() {
    if (this.data.selectedRecords.length === 0) {
      wx.showToast({
        title: '请选择咨询记录',
        icon: 'none'
      });
    } else {
      wx.showToast({
        title: '成功',
        icon: 'success'
      });
      console.log('选中的咨询记录的id:', this.data.selectedRecords);
      for(let i=0; i<this.data.selectedRecords.length;i++){
        console.log(this.data.consultationRecords[this.data.selectedRecords[i]]);
        var that = this;
        let promise = app.globalData.TIM.getMessageList({conversationID: 'C2C'+this.data.consultationRecords[this.data.selectedRecords[i]].c_username});
        promise.then(function(imResponse) {
          var messageList = imResponse.data.messageList; // 消息列表。
          messageList = that.selectMessage(messageList, that.data.consultationRecords[that.data.selectedRecords[i]])
          if (messageList.length==0){
                 wx.showToast({
                   title: '会话内容为空',
                   icon:'error'
                 })
                 return 
          }else{
          let mergerMessage = app.globalData.TIM.createMergerMessage  ({
            to: app.globalData.username,
            conversationType: TIM.TYPES.CONV_C2C,
            payload: {
              messageList: messageList,
              title: `${that.data.consultationRecords[that.data.selectedRecords[i]].v_name}和${that.data.consultationRecords[that.data.selectedRecords[i]].c_name}的聊天记录`,
              abstractList: that.getabstractList(messageList),
              compatibleText: '请升级IMSDK到v2.10.1或更高版本查看此消息'
            },
          });
          const pages = getCurrentPages();
          const prev_pages = pages[pages.length-2];
          prev_pages.TIM_sendMessageFun(mergerMessage, 'TIMRelayElem');
          console.log('Send one message!');
      }})
      }
    }
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
    request({
      url: '/records/recordForVisitor/'+app.globalData.pno,
    }).then(res=>{
      var data = res.data.records
      data = data.map((member, index)=>{
        return {...member, id: index}})
      this.setData(
        {
         consultationRecords: data
        }
      )
    }).then(
      )
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
  getabstractList(messageList){
    var usedMessage_list = []
    if (messageList.length>3){
      usedMessage_list=messageList.slice(-3)
    }else{
      usedMessage_list=messageList
    }
    var return_list = usedMessage_list.map(item=>{
      var message = ''
      if (item.type == "TIMSoundElem"){
      message = `${item.nick}:语音消息`
      }
      if (item.type == "TIMRelayElem"){
        message = `${item.nick}:合并消息`
      }
      if (item.type == "TIMImageElem"){
      message = `${item.nick}:图片`
      }
      if (item.type == "TIMTextElem"){
        message = `${item.nick}:${item.payload.text.slice(0,10)}`
      }
      return message
    })
    console.log(return_list)
    return return_list
  },
  selectMessage(messageList, item){
    console.log('-------');
    let date =new Date(item.starttime);
    let timestamp = date.getTime()/1000;
    // convert duration to milliseconds
    let durationParts = item.duration.split(":");
    let durationInMilliseconds = (parseInt(durationParts[0]) * 60 * 60 + parseInt(durationParts[1]) * 60 + parseInt(durationParts[2])) * 1000;
    let duration_timestamp = durationInMilliseconds/1000
    let return_list = []
    console.log(messageList)
    console.log(timestamp,duration_timestamp)
    for (let i =0; i<messageList.length;i++){
      if (((messageList[i].clientTime)>=timestamp)&&((messageList[i].clientTime)<=(timestamp+duration_timestamp))){
        console.log(messageList[i])
        return_list.push(messageList[i])
      }
    }
    return return_list
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})