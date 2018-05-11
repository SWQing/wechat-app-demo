var util = require('../../utils/request.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    myEarnings: '00.00',
    inputValue: null
  },
  toBill: function () {
    wx.navigateTo({
      url: '../netBill/bill',
    })
  },
  formSubmit: function (e) {
    console.log(e);
  },
  //判断输入的金额是否比余额多
  bindinput: function (e) {
    var that = this;
    if (e.detail.value > parseFloat(this.data.myEarnings)) {
      wx.showToast({
        title: '不能大于余额！',
        icon: 'none',
        duration: 1000,
        success: function (res) {
          that.setData({
            inputValue: null
          })
        }
      });
    } else if(e.detail.value == '.') {
      that.setData({
        inputValue: null
      })
    }
  },
  //点击全部提现
  all: function () {
    this.setData({
      inputValue: this.data.myEarnings
    })
  },
  formSubmit: function (e) {
    var that = this;
    console.log(e.detail.value.withdraw);
    if (e.detail.value.withdraw === '') {
      wx.showToast({
        title: '请输入提现金额！',
        icon: 'none',
        duration: 800
      })
    } else if (e.detail.value.withdraw == 0) {
      wx.showToast({
        title: '提现金额不能为0！',
        icon: 'none',
        duration: 800
      })
    } else {
      //获取 amount 网点 id
      wx.getStorage({
        key: 'cabinetInfo',
        success: function(res) {
          console.log(res);
          var data = {
            amount: e.detail.value.withdraw,
            cabinetId: res.data.cabinetId
          }
          util.req('/transfers/transfers', data, function (res) {
            console.log(res);
            if(res.resultCode == 200) {
              wx.showToast({
                title: res.resultMsg,
                duration: 1000
              })
              //请求成功 重新获取网点信息
              var cabinetId = app.globalData.userInfo.cabinetId;
              util.req('/cabinet/getCabinetInfo', { cabinetId: cabinetId }, function (res) {
                console.log(res);
                if (res.resultCode == 200) {
                  wx.setStorage({
                    key: 'cabinetInfo',
                    data: res.resultContent,
                  })
                  that.setData({
                    myEarnings: res.resultContent.banlance
                  })
                } else {
                  wx.showToast({
                    title: res.resultMsg,
                    icon: 'none',
                    duration: 1500
                  })
                }
              })
            } else {
              wx.showToast({
                title: res.resultMsg,
                icon: 'none',
                duration: 1500
              })
            }
            that.setData({
              inputValue: null
            })
          })
        },
      })
      
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'cabinetInfo',
      success: function (res) {
        that.setData({
          myEarnings: res.data.banlance.toFixed(2)
        })
      },
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