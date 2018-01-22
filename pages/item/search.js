// pages/search/index.js
var common = require('../../utils/util');
var app = getApp();
Page({
  data: {
    commodityList: null,
    searchInputSty: 1,
    carCommodityList: null,
    ifShowcommodityCar: false,
    commodityNum: 0,
    totalMoney: 0,
    searchContent: '',
    focusInput: 0,
    direction: 1,
    touchObj: {
      sy: 0
    },
    hasCommodity: 1,
    scrollBar: 0

  },
  secIncreaseNum: function (e) {
    var idx = e.target.dataset.idx;
    var newdata = this.data.commodityList;
    var totalmoney = this.data.totalMoney * 1000;
    ++newdata[idx].total;
    if (newdata[idx].check) { // 如果当前已勾选，计算总额
      if (newdata[idx].IfHasActivityAmount == "1") {
        totalmoney += parseInt(newdata[idx].ActivityAmount * 1000);
      } else {
        totalmoney += parseInt(newdata[idx].appPrice * 1000);
      }

    }
    this.setData({
      commodityList: newdata,
      totalMoney: parseInt(totalmoney) / 1000
    });
  },
  increaseNum: function (e) {
    var idx = e.target.dataset.idx;
    var newdata = this.data.carCommodityList;
    var totalmoney = this.data.totalMoney * 1000;
    ++newdata[idx].total;
    totalmoney += parseInt(newdata[idx].price * 1000);
    this.setData({
      carCommodityList: newdata,
      totalMoney: parseInt(totalmoney) / 1000,
      commodityNum: ++this.data.commodityNum
    });
  },
  decreaseNum: function (e) {
    var that = this;
    var idx = e.target.dataset.idx;
    var newdata = this.data.carCommodityList;
    var totalmoney = this.data.totalMoney * 1000;
    --newdata[idx].total;
    totalmoney -= parseInt(newdata[idx].price * 1000);
    if (newdata[idx].total<1){
      newdata.splice(idx,1);
    }

    this.setData({
      carCommodityList: newdata,
      totalMoney: parseInt(totalmoney) / 1000,
      commodityNum: --this.data.commodityNum
    });

  },
  onLoad: function () {
    wx.setNavigationBarTitle({ title: '选择条目' });
  },
  onShow: function () {
    var carCommodityList = wx.getStorageSync("items");
    if(carCommodityList != null && carCommodityList != ""){
      var totalmoney = 0;
      var nums = 0;
      for(var i =0;i<carCommodityList.length;i++){
        var item = carCommodityList[i];
        totalmoney += (item.total * item.price)*1000;
        nums += item.total;
      }
      this.setData({
        carCommodityList: carCommodityList,
        totalMoney: totalmoney / 1000,
        commodityNum: nums
      });
    }
    wx.showToast({ title: '数据加载中...', icon: 'loading', duration: 60000 });
    this.searchContent();
  },
  searchFocus: function (e) {
    this.setData({
      searchInputSty: 0,
      earchContent: ''
    });
  },
  searchBlur: function (e) {
    if (!e.detail.value) {
      this.setData({
        searchInputSty: 1,
        focusInput: 0
      });
    }
  },
  searchInput: function (e) {
    this.setData({
      searchContent: e.detail.value
    });
    this.searchContent();
  },
  showMoveingCar: function () {
    if (!!this.data.ifShowcommodityCar) {
      this.setData({
        ifShowcommodityCar: 0
      });
    } else {
      this.setData({
        ifShowcommodityCar: 1
      });
    }
  },
  searchContent: function () {
    var that = this;
    var kw = this.data.searchContent || '';
    //查询数据
    wx.request({
      method: "POST",
      url: app.globalData.domain + "/api/ZhengheProduct/searchProduct",
      data: {
        "keys": kw,
        "pageNo": "0",
        "pageSize": "10",
        "simple": true
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (json) {
        wx.hideToast();
        var data = json.data;
        if (data.resultData == undefined) {
          data.resultData = [];         
          that.setData({ hasCommodity: false });
        }else{
          that.setData({ hasCommodity: true });
        }
        if (data.resultCode == 0) {
          for (var i = 0; i < data.resultData.length; i++) {
            data.resultData[i].productPic = data.resultData[i].productPic.replace("http://127.0.0.1:8080/", "https://m.zhenghonghealth.com/");
            data.resultData[i].total = 1;
            data.resultData[i].sig = '';
          }
          that.setData({ commodityList: data.resultData });
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
        wx.hideToast();
      }
    });
  },
  addToCar: function (e) {
    var that = this;
    var idx = e.currentTarget.dataset.idx;
    var item = this.data.commodityList[idx];
    var carCommodityList = that.data.carCommodityList;
        if (carCommodityList == null){
        carCommodityList = [];
    }
    for (var i =0; i < carCommodityList.length;i++){
      if (carCommodityList[i].id == item.id){
        return;
      }
    }
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease',
    });

    this.animation = animation;

    animation.scale(1.2).step();
    animation.scale(0.8).step();
    animation.scale(1.2).step();
    animation.scale(1).step();

    this.setData({
      animationData: animation.export(),
      commodityNum: ++that.data.commodityNum
    });

    
    carCommodityList[carCommodityList.length] = item;
    that.setData({
      carCommodityList: carCommodityList,
      totalMoney: parseInt(this.data.totalMoney + item.price)
    });
  },
  toSettlement: function () {
    wx.setStorageSync("items", this.data.carCommodityList);
    wx.navigateBack({});
  },
  hideMovingCar: function () {
    this.setData({
      ifShowcommodityCar: 0
    })
  },
  focusInput: function () {
    this.setData({
      focusInput: 1
    })
  },
  touchStart: function (e) {
    var obj = this.data.touchObj;
    obj.sy = e.touches[0].pageY;
    this.setData({
      touchObj: obj
    });

  },
  touchMove: function (e) {
    var obj = this.data.touchObj;
    if (e.changedTouches[0].pageY <= this.data.touchObj.sy) { // 上滑,隐藏搜索
      if (this.data.direction == -1) { // 状态为上滑
        return;
      }
      this.setData({
        direction: -1
      })
    } else {
      if (this.data.direction == 1) { // 状态为上滑
        return;
      }
      this.setData({
        direction: 1
      });
    }


  }
});