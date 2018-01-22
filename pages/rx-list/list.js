var wxpay = require('../../utils/pay.js')
var app = getApp()
Page({
  data: {
    statusType: ["待接收", "已完成", "店铺取消", "医生取消"],
    currentType: 0,
    tabClass: ["", "", "", "", ""]
  },
  statusTap: function (e) {
    var curType = e.currentTarget.dataset.index;
    this.data.currentType = curType
    this.setData({
      currentType: curType
    });
    this.onShow();
  },
  orderDetail: function (e) {
    var orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/order-details/index?id=" + orderId
    })
  },
  cancelOrderTap: function (e) {
    var that = this;
    var rxId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确定要取消该订单吗？',
      content: '',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading();
          wx.request({
            url: app.globalData.domain + '/api/ZhengheRx/cancel',
            data: {
              id: rxId
            },
            method: "POST",
            header: {
              'content-type': 'application/json'
            },
            success: (res) => {
              wx.hideLoading();
              if (res.data.resultCode == 0) {
                that.onShow();
              }else{
                wx.showModal({
                  title: '错误',
                  content: res.data.resultMessage
                })
              }
            }
          })
        }
      }
    })
  },  
  onLoad: function (options) {
    // 生命周期函数--监听页面加载

  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  onShow: function () {
    if (!app.globalData.id) {
      wx.navigateTo({
        url: '/pages/login/login',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { }
      });
      return;
    }
    // 获取订单列表
    wx.showLoading();
    var that = this;
    var postData = {
      status: that.data.currentType,
      id: app.globalData.id
    }
    wx.request({
      url: app.globalData.domain + '/api/ZhengheRx/list',
      data: postData,
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        wx.hideLoading();
        var data = res.data;
        if (data.resultCode == 0) {
          if (data.resultData == undefined) {
            data.resultData = [];
          }
          for (var i = 0; i < data.resultData.length; i++) {
            var rx = data.resultData[i];
            for (var j = 0; j < rx.zhengheRxDetailList.length; j++) {
              rx.zhengheRxDetailList[j].imgUrl = rx.zhengheRxDetailList[j].imgUrl.replace("http://127.0.0.1:8080/", app.globalData.host);
            }
          }
          that.setData({
            orderList: data.resultData
          });
        } else {
          this.setData({
            orderList: []
          });
        }
      }
    })

  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数

  }
})