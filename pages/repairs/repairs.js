var util = require('../../utils/request.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: '',
    faultItems: [
      {
        content: '充不了电',
        selected: false
      },
      {
        content: '电池异常发烫',
        selected: false
      },
      {
        content: '二维码脱落',
        selected: false
      },
      {
        content: '机身破损',
        selected: false
      },
      {
        content: '插头破损',
        selected: false
      },
      {
        content: '噪声大',
        selected: false
      },
      {
        content: '螺丝脱落',
        selected: false
      },
      {
        content: '充电失效',
        selected: false
      },
      {
        content: '其它',
        selected: false
      }
    ],
    activeNum: 0,
    imgUrls: []
  },
  // 选择报障类型
  activeItem: function (e) {
    console.log(e);
    var selectedList = 'faultItems[' + e.currentTarget.id + '].selected';
    var selected = !e.target.dataset.selected;
    this.setData({
      [selectedList]: selected
    })
  },
  // 选择图片
  chooseImg: function (e) {
    var that = this;
    var imgUrls = [];
    wx.chooseImage({
      count: 3,
      sizeType: ['compressed'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        console.log(res);
        tempFilePaths.forEach(function (item, index) {
          console.log(item);
          wx.uploadFile({
            url: util.rootDocment + '/file/upload',
            filePath: item,
            name: 'file',
            header: { "Content-Type": "multipart/form-data" },
            formData: {
            },
            success: function (res) {
              console.log(res);
              var file = res.data;
              var str = '';
              for (var i in file) {
                if (i > 8) {
                  str = str + file[i];
                }
              }
              var img = str.substring(0, str.length - 2);
              imgUrls.push(img);
              that.setData({
                imgUrls: imgUrls
              })
            }
          })
        })
      }
    })
  },
  //点击上传的图片预览
  showImg: function (e) {
    var that = this;
    wx.previewImage({
      urls: that.data.imgUrls,
      current: that.data.imgUrls[e.currentTarget.id]
    })
  },
  // 扫描二维码
  scanCode: function (e) {
    var that = this;
    wx.scanCode({
      success: function (res) {
        that.setData({
          code: res.result
        })
      }
    })
  },
  //表单提交
  formsubmit: function (e) {
    console.log(e);
    var that = this;
    var code = e.detail.value.code;
    if (code == null || code == '') {
      wx.showToast({
        title: '请扫描二维码或手动输入编码！',
        icon: 'none',
        duration: 1000
      })
    } else {
      //收集故障类型
      var repairsContent = '';
      this.data.faultItems.forEach(function (item, index) {
        if (item.selected) {
          repairsContent = repairsContent.concat(item.content);
          repairsContent = repairsContent.concat(',');
        }
      })
      repairsContent = repairsContent.concat(e.detail.value.content);
      console.log(repairsContent);
      if (repairsContent == null || repairsContent == '') {
        wx.showToast({
          title: '请选择故障类型或输入问题！',
          icon: 'none',
          duration: 1000
        })
      } else {
        if(that.data.peopleType == 'member') {
          that.feedback();
        } else if(that.data.peopleType == 'cabinet') {
          that.feedback();
        }
      }
    }
  },
  //故障请求方法
  feedback:function (url) {
    var that = this;
    util.req(url, {
      memberId: app.globalData.userInfo.memberId,
      uid: code,
      content: repairsContent,
      images: that.data.imgUrls
    }, function (res) {
      if (res.resultCode == 200) {
        wx.showToast({
          title: res.resultMsg,
          duration: 500
        })
        setTimeout(function () {
          wx.redirectTo({
            url: '../index/index',
          })
        }, 500)
      } else {
        wx.showToast({
          title: res.resultMsg,
          duration: 500,
          icon: 'none'
        })
      }
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