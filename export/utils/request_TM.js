function request_TM(params){
  return new Promise((resolve, reject)=>{
    wx.showLoading({
      title: '正在加载中...',
    })
    console.log(params)
    wx.request({
      url: 'https://service-l6j9nypz-1318465135.sh.apigw.tencentcs.com/release'+params.url,
      method: params.method,
      data: params.data,
      header: params.header,
      success:(res)=>{
        console.log(res.data)
        resolve(res.data)
      },
      fail:(err)=>{
        reject(err)
      },
      complete:()=>{
        wx.hideLoading({
          success:(res)=>{},
        })

      }
    })
  })
}

export default request_TM

