// 发送ajax请求
import config from '../utils/config'
export default (params)=>{
  return new Promise((resolve,reject)=>{
    //初始化promise实例的状态为pending
    const url = params.url 
    const data = params.data
    const method = params.method
    console.log(config.host + url)

    wx.request({
        url:config.host + url,//请求地址
        data:data,//请求参数对象
        method:method,//请求方法
        header: {
          cookie: wx.getStorageSync('cookies') ? wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U') !== -1):''
        },
        
        success:(res)=>{
          resolve(res.data);
        },
        fail:(err)=>{
          reject(err);
        }
    })
  })
}