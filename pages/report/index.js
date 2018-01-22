// pages/report/index.js
var app = getApp()

const date = new Date()
const years = []
const months = []
const days = []

for (let i = 2017; i <= date.getFullYear(); i++) {
  years.push(i)
}

for (let i = 1; i <= 12; i++) {
  months.push(i)
}

for (let i = 1; i <= 31; i++) {
  days.push(i)
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    years: years,
    year: date.getFullYear(),
    months: months,
    month1: date.getMonth() + 1,
    month2: date.getMonth() + 1,
    days: days,
    day1: 1,
    day2: date.getDate(),
    year1: date.getFullYear(),
    year2: date.getFullYear(),
    value: [9999, 1, 1],
    dateValue1: [9999, date.getMonth(), 0],
    dateValue2: [9999, date.getMonth(), date.getDate() - 1],
    showModalStatus: false,
    dateType: 'startDate'
  },
  bindChange: function (e) {
    const val = e.detail.value;
    if (this.data.dateType == 'startDate') {
      this.data.dateValue1 = val;
      this.setData({
        year1: this.data.years[val[0]],
        month1: this.data.months[val[1]],
        day1: this.data.days[val[2]]
      })
    } else {
      this.data.dateValue2 = val;
      this.setData({
        year2: this.data.years[val[0]],
        month2: this.data.months[val[1]],
        day2: this.data.days[val[2]]
      })
    }
    
  },
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    if(currentStatu == 'close'){
      //刷新数据
      this.onLoad();
    }
    this.util(currentStatu)
  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200, //动画时长 
      timingFunction: "linear", //线性 
      delay: 0 //0则不延迟 
    });

    // 第2步：这个动画实例赋给当前的动画实例 
    this.animation = animation;

    // 第3步：执行第一组动画：Y轴偏移240px后(盒子高度是240px)，停 
    animation.translateY(240).step();

    // 第4步：导出动画对象赋给数据对象储存 
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画 
    setTimeout(function () {
      // 执行第二组动画：Y轴不偏移，停 
      animation.translateY(0).step()
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
      this.setData({
        animationData: animation
      })

      //关闭抽屉 
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示抽屉 
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  },
  tapDate: function (e) {
    var date = e.currentTarget.dataset.date;
    this.data.dateType = date;
    if (this.data.dateType == 'startDate') {
      this.setData({
        value: this.data.dateValue1
      })
    } else {
      this.setData({
        value: this.data.dateValue2
      })
    }
    this.util('open');
  },
  tabTitle: function(e){
    console.log(e.currentTarget.dataset.idx);
    console.log(this.data.reportList[e.currentTarget.dataset.idx].class);
    if(this.data.reportList[e.currentTarget.dataset.idx].class == 'hidden'){
      this.data.reportList[e.currentTarget.dataset.idx].class = ''
    }else{
      this.data.reportList[e.currentTarget.dataset.idx].class = 'hidden'
    }
    this.setData({ reportList: this.data.reportList});
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '正在获取数据...',
    });
    
    
    wx.request({
      url: app.globalData.domain + '/api/ZhengheRx/report',
      data: {
        id: app.globalData.id,
        startDate: [this.data.year1, this.data.month1, this.data.day1].map(formatNumber).join('-'),
        endDate: [this.data.year2, this.data.month2, this.data.day2].map(formatNumber).join('-')
      },
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
          that.setData({
            reportList: data.resultData
          });
        } else {
          this.setData({
            reportList: []
          });
        }
      }
    })
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