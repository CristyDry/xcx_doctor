// pages/item/item.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: []
  },
  registName: function (e) {
    var val = e.detail.value;
    var that = this;
    //查询数据
    wx.request({
      method: "POST",
      url: app.globalData.domain + "/api/ZhengheProduct/searchProduct",
      data: {
        "keys": val,
        "pageNo": "0",
        "pageSize": "10",
        "simple": true
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (json) {
        var data = json.data;
        if (data.resultCode == 0) {
          if (data.resultData == undefined) {
            data.resultData = [];
          }
          for (var i = 0; i < data.resultData.length; i++) {
            data.resultData[i].productPic = data.resultData[i].productPic.replace("http://127.0.0.1:8080/", "https://m.zhenghonghealth.com/");
          }
          that.setData({ items: data.resultData });
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

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})