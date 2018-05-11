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
      facilityId: '',
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
        facilityId: order.sn,
        address: order.cabinet,
        orderId: order.uid
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