var util = require('../../utils/request.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: null,
    captcha: null,
    getCaptchaText: '获取验证码',
    isChecked: false
  },
  //更改手机号
  changePhone: function (e) {
    console.log(e.detail.value);
    this.setData({
      phone: e.detail.value
    })
  },
  //更改验证码
  changeCaptcha: function (e) {
    this.setData({
      captcha: e.detail.value
    })
  },
  //获取验证码
  getCaptcha: function (e) {
    console.log(e);
    var that = this;
    console.log('0');
    setTimeout(function() {
      var phone = that.data.phone;
      if (that.data.getCaptchaText == '获取验证码' && that.data.phone != null) {
        // 倒计时
        console.log(1);
        var number = 60;
        that.setData({
          getCaptchaText: number + '秒'
        })
        var timer = setInterval(function () {
          number--;
          if (number <= 0) {
            that.setData({
              getCaptchaText: '获取验证码'
            })
          } else {
            that.setData({
              getCaptchaText: number + '秒'
            })
          }
        }, 1000)
        util.req('/member/sendMsgCode', {
          phone: phone
        }, function (data) {
          console.log(data);
        })
        setTimeout(function () {
          clearInterval(timer);
        }, 61000)
      }
    }, 500)
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
      url: '../useGuide/useGuide?src=' + util.rootDocment + '/article/list/77&id=user',
    })
  },
  //提交
  submit: function () {
    var that = this;
    if(that.data.isChecked) {
      var data = {
        memberId: app.globalData.userInfo.memberId,
        phone: this.data.phone,
        massageCode: this.data.captcha
      }
      console.log(data);
      if(data.phone == null || data.phone == '') {
        wx.showToast({
          title: '请输入手机号',
          icon: 'none',
          duration: 1000
        })
      } else if(data.massageCode == null || data.massageCode == '') {
        wx.showToast({
          title: '请输入验证码',
          icon: 'none',
          duration: 1000
        })
      } else {
        util.req('/member/mobileAuthentication', data, function (res) {
          console.log(res);
          if (res.resultCode == 400) {
            wx.showToast({
              title: res.resultMsg,
              icon: 'none',
              duration: 800
            })
          } else if (res.resultCode == 200) {
            wx.showToast({
              title: res.resultMsg,
              success: function (res) {
                wx.reLaunch({
                  url: '../index/index',
                })
              }
            })
          }
        })
      }
    } else {
      wx.showToast({
        title: '请先阅读并勾选用户协议',
        icon: 'none',
        duration: 1000
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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