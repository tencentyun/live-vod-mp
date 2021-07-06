var plugin = requirePlugin("liveRoomPlugin")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // version: 2,
    // liveAppID: 1256342427,
    liveAppID: 1306264703,
    pushUrl: 'rtmp://demopush.jingxhu.top/live/test?txSecret=0e002c21c2b2679bb4e362885d3e9350&txTime=60E5555C',
    mode: 'SD',
    waitingImage:'https://mc.qcloudimg.com/static/img/daeed8616ac5df256c0591c22a65c4d3/pause_publish.jpg',
    enableCamera:true,
    orientation: "vertical",
    objectFit: "contain",
    beauty:4,
    whiteness:4,
    backgroundMute:true,
    minCache: 1,
    maxCache: 3,
    muted: false,
    debug: true,
    autoFocus: false,
    aspect:'9:16',
    minBitrate: 200,
    maxBitrate: 1000,
    zoom: false,
    devicePosition:'front',  //初始化摄像头为前置还是后置，只能初始化的时候设置，动态调整用switchCamera
    frontCamera: true,

    sdkAppID: 0,
    accountType: '',
    userID: '',
    userSig: '',
    roomID: 'room_caroltest_123456',

    nickName: '昵称',
    avatar: '头像url',

    liveRoomPushComponent: null,
    playing:false,
    inputMsg: '',     // input信息
    comment: [],      // 评论区信息
    showHDTips: false, //显示清晰度弹窗
  },
  onPushClick: function () {
    var url = this.data.pushUrl;
    if (url.indexOf("rtmp:") == 0) { } else {
      wx.showToast({
        title: '推流地址不合法，目前仅支持rtmp方式!',
        icon: 'loading',
      })
    }

    this.setData({
      playing: !this.data.playing,
    })

    if (this.data.playing) {
      console.log('开始推流');
      this.data.liveRoomPushComponent.start();
      // wx.showLoading({
      //   title: '测试推流',
      // })
    } else {
      this.setData({
        playing: false,
        mode: "SD",
        enableCamera: true,
        orientation: "vertical",
        beauty: 6.3,
        whiteness: 3.0,
        backgroundMute: false,
        debug: false,
      })
      this.data.liveRoomPushComponent.stop();
      setTimeout(() => {
        wx.hideLoading();
      }, 100);
    }
  },
  onSwitchCameraClick: function () {
    this.data.frontCamera = !this.data.frontCamera;
    this.setData({
      frontCamera: this.data.frontCamera
    })
    this.data.liveRoomPushComponent.switchCamera();
  },
  onBeautyClick: function () {
    if (this.data.beauty != 0) {
      this.data.beauty = 0;
      this.data.whiteness = 0;
    } else {
      this.data.beauty = 6.3;
      this.data.whiteness = 3.0;
    }

    this.setData({
      beauty: this.data.beauty,
      whiteness: this.data.whiteness
    })
  },
  stop: function () {
    this.setData({
      playing: false,
      mode: "SD",
      enableCamera: true,
      orientation: "vertical",
      beauty: 6.3,
      whiteness: 3.0,
      backgroundMute: false,
      debug: false,
    })
    this.data.liveRoomPushComponent && this.data.liveRoomPushComponent.stop();
    setTimeout(() => {
      wx.hideLoading();
    }, 100);
  },

  onOrientationClick: function () {
    if (!this.data.enableCamera) {
      wx.showToast({
        icon: 'none',
        title: '请先开启摄像头'
      })
      return;
    }
    if (this.data.orientation == "vertical") {
      this.data.orientation = "horizontal";
    } else {
      this.data.orientation = "vertical";
    }
    this.setData({
      orientation: this.data.orientation
    })
  },
  onSwitchMode: function () {
    var showTips = !this.data.showHDTips;
    this.setData({
      showHDTips: showTips
    })
  },
  onModeClick: function (event) {
    var mode = "SD";
    switch (event.target.dataset.mode) {
      case "SD":
        mode = "SD";
        break;
      case "HD":
        mode = "HD";
        break;
      case "FHD":
        mode = "FHD";
        break;
    }

    this.setData({
      mode: mode,
      showHDTips: false
    })
  },
  onEnableCameraClick: function () {
    this.setData({
      enableCamera: !this.data.enableCamera
    })
    if (this.data.playing) {
      this.data.liveRoomPushComponent.stop();
      setTimeout(() => {
        this.data.liveRoomPushComponent.start();
      }, 500)
    }
  },
  onObjectfitClick: function () {
    if (this.data.objectFit == "fillCrop") {
      this.data.objectFit = "contain";
    } else {
      this.data.objectFit = "fillCrop";
    }

    this.setData({
      objectFit: this.data.objectFit
    })
  },

  onLogClick: function () {
    this.setData({
      debug: !this.data.debug,
    })
  },
  onBackgroundMuteClick: function () {
    this.setData({
      backgroundMute: !this.data.backgroundMute,
    })
  },
  onAutoFocusClick: function () {
    this.setData({
      autoFocus: !this.data.autoFocus,
    })
  },
  onZoomClick: function () {
    this.setData({
      zoom: !this.data.zoom,
    })
  },
  onSnapshotClick: function () {
    this.data.liveRoomPushComponent.snapshot({
      success: function (res){
        wx.saveImageToPhotosAlbum({
          filePath: res.tempImagePath
        })
        console.log(res)
      },
      fail:function(res) {
        console.log(res)
      }
    });
  },
  onMuteClick: function () {
    this.setData({
      muted: !this.data.muted
    })
  },
  bindInputMsg: function (e) {
    this.data.inputMsg = e.detail.value;
  },
  sendComment: function (msg) {
    if (this.data.liveRoomPushComponent) {
      this.data.liveRoomPushComponent.sendTextMsg(this.data.inputMsg, function () {
        wx.showToast({
          icon: 'none',
          title: '群消息成功'
        });
      }, function () {
        wx.showToast({
          icon: 'none',
          title: '群消息失败'
        });
      });
      this.setData({
        inputMsg: ''
      });
    }
  },
  sendPrise: function (msg) {
    if (this.data.liveRoomPushComponent) {
      //发送自定义点赞消息，
      var msgObject = {
        data: JSON.stringify({
          cmd: 'CustomPriseMsg',
        }),
      }
      this.data.liveRoomPushComponent.sendCustomMsg(msgObject, function () {
        wx.showToast({
          icon: 'none',
          title: '群消息成功'
        });
      }, function () {
        wx.showToast({
          icon: 'none',
          title: '群消息失败'
        });
      });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.liveRoomPushComponent = plugin.instance.getLiveRoomPushInstance();

    var self = this;
    wx.request({
      url: 'https://room.qcloud.com/weapp/utils/get_login_info',
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (ret) {
        if (ret.data.code) {
          console.log('获取登录信息失败，调试期间请点击右上角三个点按钮，选择打开调试');
          wx.showToast({
            icon: 'none',
            title: '获取登录信息失败，调试期间请点击右上角三个点按钮，选择打开调试'
          });
          return;
        }
        console.log('获取IM登录信息成功: ', ret.data);
        self.setData({
          sdkAppID: ret.data.sdkAppID,
          accountType: ret.data.accType,
          userID: ret.data.userID,
          userSig: ret.data.userSig,
        }, () => {
        });
      },
      fail: function (ret) {
        console.log('获取IM登录信息失败: ', ret);
        if (ret.errMsg == 'request:fail timeout') {
          var errCode = -1;
          var errMsg = '网络请求超时，请检查网络状态';
        }
        wx.showToast({
          icon: 'none',
          title: errMsg | '获取登录信息失败，调试期间请点击右上角三个点按钮，选择打开调试'
        });
      }
    });
  },

  /**
   * 监听播放事件
   */
  onPushEvent: function (e) {
    console.log('onPushEvent', e);
    var self = this;
    switch (e.detail.tag) {
      case 'pushEvent': {
        switch (e.detail.code) {
          case -1301:
            self.stop();
            wx.showToast({
              title: '打开摄像头失败',
            })
            break;
          case -1302:
            self.stop();
            wx.showToast({
              title: '打开麦克风失败',
            })
            break;
          case -1307:
            self.stop();
            wx.showToast({
              title: '推流多次失败',
            })
            break;
          case 1002:
            setTimeout(() => {
              wx.hideLoading();
            }, 100);
            break;
        }
        break;
      }
      case 'error': {
        console.log('播放出错, errCode[' + e.detail.code + '],errMsg[' + e.detail.detail + ']');
        self.stop();
        break;
      }
    }
  },

  onError: function(e) {
    console.log('onError', e);
  },

})