var util = require('../../utils/request.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    startTime: {
      day: '',
      hour: ''
    },
    endTime: {
      day: '',
      hour: ''
    },
    order: {
      sn: '',
      address: '',
      orderId: null
    },
    account: {
      useTime: '',
      payTime: '',
      payRule: ''
    },
    totalPrice: null
  },
  // fault: function () {
  //   wx.navigateTo({
  //     url: '../repairs/repairs?peopleType=cabinet&sn=' + this.data.order.sn,
  //   })
  // },
  return: function () {
    var that = this;
    var sn = that.data.order.sn;
    var cabinetId = app.globalData.userInfo.cabinetId
    wx.showLoading({
      title: '正在归还...',
      mask: true
    })
    util.req('/order/revert', {
      sn: sn,
      cabinetId: cabinetId
    }, function (res) {
      console.log(res);
      wx.hideLoading();
      if (res.resultCode == 200) {
        wx.showToast({
          title: res.resultMsg,
          icon: 'none',
          duration: 2000
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
      } else {
        wx.showToast({
          title: res.resultMsg,
          icon: 'none',
          duration: 800
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var order = wx.getStorageSync('order');
    console.log(order);
    this.setData({
      startTime: {
        day: order.activeDate,
        hour: order.activeTime
      },
      endTime: {
        day: order.revertDate,
        hour: order.revertTime
      },
      order: {
        sn: order.sn,
        address: order.cabinet,
        uid: order.uid
      },
      account: {
        useTime: order.useTime,
        payTime: order.chargeTime,
        payRule: order.charge
      },
      totalPrice: order.amount
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