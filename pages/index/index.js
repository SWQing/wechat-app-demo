var util = require('../../utils/request.js');
var app = getApp();
var click = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userAvatar: '../img/index/avatar@2x.png',
    selected: [true, false],
    mapCtx: '',
    location: '',//当前位置
    markers: [],
    message: [],
    sn: [],
    activeMessage: {},
    showMessage: false,//网点信息框
    showParclose: false,//模态框后的屏障
    showModelErr: false,//错误信息模态框
    requestType: null
  },
  // tab 切换 站点
  tabSelected1: function (e){
    var that = this;
    wx.showLoading({
      title: '正在加载...',
      mask: true
    })
    this.getSite();
    this.setData({
      selected: [true, false],
      requestType: 'tab'
    })
  },
  // tab 切换 电池
  tabSelected2: function (e) {
    var that = this;
    wx.showLoading({
      title: '正在加载...',
      mask: true
    })
    this.getBattery();
    this.setData({
      showMessage: false,
      selected: [false, true]
    })
  },
  // 点击控件 定位、跳转故障报修页面、打开扫一扫
  controltap: click.throttle(function (e) {
    var that = this;
    if (e.controlId == 0) {
      this.mapCtx.moveToLocation();
    } else if (e.controlId == 1) {
      wx.navigateTo({
        url: '../repairs/repairs'
      })
    } else if (e.controlId == 2) {
      //判断有没有绑定手机号
      if (!app.globalData.userInfo.isPhone) {
        wx.navigateTo({
          url: '../bindPhone/bindPhone'
        })
      } else if (app.globalData.userInfo.isIdentity) {
        // 判断用户有没有实名认证
        wx.scanCode({
          success: function (res) {
            console.log(res);
            util.req("/device/getDeviceInfo", { "uid": res.result, "memberId": app.globalData.userInfo.memberId }, function (res) {
              console.log(res);
              if (res.resultCode == 400) {
                wx.showToast({
                  title: res.resultMsg,
                  icon: 'none',
                  duration: 2000
                })
              } else {
                if (res.resultContent.deviceStatus == "trouble") {
                  that.setData({
                    showParclose: true,
                    showModelErr: true
                  })
                } else {
                  try {
                    wx.setStorageSync('rentDevice', res.resultContent)
                    //扫描成功，跳转租用页面
                    wx.navigateTo({
                      url: '../useOne/useOne',
                    })
                  } catch (e) {
                  }
                }
              }
            });  
          }
        })
      } else {
        //未认证
        wx.navigateTo({
          url: '../bindIdentity/bindIdentity'
        })
      }
    }
  }, 1000),
  //关闭模态框
  closeModel: function (e) {
    this.setData({
      showParclose: false,
      showModelErr: false
    })
  },
  //点击标记点 变大变小 显示信息框
  markertap: function (e) {
    var width = "markers[" + e.markerId + "].width";
    var height = "markers[" + e.markerId + "].height";
    //如果是小的，变大
    if (this.data.markers[e.markerId].width <= 44 && this.data.selected[0] == true) {
      var activeMessage = {
        name: this.data.message[e.markerId].name,
        avatar: this.data.message[e.markerId].avatar,
        time: this.data.message[e.markerId].time,
        address: this.data.message[e.markerId].address,
        cabinetId: this.data.message[e.markerId].cabinetId
      }
      this.setData({
        activeMessage: activeMessage,
        showMessage: true,
        [width]: 66,
        [height]: 70
        
      })
      var that = this;
      this.data.markers.forEach(function (item) {
        //其它的变小
        if(item.id != e.markerId) {
          var itemWidth = "markers[" + item.id + "].width";
          var itemHeight = "markers[" + item.id + "].height";
          that.setData({
            [itemWidth]: 44,
            [itemHeight]: 47
          })
        }
      })
    } 
    else if (this.data.markers[e.markerId].width > 44 && this.data.selected[0] == true) {
      this.setData({
        showMessage: false,
        [width]: 44,
        [height]: 47
      })
    } else if(this.data.selected[1]) {
      util.req('/order/detail', { sn: this.data.sn[e.markerId]}, function (res) {
        if (res.resultCode == 200) {
          wx.setStorageSync('order', res.resultContent);
          wx.navigateTo({
            url: '../orderDetail_using/orderDetail_using',
          })
        } else {
          wx.showToast({
            title: res.resultMsg,
            icon: 'none',
            duration: 800
          })
        }
      })
    }
  },
  //地图视野变化时 获取周围站点/电池
  regionchange: function (e) {
    var that = this;
    this.setData({
      showMessage: false
    })
    if (e.type == 'end' && that.data.selected[0] == true) {
      that.getSite();
    } else if (e.type == 'end' && that.data.selected[1] == true) {
      that.getBattery();
    }
  },
  //点击头像，跳转用户中心
  userCenter: click.throttle(function (e) {
    wx.navigateTo({
      url: '../myCenter/myCenter',
    })
  }, 1000),
  //点击网点信息框，跳转网点主页
  details: click.throttle(function (e) {
    console.log(e);
    var cabinetId = e.currentTarget.id;
    util.req('/cabinet/getCabinetInfo', {cabinetId: cabinetId}, function (res) {
      wx.setStorage({
        key: 'cabinetInfo',
        data: res.resultContent,
      })
      wx.navigateTo({
        url: '../netMessage/netMessage',
      })
    })
  }, 1000),
  //获取周边站点
  getSite: function () {
    var that = this;
    this.mapCtx.getCenterLocation({
      success: function (res) {
        var data = {
          latitude: res.latitude,
          longitude: res.longitude
        }
        util.req('/cabinet/aroundSiteCabinet', data, function (res) {
          console.log(res);
          if(res.resultCode == 200) {
            var markers = [];
            var markerInfo = [];
            var oneMarker = {};
            var oneMarkerInfo = {};
            var resultContent = res.resultContent;
            resultContent.forEach(function (item, index) {
              oneMarker = {
                id: index,
                latitude: item.lat,
                longitude: item.lng,
                iconPath: '../img/index/site_position@2x.png',
                width: 44,
                height: 47
              }
              markers.push(oneMarker);
              if(item.headImg == '') {
                oneMarkerInfo = {
                  name: item.cabinetName,
                  avatar: '../img/index/3.jpg',
                  time: item.startTime + '~' + item.endTime,
                  address: item.cabinetAddress,
                  cabinetId: item.cabinetId
                }
              } else {
                oneMarkerInfo = {
                  name: item.cabinetName,
                  avatar: item.headImg,
                  time: item.startTime + '~' + item.endTime,
                  address: item.cabinetAddress,
                  cabinetId: item.cabinetId
                }
              }
              
              markerInfo.push(oneMarkerInfo);
            })
            that.setData({
              markers: markers,
              message: markerInfo
            })
          } else {
            wx.showToast({
              title: res.resultMsg,
              icon: 'none',
              duration: 800
            })
          }
          if(that.data.requestType == 'tab') {
            wx.hideLoading();
          }
        }) 
      }
    })
  },
  //获取周边电池
  getBattery: function () {
    var that = this;
    this.mapCtx.getCenterLocation({
      success: function (res) {
        var data = {
          latitude: res.latitude,
          longitude: res.longitude,
          memberId: app.globalData.userInfo.memberId
        }
        util.req('/device/aroundSiteDevice', data, function (res) {
          console.log(res);
          if(res.resultCode == 200) {
            var markers = [];
            var oneMarker = {};
            var resultContent = res.resultContent;
            var sn = [];
            resultContent.forEach(function (item, index) {
              oneMarker = {
                id: index,
                latitude: item.lat,
                longitude: item.lng,
                iconPath: '../img/index/battery_position@2x.png',
                width: 44,
                height: 47
              }
              markers.push(oneMarker);
              sn.push(item.sn);
              console.log(sn);
            })
            that.setData({
              markers: markers,
              sn: sn
            })
          } else {
            wx.showToast({
              title: res.resultMsg,
              icon: 'none',
              duration: 800
            })
          }
          wx.hideLoading();
        })
      }
    })
  },
  //登录、判断有没有绑定手机号
  userLogin: function () {
    var that = this;
    //判断是否登录
    if (app.globalData.userInfo == null) {
      wx.login({
        success: function (res) {
          if (res.code) {
            var code = res.code;
            wx.getUserInfo({
              success: function (user) {
                // 获取 memberId
                util.req("/common/login", { "encryptedData": user.encryptedData, "iv": user.iv, "code": code }, function (r) {
                  console.log(r);
                  
                  if (r.status == 200) {
                    //保存 memberId
                    app.globalData.memberId = r.memberId;
                    // 判断用户手机号有没有验证
                    util.req("/member/detail", { memberId: r.memberId }, function (message) {
                      console.log(message);
                      if (message.resultCode == 200) {
                        wx.hideLoading();
                        that.setData({
                          showParclose: false
                        })
                        app.globalData.userInfo = message.resultContent;
                        //更改头像
                        that.setData({
                          userAvatar: app.globalData.userInfo.headImg
                        })
                        if (!app.globalData.userInfo.isPhone) {
                          wx.navigateTo({
                            url: '../bindPhone/bindPhone',
                          })
                        } else {
                          // 保存用户信息到缓存
                          wx.setStorage({
                            key: 'userInfo',
                            data: app.globalData.userInfo,
                            success: function (res) {
                              console.log(res);
                            }
                          })
                          wx.hideLoading();
                          that.setData({
                            showParclose: false
                          })
                        }
                      } else {
                        wx.showToast({
                          title: message.resultMsg,
                          icon: 'none',
                          duration: 800
                        })
                      }
                    });
                  } else {
                    wx.showToast({
                      title: r.msg,
                      icon: 'none',
                      duration: 800
                    })
                  }
                });
              }
            })
          }
        }
      })
    } else if (!app.globalData.userInfo.isPhone) {
      // 判断用户手机号有没有验证
      util.req("/member/detail", { memberId: app.globalData.memberId }, function (message) {
        console.log(message);
        if (message.resultCode == 200) {
          app.globalData.userInfo = message.resultContent;
          if (!app.globalData.userInfo.isPhone) {
            wx.navigateTo({
              url: '../bindPhone/bindPhone',
            })
          } else {
            // 保存用户信息到缓存
            wx.setStorage({
              key: 'userInfo',
              data: app.globalData.userInfo,
              success: function (res) {
                console.log(res);
              }
            })
            //更改头像
            that.setData({
              userAvatar: app.globalData.userInfo.headImg
            })
            wx.hideLoading();
            that.setData({
              showParclose: false
            })
          }
        } else {
          wx.showToast({
            title: message.resultMsg,
            icon: 'none',
            duration: 800
          })
        }

      });
    } else if (app.globalData.userInfo.isPhone) {
      wx.getStorage({
        key: 'userInfo',
        success: function (res) {
          that.setData({
            userAvatar: res.data.headImg
          })
        },
      })
      wx.hideLoading();
      that.setData({
        showParclose: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '正在加载资源',
      mask: true
    })
    that.setData({
      showParclose: true
    })
    this.mapCtx = wx.createMapContext('map');
    // 获取当前位置
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var data = {
          latitude: res.latitude,
          longitude: res.longitude
        }
        that.getSite();
        that.setData({
          location: {
            latitude: data.latitude,
            longitude: data.longitude
          }
        })
      },
    })
    // 添加控件
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          controls: [{
            id: 0,//定位图标
            iconPath: '../img/index/position_now@2x.png',
            position: {
              left: 5,
              top: res.windowHeight - 150,
              width: res.windowWidth / 7,
              height: res.windowWidth / 7 
            },
            clickable: true
          }, {
            id: 1,//报修图标
            iconPath: '../img/index/repairs@2x.png',
            position: {
              left: 5,
              top: res.windowHeight - 105,
              width: res.windowWidth / 7,
              height: res.windowWidth / 7 
            },
            clickable: true
          },{
            id: 2,//扫一扫
            iconPath: '../img/index/scan@2x.png',
            position: {
              left: res.windowWidth / 2 - res.windowWidth / 4,
              top: res.windowHeight - 115,
              width: res.windowWidth / 2,
              height: 3 * res.windowWidth / 20 
            },
            clickable: true
          }, {
            id: 3,//中心点图标
            iconPath: '../img/center.png',
            position: {
              left: res.windowWidth / 2 - res.windowWidth / 20 / 2,
              top: res.windowHeight / 2 - res.windowWidth / 10 - res.windowWidth / 20 - 2,
              width: res.windowWidth / 20,
              height: res.windowWidth / 10
            },
            clickable: true
          }]
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
    this.userLogin();
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