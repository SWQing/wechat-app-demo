var util = require('../../utils/request.js');
var app = getApp();
var click = require('../../utils/util.js');

var date = new Date()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    selected: [true, false, false],
    unActive: [],
    unReturn: [],
    used: [],
    pageNumber: 1,
    pageSize: 5,
    hasMoreData:true,
    date: '本月',
    month: '本月',
    income: 0,
    orderNum: 0,
    end: null
  },
  // tab 切换 未激活
  tabSelected1: function (e) {
    this.setData({
      selected: [true, false, false],
      pageNumber: 1,
      pageSize: 5,
      hasMoreData: true
    })
    wx.showLoading({
      title: '正在加载...',
    })
    this.unActive();
  },
  // tab 切换 未归还
  tabSelected2: function (e) {
    this.setData({
      selected: [false, true, false],
      pageNumber: 1,
      pageSize: 5,
      hasMoreData: true
    })
    wx.showLoading({
      title: '正在加载...',
    })
    this.unReturn();
  },
  // tab 切换 已完成
  tabSelected3: function (e) {
    this.setData({
      selected: [false, false, true],
      pageNumber: 1,
      pageSize: 5,
      hasMoreData: true
    })
    wx.showLoading({
      title: '正在加载...',
    })
    this.used();
  },
  //选择时间
  bindDateChange: function (e) {
    var that = this;
    var selected = this.data.selected;
    var date = e.detail.value;
    var month = date.replace('-', '');
    this.setData({
      date: date,
      month: month,
      pageNumber: 1
    })
    wx.showLoading({
      title: '正在加载...',
    })
    this.income();
    selected.forEach(function (item, index) {
      if (item == true) {
        if (index == 0) {
          that.unActive();
        } else if (index == 1) {
          that.unReturn();
        } else if (index == 2) {
          that.used();
        }
      }
    })
  },
  //点击去激活，跳转激活页面
  toActive: click.throttle(function (e) {
    var sn = e.currentTarget.id;
    console.log(sn);
    wx.showLoading({
      title: '正在获取信息...',
      mask: true
    })
    util.req('/order/detail', {
      sn: sn
    }, function (res) {
      console.log(res);
      wx.hideLoading();
      if (res.resultCode == 200) {
        wx.setStorageSync('order', res.resultContent);
        wx.navigateTo({
          url: '../orderDetail_inactive/orderDetail_inactive',
        })
      } else {
        wx.showToast({
          title: res.resultMsg,
          icon: 'none',
          duration: 800
        })
      }
    })
  }, 1000),
  //点击确认归还，跳转归还页面
  toReturn: click.throttle(function (e) {
    var sn = e.currentTarget.id;
    console.log(sn);
    wx.showLoading({
      title: '正在获取信息...',
      mask: true
    })
    util.req('/order/detail', {
      sn: sn
    }, function (res) {
      console.log(res);
      wx.hideLoading();
      if (res.resultCode == 200) {
        wx.setStorageSync('order', res.resultContent);
        wx.navigateTo({
          url: '../orderDetail_return/orderDetail_return',
        })
      } else {
        wx.showToast({
          title: res.resultMsg,
          icon: 'none',
          duration: 800
        })
      }
    })

  }, 1000),
  //点击已完成的订单，跳转已完成页面
  toFinish: click.throttle(function (e) {
    var sn = e.currentTarget.id;
    console.log(sn);
    wx.showLoading({
      title: '正在获取信息...',
      mask: true
    })
    util.req('/order/detail', {
      sn: sn
    }, function (res) {
      wx.hideLoading();
      console.log(res);
      if (res.resultCode == 200) {
        wx.setStorageSync('order', res.resultContent);
        wx.navigateTo({
          url: '../orderDetail_finished/orderDetail_finished',
        })
      }
    })

  }, 1000),
  //获取未激活订单列表
  unActive: function () {
    var that = this;
    var unActive = that.data.unActive;
    var pageNumber = that.data.pageNumber;
    var pageSize = that.data.pageSize;
    var month = that.data.month;
    if (month == '本月') {
      var data = { 
        "cabinetId": app.globalData.userInfo.cabinetId, 
        "type": 'using', 
        "isActive": false, 
        "pageNumber": pageNumber, 
        "pageSize": pageSize
      }
    } else {
      var data = {
        "cabinetId": app.globalData.userInfo.cabinetId,
        "type": 'using',
        "isActive": false,
        "pageNumber": pageNumber,
        "pageSize": pageSize,
        "month": month
      }
    }
    util.req("/order/cabinetlist", data , function (res) {
      console.log(res);
      if (res.resultCode == 200) {
        if (pageNumber == 1){
          that.setData({
            unActive: res.resultContent
          })
        } else {
          unActive = unActive.concat(res.resultContent)
          console.log(unActive);
          that.setData({
            unActive: unActive
          })
        }
        if (res.resultContent.length < pageSize){
          that.setData({
            hasMoreData:false
          })
        }else{
          that.setData({
            hasMoreData: true,
            pageNumber:pageNumber + 1
          })
        }
      } else {
        wx.showToast({
          title: res.resultMessage,
          icon: 'none',
          duration: 800
        })
      }
      wx.stopPullDownRefresh();
      wx.hideLoading();
    });
  },
  //获取未归还订单列表
  unReturn: function () {
    var that = this;
    var unReturn = that.data.unReturn;
    var pageNumber = that.data.pageNumber;
    var pageSize = that.data.pageSize;
    var month = that.data.month;
    if (month == '本月') {
      var data = {
        "cabinetId": app.globalData.userInfo.cabinetId,
        "type": 'using',
        "isActive": true,
        "pageNumber": pageNumber,
        "pageSize": pageSize
      }
    } else {
      var data = {
        "cabinetId": app.globalData.userInfo.cabinetId,
        "type": 'using',
        "isActive": true,
        "pageNumber": pageNumber,
        "pageSize": pageSize,
        "month": month
      }
    }
    util.req("/order/cabinetlist", data, function (res) {
      console.log(res);
      if (res.resultCode == 200) {
        if (pageNumber == 1) {
          that.setData({
            unReturn: res.resultContent
          })
        } else {
          unReturn = unReturn.concat(res.resultContent)
          that.setData({
            unReturn: unReturn
          })
        }
        if (res.resultContent.length < pageSize) {
          that.setData({
            hasMoreData: false
          })
        } else {
          that.setData({
            hasMoreData: true,
            pageNumber: pageNumber + 1
          })
        }
      } else {
        wx.showToast({
          title: res.resultMessage,
          icon: 'none',
          duration: 800
        })
      }
      wx.stopPullDownRefresh();
      wx.hideLoading();
    });
  },
  //获取已完成订单列表
  used: function () {
    var that = this;
    var used = that.data.used;
    var pageNumber = that.data.pageNumber;
    var pageSize = that.data.pageSize;
    var month = that.data.month;
    if (month == '本月') {
      var data = {
        "cabinetId": app.globalData.userInfo.cabinetId,
        "type": 'success',
        "isActive": true,
        "pageNumber": pageNumber,
        "pageSize": pageSize
      }
    } else {
      var data = {
        "cabinetId": app.globalData.userInfo.cabinetId,
        "type": 'success',
        "isActive": true,
        "pageNumber": pageNumber,
        "pageSize": pageSize,
        "month": month
      }
    }
    util.req("/order/cabinetlist", data, function (res) {
      console.log(res);
      if (res.resultCode == 200) {
        if (pageNumber == 1) {
          that.setData({
            used: res.resultContent
          })
        } else {
          used = used.concat(res.resultContent)
          that.setData({
            used: used
          })
        }
        if (res.resultContent.length < pageSize) {
          that.setData({
            hasMoreData: false
          })
        } else {
          that.setData({
            hasMoreData: true,
            pageNumber: pageNumber + 1
          })
        }
      } else {
        wx.showToast({
          title: res.resultMessage,
          icon: 'none',
          duration: 800
        })
      }
      wx.stopPullDownRefresh();
      wx.hideLoading();
    });
  },
  //获取总收入
  income: function () {
    console.log(1);
    var that = this;
    if (that.data.month == '本月') {
      var data = {
        cabinetId: app.globalData.userInfo.cabinetId
      }
    } else {
      var data = {
        cabinetId: app.globalData.userInfo.cabinetId,
        month: that.data.month
      }
    }
    util.req('/cabinet/income', data, function (res) {
      console.log(res);
      if(res.resultCode == 200) {
        var amount = 0;
        if(res.resultContent.amount != null) {
          amount = res.resultContent.amount;
        }
        that.setData({
          income: amount.toFixed(2),
          orderNum: res.resultContent.num
        })
      } else {
        wx.showToast({
          title: res.resultMsg,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var time = new Date();
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    var end = year + '-' + month;
    console.log(end);
    this.setData({
      end: end
    })
    wx.showLoading({
      title: '正在加载...',
    })
    this.income();
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
    var that = this;
    if(this.data.selected[0]) {
      this.unActive();
    } else if (this.data.selected[1]) {
      this.unReturn();
    } else if (this.data.selected[2]) {
      this.used();
    }
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
    var that = this;
    var selected = this.data.selected;
    wx.showLoading({
      title: '正在刷新...',
    })
    that.setData({
      pageNumber: 1
    })
    selected.forEach(function (item, index) {
      if(item == true) {
        if(index == 0){
          that.unActive();
        }else if(index == 1){
          that.unReturn();
        }else if(index == 2){
          that.used();
        }
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    var selected = this.data.selected;
    if(that.data.hasMoreData){
      wx.showLoading({
        title: '正在加载...',
      })
      selected.forEach(function (item, index) {
        if (item == true) {
          if (index == 0) {
            that.unActive();
          } else if (index == 1) {
            that.unReturn();
          } else if (index == 2) {
            that.used();
          }
        }
      })
    }else{
      wx.showToast({
        title: '没有更多数据!',
        icon: 'none',
        duration: 800
      })
    }
    
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})