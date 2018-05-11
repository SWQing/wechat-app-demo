var util = require('../../utils/request.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      {
        imgUrl: '../img/netMessage/order.png',
        text: '网点订单'
      },
      {
        imgUrl: '../img/netMessage/earnings.png',
        text: '我的收益'
      }
    ],
    message: {
      imgUrl: '',
      name: '',
      address: '',
      tel: [],
      people: ''
    }
  },
  //点击列表跳转页面
  netOrders: function (e) {
    if (e.currentTarget.id == 0) {
      wx.navigateTo({
        url: '../netOrder/netOrder',
      })
    } else if(e.currentTarget.id == 1) {
      wx.navigateTo({
        url: '../myEarnings/myEarnings',
      })
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
    //跳转网点管理页面
    var cabinetId = app.globalData.userInfo.cabinetId;
    util.req('/cabinet/getCabinetInfo', { cabinetId: cabinetId }, function (res) {
      console.log(res);
      if (res.resultCode == 200) {
        wx.setStorage({
          key: 'cabinetInfo',
          data: res.resultContent,
        })
        wx.getStorage({
          key: 'cabinetInfo',
          success: function (res) {
            console.log(res);
            var imgUrl = null;
            if (res.data.headImg == '') {
              imgUrl = '../img/netMessage/netLogo.jpeg';
            } else {
              imgUrl = res.data.headImg
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
      } else {
        wx.showToast({
          title: res.resultMsg,
          icon: 'none',
          duration: 800
        })
      }
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