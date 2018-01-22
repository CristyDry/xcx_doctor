//app.js
App({
  onLaunch: function () {
    this.globalData.id = wx.getStorageSync("id");
    this.globalData.user = wx.getStorageSync("user");
    if (!this.globalData.id){
      wx.navigateTo({
        url: 'pages/login/login',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
   
  },
  globalData:{
    domain: "https://m.zhenghongjiankang.com/zhenghe", 
    host: "https://m.zhenghongjiankang.com/",
    id:null,
    user:null,
    subDomain: "zhenghonghealth",
    version: "1.7",
    shareProfile: '正弘健康' // 首页转发的时候话术
  }
  // 根据自己需要修改下单时候的模板消息内容设置，可增加关闭订单、收货时候模板消息提醒
})
