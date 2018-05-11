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
      orderId: null,
      time: '',
      facilityId: '',
      address: '',
      aa: ''
    },
    isActive: false,
    stop: false,
    isLock: false,
    buttonText: '停止放电'
  },
  //申报故障
  // fault: function () {
  //   wx.navigateTo({
  //     url: '../repairs/repairs?peopleType=member&sn=' + this.data.orderMessage.orderId,
  //   })
  // },
  //停止/放电
  stop: function (e) {
    var that = this;
    var url = null;
    var buttonText = that.data.buttonText;
    if(e.currentTarget.id == 'isStop') {
      url = '/device/open';
      buttonText = '停止放电';
    } else if(e.currentTarget.id == 'isBegin') {
      url = '/device/close';
      buttonText = '开始放电';
    }
    wx.showLoading({
      title: '请稍等...',
      mask: true
    })
    util.req(url, { uid: that.data.orderMessage.facilityId }, function (res) {
      wx.hideLoading();
      console.log(res);
      if(res.resultCode == 200) {
        that.setData({
          stop: !that.data.stop,
          buttonText: buttonText
        })
        wx.showToast({
          title: res.resultMsg
        })
      } else {
        wx.showToast({
          title: res.resultMsg,
          icon: 'none'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var order = wx.getStorageSync('order');
    console.log(order.deviceStatus);
    if (order.deviceStatus == 'discharging') {
      this.setData({
        stop: false,
        buttonText: '停止放电'
      })
    } else if(order.deviceStatus == 'normal') {
      this.setData({
        stop: true,
        buttonText: '开始放电'
      })
    } else {
      this.setData({
        stop: true,
        isLock: true,
        buttonText: '开始放电'
      })
    }
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
        orderId: order.sn,
        time: order.rentDate,
        facilityId: order.uid,
        address: order.cabinet
      },
      isActive: order.isActive
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