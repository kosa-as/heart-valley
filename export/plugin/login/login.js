import request from '../../utils/request'
const code = ''
export function login(){
  console.log("授权微信信息")
  wx.getUserProfile({
    desc:'用于注册或者完善资料',
    success:(res)=>{
      wx.login({
        success:(data)=>{
          console.log(data.code)
          this.authImport({
            userInfo:res.userInfo, 
            code:data.code
          })
          this.setData({
            code: userInfo
          })
        }
      })
    },
    fail: res=>{
      console.log('NONONONONO')
    },
  })
  return code
};

function authImport({userInfo, code}){
  request({
    url: "/wxRegister",
    method: "POST",
    data:{
      userInfo,
      code
    },
    header:{
      "content-type":"application/json"
    }
  }).then(res=>{
    console.log(res)
  }),
  this.setData({
    Have_not_login: false
  }),
  this.onLoad()
}