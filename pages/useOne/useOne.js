var util = require('../../utils/request.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    electricity: '',
    distance: '',
    chargeRule: [],
    activeNum: 0,
    message: {
      size: '',
      input: '',
      capacity: '',
      output: '',
      uid: ''
    },
    deposit:"",
    protocol: '《用户协议》：用户可在桌面随时扫码充电，需押金，让手机用不断电。放水放油结构，满足不同场景，使用进口高品质电芯，采用业内领先技术，稳定耐用，安全可靠。',
    isChecked: true
  },
  selected: function (e) {
    this.setData({
      activeNum: e.target.id
    })
  },
  //选中用户协议
  checkboxChange: function (e) {
    var that = this;
    that.setData({
      isChecked: !that.data.isChecked
    })
  },
  //查看协议
  protocol: function (e) {
    wx.navigateTo({
      url: '../useGuide/useGuide?src=' + util.rootDocment + '/article/list/77&id=rent',
    })
  },
  //点击确认租用，跳转租用成功页面
  toUseSuccess: function () {
    console.log(this.data.activeNum);
    var that = this;
    if(that.data.isChecked) {
      wx.showLoading({
        title: '正在租用...',
        mask: true
      })
      util.req("/payment/deposit", { "memberId": app.globalData.userInfo.memberId, "deposit": that.data.deposit }, function (res) {
        wx.hideLoading();
        var resultContent = res.resultContent;
        var paymentId = resultContent.paymentId;
        wx.requestPayment({
          'timeStamp': resultContent.timeStamp + "",
          'nonceStr': resultContent.nonceStr + "",
          'package': resultContent.package,
          'signType': 'MD5',
          'paySign': resultContent.sign,
          'success': function (res) {
            console.log(res);
            wx.showLoading({
              title: '正在租用...',
              mask: true
            })
            util.req("/order/rent", { "uid": that.data.message.uid, "memberId": app.globalData.userInfo.memberId, "chargeRuleId": that.data.activeNum, "paymentId": paymentId }, function (res) {
              console.log(res);
              wx.hideLoading();
              if (res.resultCode == 400) {
                wx.showToast({
                  title: res.resultMsg,
                  icon: 'none',
                  duration: 1000
                })
                setTimeout(function () {
                  wx.reLaunch({
                    url: '../index/index',
                  })
                }, 1000)
              } else if (res.resultCode == 200) {
                try {
                  wx.setStorageSync('rentSuccess', res.resultContent)
                  wx.reLaunch({
                    url: '../useSuccess/useSuccess',
                  })
                } catch (e) {
                }
              }

            });
          },
          'fail': function (res) {
            console.log(res);
          }
        })
      });
    } else {
      wx.showToast({
        title: '请先阅读并勾选租用协议',
        icon: 'none',
        duration: 1000
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    try {
      var rentDevice = wx.getStorageSync('rentDevice')
      if (rentDevice) {
        console.log(rentDevice);
        that.setData({
          electricity: rentDevice.electricity,
          distance: rentDevice.distance,
          chargeRule: rentDevice.chargeRule,
          activeNum: rentDevice.chargeRule[0].chargeId,
          message: {
            size: rentDevice.size,
            input: rentDevice.input,
            capacity: rentDevice.capacity,
            output: rentDevice.output,
            uid: rentDevice.uid
          },
          deposit: rentDevice.deposit
        })
      }
    } catch (e) {
      // Do something when catch error
    }
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