//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    selectIndex: null,
    store: null,
    items: null,
    post: {
      patientId: "",
      patientName: "",
      patientGender: "1",
      patientAge: "",
      patientAddress: "",
      patientPhone: "",
      caseNo: "",
      clinicalDiagnosis: "",
      approvalDoctor: "",
      deployDoctor: "",
      checkDoctor: "",
      creator: "",
      departmentId: "",
      zhengheRxDetailList: [
        {
          productId: "",
          num: "",
          sig: ""
        }
      ]
    }
  },
  onLoad: function () {
  },
  onChooseStore: function () {
    wx.navigateTo({
      url: '/pages/store/store',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    });
  },
  onShareAppMessage: function () {
    return {
      title: '——' + app.globalData.shareProfile,
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  onChooseItem: function () {
    wx.navigateTo({
      url: '/pages/item/search',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    });
  },
  onShow: function () {
    console.debug('234234');
    if (!app.globalData.id) {
      wx.navigateTo({
        url: '/pages/login/login',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
    var store = wx.getStorageSync("store");
    if (store) {
      this.setData({ store: store });
    }
    var items = wx.getStorageSync("items");
    if (items) {
      if (this.data.selectIndex != null) {
        //获取填写的备注
        var sig = wx.getStorageSync("edit.txt");
        items[this.data.selectIndex].sig = sig;
        wx.removeStorageSync("edit.txt");
        this.data.selectIndex = null;
        wx.setStorageSync("items", items);
      }
      this.setData({ items: items });
      
    }
  },
  registName: function (e) {
    var val = e.detail.value;
    this.data.post.patientName = val;
  },
  radioChange: function (e) {
    var val = e.detail.value;
    this.data.post.patientGender = val;
  },
  registAge: function (e) {
    var val = e.detail.value;
    this.data.post.patientAge = val;
  },
  registPhone: function (e) {
    var val = e.detail.value;
    this.data.post.patientPhone = val;
  },
  registClinicalDiagnosis: function (e) {
    var val = e.detail.value;
    this.data.post.clinicalDiagnosis = val;
  },
  registItem: function (e) {
    //编辑备注
    var idx = e.currentTarget.dataset.index;
    this.data.selectIndex = idx;
    wx.setStorageSync("edit.txt", this.data.items[idx].sig);
    wx.navigateTo({
      url: '/pages/edit/index',
    });
    
  },
  submit: function () {
    var post = this.data.post;
    if (post.patientName == '') {
      wx.showModal({
        title: '提示',
        content: '请输入名称！',
      });
    } else if (this.data.items == null) {
      wx.showModal({
        title: '提示',
        content: '请选择药品！',
      });
    } else if (!(!isNaN(parseFloat(post.patientAge)) && isFinite(post.patientAge))) {
      wx.showModal({
        title: '提示',
        content: '请输入正确年龄！',
      });
    } else if (this.data.store == null) {
      wx.showModal({
        title: '提示',
        content: '请选择店铺！',
      });
    } else {
      wx.showLoading({
        title: '正在提交数据...',
      });
      var that = this;
      
      //医生
      that.data.post.creator = app.globalData.id;
      //店铺编号
      that.data.post.departmentId = that.data.store.id;
      //商品列表
      that.data.post.zhengheRxDetailList = [];
      for (var i = 0; i < that.data.items.length; i++) {
        var item = {
          productId: that.data.items[i].id,
          num: that.data.items[i].total,
          sig: that.data.items[i].sig
        };
        that.data.post.zhengheRxDetailList[i] = item;
      }
      wx.request({
        method: "POST",
        url: app.globalData.domain + "/api/ZhengheRx/create",
        data: that.data.post,
        header: {
          'content-type': 'application/json'
        },
        success: function (json) {
          wx.hideLoading();
          var data = json.data;
          if (data.resultCode == 0) {
            that.data.post.patientName = that.data.post.clinicalDiagnosis = that.data.post.patientPhone
              = that.data.post.patientAge = "";
            that.data.post.zhengheRxDetailList = [];

            wx.removeStorageSync("items");
            that.setData({ commodityList: [], items: [], post: that.data.post });

            wx.showModal({
              title: '创建成功',
              showCancel: false,
              content: '取药单号：' + data.resultData.rxNo,
            })
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
          wx.hideLoading();
        }
      });
    }

  }
})
