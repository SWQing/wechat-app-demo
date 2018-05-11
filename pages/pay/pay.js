var util = require('../../utils/request.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    money: '----',
    resultContent: [],
    activeNum: '',
    rechargeId: ''
  },
  //跳转明细
  detail: function () {
    wx.navigateTo({
      url: '../myBill/bill',
    })
  },
  // 选择充值金额
  choosePayNum: function (e) {
    this.setData({
      activeNum: e.target.id,
      rechargeId: e.target.dataset.id
    })
  },
  // 支付
  pay: function (e) {
    var that = this;
    var data = { "memberId": app.globalData.userInfo.memberId, "rechargeAllocationId": that.data.rechargeId }
    console.log()
    util.req("/payment/recharge", data , function (res) {
      console.log(res);
      if (res.resultCode == 200) {
        var resultContent = res.resultContent;
        wx.requestPayment({
          'timeStamp': resultContent.timeStamp + "",
          'nonceStr': resultContent.nonceStr + "",
          'package': resultContent.package,
          'signType': 'MD5',
          'paySign': resultContent.sign,
          'success': function (res) {
            console.log(res);
            util.req("/member/detail", { memberId: app.globalData.memberId }, function (message) {
              console.log(message);
              if (message.resultCode == 200) {
                app.globalData.userInfo = message.resultContent;
                // 保存用户信息到缓存
                wx.setStorage({
                  key: 'userInfo',
                  data: app.globalData.userInfo,
                  success: function (res) {
                    console.log(res);
                  }
                })
                that.setData({
                  money: app.globalData.userInfo.balance
                })
              } else {
                wx.showToast({
                  title: message.resultMsg,
                  icon: 'none',
                  duration: 800
                })
              }

            });
          },
          'fail': function (res) {
            console.log(res);
          }
        })
      } else {
        wx.showToast({
          title: res.resultMsg,
          icon: 'none',
          duration: 800
        })
      }

    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var resultContent = wx.getStorageSync('pay');
    console.log(resultContent);
    that.setData({
      resultContent: resultContent,
      activeNum: resultContent.length - 1,
      rechargeId: resultContent[resultContent.length - 1].id,
      money: app.globalData.userInfo.balance
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