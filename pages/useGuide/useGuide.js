Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    if(options.id == 'useGuide') {
      wx.setNavigationBarTitle({ 
        title: '使用指南' 
      })
    } else if (options.id == 'about') {
      wx.setNavigationBarTitle({ 
        title: '关于我们' 
      })
    } else if(options.id == 'rent') {
      wx.setNavigationBarTitle({
        title: '租用协议',
      })
    } else if(options.id == 'user') {
      wx.setNavigationBarTitle({
        title: '用户协议',
      })
    }
    this.setData({
      src: options.src
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