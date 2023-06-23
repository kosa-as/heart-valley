//im-init.js

import TIM from "tim-wx-sdk";//npm方式引入
import COS from "cos-wx-sdk-v5";//npm方式引入
import {genTestUserSig} from "../debug/GenerateTestUserSig";

let DATA_APP = getApp() && getApp().globalData || {};
let DATA_TIM = DATA_APP.TIM || {};


/**
 * IM初始化
 * @return null
 */
export function initTIM(item) {
    let options = {
        SDKAppID: '1400813651'
    };
    if(item){
        DATA_APP = item;
    }
    //避免重复创建im实例
    if (DATA_APP.TIM_INIT) {
        return
    }
    let DATA_TIM_READY = false;
    // 创建 SDK 实例，`TIM.create()`方法对于同一个 `SDKAppID` 只会返回同一份实例
    DATA_TIM = TIM.create(options);// SDK 实例通常用 DATA_TIM 表示
    // 设置 SDK 日志输出级别，详细分级请参见 setLogLevel 接口的说明
    DATA_TIM.setLogLevel(0); // 普通级别，日志量较多，接入时建议使用
    // DATA_TIM.setLogLevel(1); // release 级别，SDK 输出关键信息，生产环境时建议使用
    // 注册 COS SDK 插件   此处暂时隐藏有需求要传图片,文件等的请放开进行配置,记住头部引入
    DATA_TIM.registerPlugin({'cos-wx-sdk': COS});
    // 监听事件，例如：
    DATA_TIM.on(TIM.EVENT.SDK_READY, function (event) {
        //此回调函数中发布'conversationInit'对话列表初始化事件触发页面js中的
        //需要注意的是DATA_TIM.getMessageList({})这个方法必须要在SDK_READY状态才能调用,所以要放在这个回调函数中
        wx.event.emit('conversationList');// 会话列表的监听函数
        wx.event.emit('conversationInit');// 聊天记录的监听函数
        DATA_TIM_READY = true;
        // 收到离线消息和会话列表同步完毕通知，接入侧可以调用 sendMessage 等需要鉴权的接口
        // event.name - TIM.EVENT.SDK_READY
    });
    DATA_TIM.on(TIM.EVENT.MESSAGE_RECEIVED, function (event) {
        console.log('收到消息');
        // 这里收到消息,调用setGlobalMsg方法来处理数据,传入方式标记为'received'接收消息
        wx.event.emit('received', event) // 会话列表的监听函数
        // setGlobalMsg(event,'received');
        // 收到推送的单聊、群聊、群提示、群系统通知的新消息，可通过遍历 event.data 获取消息列表数据并渲染到页面
        // event.name - TIM.EVENT.MESSAGE_RECEIVED
        // event.data - 存储 Message 对象的数组 - [Message]
    });
    DATA_TIM.on(TIM.EVENT.MESSAGE_REVOKED, function (event) {
        // 收到消息被撤回的通知
        // event.name - TIM.EVENT.MESSAGE_REVOKED
        // event.data - 存储 Message 对象的数组 - [Message] - 每个 Message 对象的 isRevoked 属性值为 true
    });
    DATA_TIM.on(TIM.EVENT.MESSAGE_READ_BY_PEER, function (event) {
        // SDK 收到对端已读消息的通知，即已读回执。使用前需要将 SDK 版本升级至 v2.7.0 或以上。仅支持单聊会话。
        // event.name - TIM.EVENT.MESSAGE_READ_BY_PEER
        // event.data - event.data - 存储 Message 对象的数组 - [Message] - 每个 Message 对象的 isPeerRead 属性值为 true
    });
    DATA_TIM.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, function (event) {
        // 收到会话列表更新通知，可通过遍历 event.data 获取会话列表数据并渲染到页面
        // event.name - TIM.EVENT.CONVERSATION_LIST_UPDATED
        // event.data - 存储 Conversation 对象的数组 - [Conversation]
        if(DATA_TIM_READY){
            wx.event.emit('conversationList') // 会话列表的监听函数
        }
    });
    DATA_TIM.on(TIM.EVENT.GROUP_LIST_UPDATED, function (event) {
        // 收到群组列表更新通知，可通过遍历 event.data 获取群组列表数据并渲染到页面
        // event.name - TIM.EVENT.GROUP_LIST_UPDATED
        // event.data - 存储 Group 对象的数组 - [Group]
    });
    DATA_TIM.on(TIM.EVENT.PROFILE_UPDATED, function (event) {
        // 收到自己或好友的资料变更通知
        // event.name - TIM.EVENT.PROFILE_UPDATED
        // event.data - 存储 Profile 对象的数组 - [Profile]
    });
    DATA_TIM.on(TIM.EVENT.BLACKLIST_UPDATED, function (event) {
        // 收到黑名单列表更新通知
        // event.name - TIM.EVENT.BLACKLIST_UPDATED
        // event.data - 存储 userID 的数组 - [userID]
    });
    DATA_TIM.on(TIM.EVENT.ERROR, function (event) {
        // 收到 SDK 发生错误通知，可以获取错误码和错误信息
        // event.name - TIM.EVENT.ERROR
        // event.data.code - 错误码
        // event.data.message - 错误信息
    });
    DATA_TIM.on(TIM.EVENT.SDK_NOT_READY, function (event) {
        // 收到 SDK 进入 not ready 状态通知，此时 SDK 无法正常工作
        // event.name - TIM.EVENT.SDK_NOT_READY
    });
    DATA_TIM.on(TIM.EVENT.KICKED_OUT, function (event) {
        // 收到被踢下线通知
        // event.name - TIM.EVENT.KICKED_OUT
        // event.data.type - 被踢下线的原因，例如:
        //    - TIM.TYPES.KICKED_OUT_MULT_ACCOUNT 多实例登录被踢
        //    - TIM.TYPES.KICKED_OUT_MULT_DEVICE 多终端登录被踢
        //    - TIM.TYPES.KICKED_OUT_USERSIG_EXPIRED 签名过期被踢 （v2.4.0起支持）。
    });
    DATA_TIM.on(TIM.EVENT.NET_STATE_CHANGE, function (event) {
        //  网络状态发生改变（v2.5.0 起支持）。
        // event.name - TIM.EVENT.NET_STATE_CHANGE
        // event.data.state 当前网络状态，枚举值及说明如下：
        //     \- TIM.TYPES.NET_STATE_CONNECTED - 已接入网络
        //     \- TIM.TYPES.NET_STATE_CONNECTING - 连接中。很可能遇到网络抖动，SDK 在重试。接入侧可根据此状态提示“当前网络不稳定”或“连接中”
        //    \- TIM.TYPES.NET_STATE_DISCONNECTED - 未接入网络。接入侧可根据此状态提示“当前网络不可用”。SDK 仍会继续重试，若用户网络恢复，SDK 会自动同步消息
    });
    DATA_APP.TIM_INIT = true;  //完成im实例创建后设置标志为true
    DATA_APP.TIM = DATA_TIM;
    console.log(DATA_APP)
}

/**
 * IM登录
 * @param {Object} item 数据
 * @param {String} item.IM_ID
 * @param {Date} item.IM_KEY
 * @return null
 */
export function loginTIM(item, userID) {
    const userSig = genTestUserSig(userID);
    console.log('UserSig='+userSig);
    if(item){
        DATA_TIM = item.TIM;
    }
    DATA_TIM.login({
        userID,
        userSig
    }).then((imResponse) => {
        console.log('IM登录成功:', imResponse);
    }).catch((imError) => {
        console.log('IM登录失败:', imError);
    });
}

/**
 * IM退出
 * @return null
 */
export function loginOutTIM(item) {
    if(item){
        DATA_APP = item;
    }
    DATA_TIM.logout().then((imResponse) => {
        console.log('IM退出成功:', imError);
    }).catch((imError) => {
        console.log('IM退出失败:', imError);
    });
}

