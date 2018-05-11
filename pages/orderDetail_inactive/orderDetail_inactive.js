var util = require('../../utils/request.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    electricity: '',
    charge: '',
    facilityInfo: {
      size: '',
      input: '',
      capacity: '',
      output: ''
    },
    orderMessage: {
      sn: null,
      time: '',
      facilityId: '',
      address: ''
    }
  },
  // fault: function () {
  //   wx.navigateTo({
  //     url: '../repairs/repairs?peopleType=cabinet&sn=' + this.data.orderMessage.sn,
  //   })
  // },
  active:function(){
    var that = this;
    var sn = that.data.orderMessage.sn;
    var cabinetId = app.globalData.userInfo.cabinetId;
    wx.showLoading({
      title: '正在激活...',
      mask: true
    })
    util.req('/order/active', {
      sn: sn,
      cabinetId : cabinetId
    }, function (res) {
      console.log(res);
      wx.hideLoading();
      if (res.resultCode == 200) {
        wx.showToast({
          title: res.resultMsg,
          duration: 500
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 500)
      }else{
        wx.showToast({
          title: res.resultMsg,
          icon:'none',
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
      electricity: order.electricity,
      distance: order.distance,
      facilityInfo: {
        size: order.size,
        input: order.input,
        capacity: order.capacity,
        output: order.output
      },
      orderMessage: {
        sn: order.sn,
        time: order.rentDate,
        facilityId: order.uid,
        address: order.cabinet
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