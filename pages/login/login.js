//获取应用实例
var common = require('../../utils/md5.js');
var app = getApp();
Page({
  data: {
    hasLoginContent: 0,
    userInfo: {}
  },
  loginIn: function () {
    if (!this.data.userInfo.account) { // 手机号码为空
      wx.showModal({
        title: '提示',
        showCancel: false,
        confirmText: '好的',
        content: '请输入手机号码',
        success: function (res) {

        }
      });
    } else if (!!!this.data.userInfo.account.match(/^1\d{10}$/)) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        confirmText: '好的',
        content: '请输入正确的手机号码吧',
        success: function (res) {

        }
      });
    } else if (!this.data.userInfo.pwd) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        confirmText: '好的',
        content: '密码不能为空哦！',
        success: function (res) {

        }
      });
    } else {
      var that = this;
      wx.request({
        method: "POST",
        url: app.globalData.domain + "/api/ZhengheDoctor/loginDoctor",
        data: {
          password: common.hexMD5(this.data.userInfo.pwd),
          phone: this.data.userInfo.account,
          userType : 1,
          tokenName : "null"
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (json) {
          var data = json.data;
          if (data.resultCode == 0) {
            wx.setStorageSync('user', data.resultData);
            wx.setStorageSync('id', data.resultData.id);
            app.globalData.id = data.resultData.id;
            app.globalData.user = data.resultData;
            wx.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 2000,
              mask: true,
              success: function () {              

                wx.reLaunch({
                  url: '../index/index',
                });

              }
            });
          } else {
            // 提示账号或者密码错了哦
            wx.showModal({
              title: '提示',
              content: data.resultMessage,
              showCancel: false,
              confirmText: '好的',
              success: function (res) {

              }
            });
          }
        },
        error: function () {

        }
      });
    }

  },
  onLoad: function (o) {
    
  },
  onShow: function () {
  },
  registAccount: function (e) {
    var val = e.detail.value;
    this.data.userInfo.account = val;
  },
  registPwd: function (e) {
    var val = e.detail.value;
    this.data.userInfo.pwd = val;
  }
})