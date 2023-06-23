import TIM from "tim-wx-sdk";
const {getDatePattern,isJSON,msToDate} = require('../../utils/util');
let DATA_APP = {};
let DATA_TIM = {};
let TIM_MSG = [];
const app = getApp();

let recorderManager = wx.getRecorderManager();
const myaudio = wx.createInnerAudioContext();
const recordOptions = {
  duration: 60000, // 录音的时长，单位 ms，最大值 600000（10 分钟）
  sampleRate: 44100, // 采样率
  numberOfChannels: 1, // 录音通道数
  encodeBitRate: 192000, // 编码码率
  format: 'aac' // 音频格式，选择此格式创建的音频消息，可以在即时通信 IM 全平台（Android、iOS、微信小程序和Web）互通
};
Page({
    data: {
        colToView: '',
        colUserId: '',
        colUserOtherId: '',
        colSendMsg: '',
        colPercent: 0,
        pageLastLength: 1,
        pageNext: '',
        pageCompleted: '',
        showSendMore: false,
        showLoading: true,
        showThree: true,
        showEnd: true,
        showAudio:false,
        title: '正在录音',
        title_input:"按住 说话",
        isrecord: true,
        isRecording: false,
        canSend: true,
        isplayId: '',
        isSelected: -1,
        arrMsg: [],
        arrImg: [],
        arrMerge: [],
    },

    onLoad(options) {
        console.log('初始化....')
        DATA_APP = getApp() && getApp().globalData || {};
        DATA_TIM = DATA_APP.TIM || {};
        TIM_MSG = [];
        if (DATA_APP.username.length==0){
              wx.showModal({
                title: '未选择咨询师！',
                content: '是否立刻选择咨询师？',
                confirmText: '确定',
                cancelText: '取消',
                complete: (res) => {
                  if (res.cancel) {
                    wx.redirectTo({
                      url: '/pages/index/index',
                    })
                  }
                  if (res.confirm) {
                    wx.redirectTo({
                      url: '/pages/waiting/waiting',
                    })
                  }
                }
              })
        }else{
        this.setData({
          colUserOtherId : DATA_APP.username,
          colUserId: DATA_APP.pno
        });
        console.log(this.data);
//        this.data.colUserOtherId = 'administrator';
        this.TIM_getMsgList();
        
        //订阅初始化获取聊天记录
        wx.event.on('conversationInit', () => {
            this.TIM_getMsgList();
        });

        //订阅收到消息
        wx.event.on('received', (e) => {
            this.TIM_setGlobalMsg(e,'received');
        });

        //录音
        recorderManager.onStart(() => {
          console.log('recorder start')
        })
        recorderManager.onPause(() => {
          console.log('recorder pause')
        })
        recorderManager.onStop((res) => {
          console.log('recorder stop')
          console.log(res)
          wx.hideLoading()
          if (this.data.canSend) {
            if (res.duration < 1000) {
              wx.showToast({
                title: '录音时间太短',
                icon: "none"
              })
            } else {
              // 4. 
              let param = {
                to:  this.data.colUserOtherId, // 消息的接收方
                conversationType: TIM.TYPES.CONV_C2C,
                payload: {
                  file: res
                }
              }
              const message = DATA_TIM.createAudioMessage(param);
              this.TIM_sendMessageFun(message);
            }
          }
        })
    }
  },

    //im获取消息、打开某个会话时，第一次拉取消息列表
    TIM_getMsgList() {
        this.onShowLoading();
        let param = {
            conversationID: 'C2C' + this.data.colUserOtherId,
            count: 15,
            nextReqMessageID: this.data.pageNext
        };
        let promise = DATA_TIM.getMessageList(param);
        promise.then((imResponse) => {
            this.TIM_setGlobalMsg(imResponse, 'load', true);
        });
    },

    //im获取消息、打开某个会话时，第一次拉取消息列表
    TIM_getMsgListMore() {
        this.onShowLoading();
        let param = {
            conversationID: 'C2C' + this.data.colUserOtherId,
            count: 1,
            nextReqMessageID: this.data.pageNext
        };
        let promise = DATA_TIM.getMessageList(param);
        promise.then((imResponse) => {
            this.TIM_setGlobalMsg(imResponse, 'load');
        });
    },

    //im创建文本消息
    TIM_createMsg() {
      if (this.data.colSendMsg.length!=0){
        let param = {
            to: this.data.colUserOtherId,
            conversationType: TIM.TYPES.CONV_C2C,
            payload: {
                text: this.data.colSendMsg
            }
          }
          let message = DATA_TIM.createTextMessage(param);
          this.TIM_sendMessageFun(message);
          this.onClearInput();
          }else{
            wx.showToast(
              {
                title: '消息不能为空',
                icon: 'error'
              }
            )
          }
        },

    //im创建自定义消息
    TIM_createMsgCustom(msg) {
        
        let param = {
            to: this.data.colUserOtherId,
            conversationType: TIM.TYPES.CONV_C2C,
            payload: {
                data: JSON.stringify(paramText), // 用于标识该消息是骰子类型消息
                description: '描述主题', // 获取骰子点数
                extension: '描述说明'
            }
        };
        let message = DATA_TIM.createCustomMessage(param);
        this.TIM_sendMessageFun(message);
    },

    // im创建图片- 选择图片
    TIM_createPhoto(e) {
        let that = this;
        let name = e.currentTarget.dataset.name;
        if (name === 'album') {
            that.TIM_createPhotoNow(name)
        } else if (name === 'camera') {
            wx.getSetting({
                success: function (res) {
                    if (!res.authSetting['scope.camera']) { // 无权限，跳转设置权限页面
                        wx.authorize({
                            scope: 'scope.camera',
                            success: function () {
                                that.TIM_createPhotoNow(name)
                            }
                        })
                    } else {
                        that.TIM_createPhotoNow(name)
                    }
                }
            })
        }
    },

    // im创建图片- 创建完成
    TIM_createPhotoNow(name) {
        let that = this;
        let colUserId = this.data.colUserId;
        wx.chooseImage({
            sourceType: [name],
            count: 1,
            success: (res) => {
                // 在发送之前先push进去一张图片
                let messageList = that.data.arrMsg;
                let data = {
                    type: 'TIMImageElem',
                    send: true,
                    from: colUserId,
                    showSendMore: res.tempFilePaths[0]
                };
                messageList.push(data);
                that.setData({
                    arrMsg: messageList
                });
                that.onHideSendMore();
                that.pageScrollToBottom(true);
                // 2. 创建消息实例，接口返回的实例可以上屏
                let message = DATA_TIM.createImageMessage({
                    to: that.data.colUserOtherId, // 消息的接收方,
                    conversationType: TIM.TYPES.CONV_C2C,
                    payload: {file: res},
                    onProgress: (event) => {
                        event = event || 0;
                        that.setData({
                            colPercent: event * 100
                        })
                    }
                });
                that.TIM_sendMessageFun(message,'TIMImageElem')
            }
        })
    },

    //im发送-处理
    TIM_sendMessageFun(message, type) {
        DATA_TIM.sendMessage(message).then((imResponse) => {
            // 发送成功
            if (type === 'TIMImageElem') {
                let messageList = this.data.arrMsg;
                messageList.pop();
                this.setData({
                    arrMsg: messageList
                })
            }
            this.TIM_setGlobalMsg(imResponse, 'send');
            this.onHideSendMore();
            this.onClearInput();
        }).catch((imError) => {
            console.warn('发送失败:', imError);
        })
    },

    //im处理数据
    TIM_setGlobalMsg(imResponse, type, loadFirst) {
        console.log('消息列表',imResponse);
        if (type === 'send'||type === 'received') {
            let data = {};
            if(type === 'received'){
                data = imResponse.data[0];
                // this.setData({
                //     showThree:false,
                // })
            }else {
                data = imResponse.data.message||{};
            }
            let arrMsg = this.data.arrMsg;
            let arrImg = this.data.arrImg;
            let arrMerge = this.data.arrMerge;
            if (data.type === 'TIMRelayElem'){
              arrMerge.push(data)
            }
            if (data.type === 'TIMImageElem') {
                arrImg.push(data.payload.imageInfoArray[0].url);
            }
            if(data.type === 'TIMCustomElem') {
                data.dataCustom = isJSON(data.payload.data)? JSON.parse(data.payload.data):{};
            }
            data.timeFormat = getDatePattern(new Date(data.time * 1000), 'yyyy-MM-dd HH:mm');
            arrMsg.push(data);
            this.setData({
                arrMsg: arrMsg,
                arrImg: arrImg,
                arrMerge: arrMerge,
            }, () => {
                this.pageScrollToBottom(true)
            });
        }else {
            let data = imResponse.data||{};
            let arrData = data.messageList || [];
            let arrImg = [];
            let arrMerge = [];
            console.log('Onload!')
            arrData = arrData.map(x => {
                console.log(x.type);
                if (x.type === 'TIMRelayElem'){
                    arrMerge.push(x)
                }
                if (x.type === 'TIMImageElem') {
                    arrImg.push(x.payload.imageInfoArray[0].url);
                }
                if(x.type === 'TIMCustomElem') {
                    x.dataCustom = isJSON(x.payload.data)? JSON.parse(x.payload.data):{};
                }
                x.timeFormat = getDatePattern(new Date(x.time * 1000), 'yyyy-MM-dd HH:mm')
                return x
            });
            arrImg = arrImg.concat(this.data.arrImg);
            arrImg = arrImg.concat(this.data.arrMerge);
            TIM_MSG = arrData.concat(this.data.arrMsg);// 全局消息列表
            this.setData({
                'arrMsg': TIM_MSG,
                'arrImg': arrImg,
                'arrMerge': arrMerge,
                'pageNext': data.nextReqMessageID,// 用于续拉，分页续拉时需传入该字段。
                'pageCompleted': data.isCompleted,// 表示是否已经拉完所有消息。
                'pageLastLength':arrData.length//用户定位滚动位置
            }, () => {
                this.onHideLoading();
                this.pageScrollToBottom(loadFirst)
            });
        }
    },

    //实时更新输入框的数据
    onInputMsg(e) {
        this.setData({
            'colSendMsg': e.detail.value
        })
    },

    onClearInput() {
        this.setData({
            'colSendMsg': ''
        })
    },

    //显示加载框
    onShowLoading() {
        this.setData({
            'showLoading': true
        });
    },

    //隐藏加载框
    onHideLoading() {
        this.setData({
            'showLoading': false
        });
    },
    //输入转换
    convert1() {
      this.setData({
        'showAudio': true
      });
    },

    convert2() {
      this.setData({
        'showAudio': false
      });
    },

    UpdateSendMore(){
      if (this.data.showSendMore == true){
        console.log('YES')
        this.onHideSendMore()
      }else{
        console.log("NO")
        this.onShowSendMore()
      }
    },
    // 点更多出现图片和相册
    onShowSendMore() {
        this.setData({
            showSendMore: true
        })
    },

    // 点击屏幕 发消息更多的弹框下去
    onHideSendMore() {
        this.setData({
            showSendMore: false
        })
    },

    // 预览
    previewImage(e) {
        let url = e.currentTarget.dataset.url;
        wx.previewImage({
            current: url, // 当前显示图片的http链接
            urls: this.data.arrImg
        })
    },


    //滚动到页面底部
    pageScrollToBottom(isBottom) {
        let index = null;
        if (isBottom) {
            index = 'msg-' + (this.data.arrMsg.length - 1);
        } else {
            index = 'msg-' + 0;
        }
        this.setData({
            colToView: index
        })
    },

    //加载更多
    onLoadMore() {
        if (!this.data.pageCompleted) {
            this.TIM_getMsgListMore()
        }
    },

    // 点击录音
  record(e) {
    this.setData({
      isrecord: !this.data.isrecord
    })
  },
  // 长按事件
  handleRecordStart(e) {
    var that = this
    that.setData({
      startPoint: e.touches[0],
      title: '正在录音',
      isRecording: true,
      canSend: true,
      title_input: '抬起 停止'
    })
    that.startRecording()
  },
  // 录音时的手势上划移动距离对应文案变化
  handleTouchmove(e) {
    var that = this
    var isRecording = that.data.isRecording
    var startPoint = that.data.startPoint
    if (isRecording) {
      if (startPoint.clientY - e.touches[e.touches.length - 1].clientY > 100) {
        that.setData({
          title: '松开手指，取消发送',
          canSend: false
        })
      } else if (startPoint.clientY - e.touches[e.touches.length - 1].clientY > 20) {
        that.setData({
          title: '上划可取消',
          canSend: true
        })
      } else {
        that.setData({
          title: '正在录音',
          canSend: true
        })
      }
    }
  },
  // 手指离开页面滑动
  handleRecordStop(e) {
    wx.hideLoading()
    recorderManager.stop()
    this.setData({
      isRecording: false,
      title_input: '按住 说话'
    })
  },
  // 开始录音之前要判断一下是否开启权限
  startRecording () {
    wx.getSetting({
      success: (res) => {
        let auth = res.authSetting['scope.record']
        if (auth === false) { // 已申请过授权，但是用户拒绝
          wx.openSetting({
            success: function (res) {
              let auth = res.authSetting['scope.record']
              if (auth === true) {
                wx.showToast({
                  title: '授权成功',
                  icon: 'success',
                  duration: 1500
                })
              } else {
                wx.showToast({
                  title: '授权失败',
                  icon: 'none',
                  duration: 1500
                })
              }
            }
          })
        } else if (auth === true) { // 用户已经同意授权
          this.setData({
            isRecording: true
          })
          recorderManager.start(recordOptions)
        } else { // 第一次进来，未发起授权
          wx.authorize({
            scope: 'scope.record',
            success: () => {
              wx.showToast({
                title: '授权成功',
                icon: 'success',
                duration: 1500
              })
            }
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: '授权失败',
          icon: 'none',
          duration: 1500
        })
      }
    })
  },

  //音频播放 
  audioPlay: function (e) {
    var that = this
    var uuid = e.currentTarget.dataset.uuid // 要播放的音频的id
    var src = e.currentTarget.dataset.src //要播放的音频
    myaudio.src = src
    myaudio.autoplay = true
    //切换显示状态
    this.setData({
      isplayId: uuid
    })
    myaudio.play()
  
    //开始监听
    myaudio.onPlay(() => {
      console.log('监听播放的回调函数')
    })
  
    //结束监听
    myaudio.onEnded(() => {
      that.setData({
        isplayId: ''
      })
    })
  },

  audioStop() {
    this.setData({
      isplayId: ''
    })
    myaudio.stop();
  },

  handleTouchStart(e) {
    const relayid = e.currentTarget.dataset.id;
    this.setData({
      isSelected: relayid
    });
    console.log(this.data.isSelected);
  },

  toRecordDetail(e) {
    const common = require('../../utils/common')
    console.log(this.data)
    console.log(common);
    console.log(e.currentTarget.dataset.msg.payload.messageList);
    common.default.messageList = e.currentTarget.dataset.msg.payload.messageList.map(item=>{
      item.clientTime = getDatePattern(new Date(item.clientTime * 1000), 'yyyy-MM-dd HH:mm')
      return item
    })
  wx.navigateTo({
    url: '/pages/record/record',
  })
  },

  
  handleTouchEnd(e) {
    this.setData({
      isSelected: -1
    });
  },

  onReady() {

  },

/**
 * 生命周期函数--监听页面显示
 */
onShow() {
   wx.hideHomeButton();
   wx.event.on('conversationInit', () => {
    this.TIM_getMsgList();
});

//订阅收到消息
wx.event.on('received', (e) => {
    this.TIM_setGlobalMsg(e,'received');
});
},

/**
 * 生命周期函数--监听页面隐藏
 */
onHide() {

},

/**
 * 生命周期函数--监听页面卸载
 */
  Unload() {
    let message = DATA_TIM.createCustomMessage({
      to: this.data.colUserOtherId,
      conversationType: TIM.TYPES.CONV_C2C,
      payload: {
        data: 'Over', // 用于标识该消息是骰子类型消息
      }
    });
  this.TIM_sendMessageFun(message);  
  wx.showToast({
      title: '正在跳转至评价界面，请稍等!',
      icon: 'none',
      duration: 3000
    }).then(res=>{
      wx.navigateTo({
        url: `/pages/evaluating/evaluating?app_Data=${app.globalData}&start_time=${this.data.start_time}&duration=${this.data.duration}`,
      })
    })
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

},

onComplete(e){
  const start_time = msToDate(e.detail.startTime).hasTime;
  const duration = e.detail.time;
  console.log(start_time, duration);
  this.setData({
    start_time: start_time,
    duration: duration
  });
  this.Unload()

}

});

