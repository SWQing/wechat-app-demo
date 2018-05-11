var util = require('../../utils/request.js');
var app = getApp();
var click = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    money: '0.00',
    discount: '0.00',
    userInfo: {
      avatar: '',
      name: '------'
    },
    items: [{
      imgUrl: '../img/myCenter/1.png',
      text: '我的订单'
    }, {
      imgUrl: '../img/myCenter/2.png',
      text: '使用指南'
    }, {
      imgUrl: '../img/myCenter/3.png',
      text: '我的消息'
    }, {
      imgUrl: '../img/myCenter/4.png',
      text: '关于我们'
    }, {
      imgUrl: '../img/myCenter/5.png',
      text: '客服中心'
    }],
    onload: false
  },
  //点击列表跳转对应页面
  jump: function (e) {
    console.log(e);
    if (e.currentTarget.id == 0) {
      //跳转我的订单页面
      wx.navigateTo({
        url: '../myOrder/myOrder',
      })
    } else if (e.currentTarget.id == 1) {
      wx.navigateTo({
        url: '../useGuide/useGuide?src=' + util.rootDocment + '/article/list/75&id=useGuide',
      })
    } else if (e.currentTarget.id == 3) {
      wx.navigateTo({
        url: '../useGuide/useGuide?src=' + util.rootDocment + '/article/list/76&id=about',
      })
    } else if (e.currentTarget.id == 5) {
      wx.navigateTo({
        url: '../netMessage_my/netMessage',
      })
    }
  },
  //点击余额跳转充值页面
  toPay: click.throttle(function (e) {
    var that = this;
    util.req("/rechargeAllocation/list", {}, function (res) {
      console.log(res);
      if (res.resultCode == 200) {
        wx.setStorageSync('pay', res.resultContent);
        wx.navigateTo({
          url: '../pay/pay',
        })
      } else {
        wx.showToast({
          title: res.resultMsg,
          icon: 'none',
          duration: 800
        })
      }
    });
  }, 1500),
  //获取信息
  getInfo: function () {
    var that = this;
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        console.log(res);
        if (res.data.isCabinet) {
          var items = [{
            imgUrl: '../img/myCenter/1.png',
            text: '我的订单'
          }, {
            imgUrl: '../img/myCenter/2.png',
            text: '使用指南'
          }, {
            imgUrl: '../img/myCenter/3.png',
            text: '我的消息'
          }, {
            imgUrl: '../img/myCenter/4.png',
            text: '关于我们'
          }, {
            imgUrl: '../img/myCenter/5.png',
            text: '客服中心'
          }, {
            imgUrl: '../img/myCenter/6.png',
            text: '网点管理'
          }]
          that.setData({
            userInfo: {
              name: res.data.nickName,
              avatar: res.data.headImg
            },
            money: res.data.balance.toFixed(2),
            discount: res.data.gold.toFixed(2),
            items: items
          })
        } else if (!res.data.isCabinet) {
          that.setData({
            userInfo: {
              name: res.data.nickName,
              avatar: res.data.headImg
            },
            money: res.data.balance,
            discount: res.data.gold
          })
        }
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      onload: true
    })
    this.getInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
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
        that.getInfo();
      } else {
        wx.showToast({
          title: message.resultMsg,
          icon: 'none',
          duration: 800
        })
      }

    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(!this.data.onload) {
      this.getInfo();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      onload: false
    })
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