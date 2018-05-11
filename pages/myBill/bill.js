var util = require('../../utils/request.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: [],
    pageNumber: 1,
    pageSize: 10,
    hasMoreData: true
  },
  bill: function () {
    var that = this;
    var order = that.data.order;
    var pageNumber = that.data.pageNumber;
    var pageSize = that.data.pageSize;
    util.req("/member/deposit", { "memberId": app.globalData.userInfo.memberId, "pageNumber": pageNumber, "pageSize": pageSize }, function (res) {
      console.log(res);
      if (res.resultCode == 200) {
        if (pageNumber == 1) {
          // order = parseFloat(res.resultContent);
          that.setData({
            order: res.resultContent
          })
        } else {
          order = order.concat(res.resultContent);
          that.setData({
            order: order
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
    wx.showLoading({
      title: '正在加载...',
    })
    this.bill();
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
    wx.showLoading({
      title: '正在刷新...',
    })
    that.setData({
      pageNumber: 1
    })
    that.bill();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (that.data.hasMoreData) {
      wx.showLoading({
        title: '正在加载...',
      })
      that.bill();
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