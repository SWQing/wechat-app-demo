Page({

  /**
   * 页面的初始数据
   */
  data: {
    message: {
      imgUrl: '',
      name: '',
      address: '',
      tel: [],
      people: ''
    }
  },
  //点击电话图标拨打电话
  callPhone: function (e) {
    var tel = e.currentTarget.id;
    wx.makePhoneCall({
      phoneNumber: tel,
    })
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
    var that = this;
    wx.getStorage({
      key: 'cabinetInfo',
      success: function(res) {
        console.log(res);
        var imgUrl = null;
        if(res.data.headImg == '') {
          imgUrl = '../img/index/3.jpg';
        } else {
          imgUrl = res.data.headImg;
        }
        var tel = res.data.adminPhone;
        tel = tel.split(',');
        console.log(tel);
        that.setData({
          message: {
            imgUrl: imgUrl,
            name: res.data.cabinetName,
            address: res.data.cabinetAddress,
            tel: tel,
            people: res.data.adminName
          }
        })
      },
    })
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