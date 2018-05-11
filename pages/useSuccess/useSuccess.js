Page({

  /**
   * 页面的初始数据
   */
  data: {
    electricity:"",
    charge:"",
    distance:""
  },

  returnIndex: function () {
    try {
      wx.removeStorageSync('rentSuccess');
      wx.removeStorageSync('rentDevice');
    } catch (e) {
      // Do something when catch error
    }
    wx.reLaunch({
      url: '../index/index'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    try {
      var rentSuccess = wx.getStorageSync('rentSuccess')
      if (rentSuccess) {
        console.log(rentSuccess);
        that.setData({
          electricity: rentSuccess.electricity,
          distance: rentSuccess.distance,
          charge: rentSuccess.charge
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