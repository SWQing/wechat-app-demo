var util = require('../../utils/request.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: null,
    idNumber: null,
    isChecked: false
  },
  //更改手机号
  changeName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  //更改身份证号
  changeIdNumber: function (e) {
    console.log(e.detail.value);
    this.setData({
      idNumber: e.detail.value
    })
  },
  //提交
  submit: function () {
    var that = this;
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    var data = {
      memberId: app.globalData.userInfo.memberId,
      name: this.data.name,
      identity: this.data.idNumber
    }
    console.log(data);
    if (data.name == null || data.name == '') {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none',
        duration: 1000
      })
    } else if (data.identity == null || data.identity == '') {
      wx.showToast({
        title: '请输入身份证号',
        icon: 'none',
        duration: 1000
      })
    } else if (!reg.test(that.data.idNumber)) {
      wx.showToast({
        title: '请输入正确的身份证号',
        icon: 'none',
        duration: 1000
      })
    } else {
      util.req('/member/identity', data, function (res) {
        console.log(res);
        if (res.resultCode == 400) {
          wx.showToast({
            title: res.resultMsg,
            icon: 'none',
            duration: 800
          })
        } else if (res.resultCode == 200) {
          app.globalData.userInfo.isIdentity = true;
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