var util = require('./utils/request.js');
//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var that = this;
    //查看授权
    wx.getSetting({
      success: function (res) {
        //授权用户信息
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success: function () {
              console.log('授权用户信息成功！')
            }
          })
        } 
        //授权地理位置
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success: function (res) {
              console.log('授权地理位置成功！')
            }
          })
        }
      }
    })
    
  },
  globalData: {
    userInfo: null,
    canClick: true
  }
})