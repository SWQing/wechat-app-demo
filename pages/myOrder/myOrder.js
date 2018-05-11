var util = require('../../utils/request.js');
var app = getApp();
var click = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    selected: [true, false],
    using: [],
    used: [],
    pageNumber: 1,
    pageSize: 5,
    hasMoreData: true
  },
  // tab 切换 正在使用
  tabSelected1: function (e) {
    this.setData({
      selected: [true, false],
      pageNumber: 1,
      pageSize: 5,
      hasMoreData: true
    })
    wx.showLoading({
      title: '正在加载...',
    })
    this.using();
  },
  // tab 切换 已完成
  tabSelected2: function (e) {
    this.setData({
      selected: [false, true],
      pageNumber: 1,
      pageSize: 5,
      hasMoreData: true
    })
    wx.showLoading({
      title: '正在加载...',
    })
    this.used();
  },
  //点击正在使用的列表跳转正在使用页面
  toUsing: click.throttle(function (e) {
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
          url: '../orderDetail_using/orderDetail_using',
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
  //点击已完成的列表跳转已完成页面
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
      } else {
        wx.showToast({
          title: res.resultMsg,
          icon: 'none',
          duration: 800
        })
      }
    })
  }, 1000),
  //获取正在使用的订单列表
  using: function () {
    var that = this;
    var using = that.data.using;
    var pageNumber = that.data.pageNumber;
    var pageSize = that.data.pageSize;
    util.req("/order/memberlist", { "memberId": app.globalData.userInfo.memberId, "type": 'using', "pageNumber": pageNumber, "pageSize": pageSize }, function (res) {
      console.log(res);
      if (res.resultCode == 200) {
        if(pageNumber == 1) {
          that.setData({
            using: res.resultContent
          })
        } else {
          using = using.concat(res.resultContent)
          that.setData({
            using: using
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
  //获取已完成的订单列表
  used: function () {
    var that = this;
    var used = that.data.used;
    var pageNumber = that.data.pageNumber;
    var pageSize = that.data.pageSize;
    util.req("/order/memberlist", { "memberId": app.globalData.userInfo.memberId, "type": 'success', "pageNumber": pageNumber, "pageSize": pageSize }, function (res) {
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '正在加载...',
    })
    this.using();
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
    var that = this;
    var selected = this.data.selected;
    wx.showLoading({
      title: '正在刷新...',
    })
    that.setData({
      pageNumber: 1
    })
    selected.forEach(function (item, index) {
      if (item == true) {
        if (index == 0) {
          that.using();
        } else if (index == 1) {
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
    if (that.data.hasMoreData) {
      wx.showLoading({
        title: '正在加载...',
      })
      selected.forEach(function (item, index) {
        if (item == true) {
          if (index == 0) {
            that.using();
          } else if (index == 1) {
            that.used();
          }
        }
      })
    } else {
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