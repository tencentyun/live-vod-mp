var plugin = requirePlugin("liveRoomPlugin")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    version: 1,
    mode: 'LIVE',
    liveAppID: 1256342427,
    playUrl: 'http://pluginplay001.elementtest.org/live/pluginpush_xx2.flv',
    orientation: 'vertical',
    objectFit: 'contain',
    minCache: 1,
    maxCache: 3,
    muted: false,
    debug: false,

    autoplay : true,

    sdkAppID: 0,
    accountType: '',
    userID: '',
    userSig: '',
    roomID: 'room_caroltest_123456',

    nickName:'昵称',
    avatar:'头像url',

    liveRoomComponent: null,
    playing: false,
    fullScreen : false,
    inputMsg: '',     // input信息
    comment: [],      // 评论区信息
    pagename : 'play1',
    miniWindow1: []
  },


  onPlayClick: function() {
    var url = this.data.playUrl;
    if (url.indexOf("rtmp:") == 0) {} else if (url.indexOf("https:") == 0 || url.indexOf("http:") == 0) {
      if (url.indexOf(".flv") != -1) {}
    } else {
      wx.showToast({
        title: '播放地址不合法，目前仅支持rtmp,flv方式!',
        icon: 'loading',
      })
    }

    this.setData({
      playing: !this.data.playing,
    })

    if (this.data.playing) {
      this.data.liveRoomComponent.start();
      wx.showLoading({
        title: '',
      })
    } else {
      this.data.liveRoomComponent.stop();
      setTimeout(() => {
        wx.hideLoading();
      }, 100);
    }
  },

  stop: function() {
    this.setData({
      playing: false,
      orientation: "vertical",
      objectFit: "contain",
      muted: false,
      debug: false,
    })
    this.data.liveRoomComponent && this.data.liveRoomComponent.stop();
    setTimeout(() => {
      wx.hideLoading();
    }, 100);
  },

  onOrientationClick: function() {
    if (this.data.orientation == "vertical") {
      this.data.orientation = "horizontal";
    } else {
      this.data.orientation = "vertical";
    }
    this.setData({
      orientation: this.data.orientation
    })
  },

  onObjectfitClick: function() {
    if (this.data.objectFit == "fillCrop") {
      this.data.objectFit = "contain";
    } else {
      this.data.objectFit = "fillCrop";
    }

    this.setData({
      objectFit: this.data.objectFit
    })
  },

  onFullScreenClick : function () {
    if (this.data.liveRoomComponent){
      this.data.liveRoomComponent.requestFullScreen(!this.data.fullScreen);
      this.setData({
        fullScreen: !this.data.fullScreen
      })
    }      
  },

  onLogClick: function() {
    this.setData({
      debug: !this.data.debug
    })
  },

  onMuteClick: function() {
    this.setData({
      muted: !this.data.muted
    })
  },
  bindInputMsg: function (e) {
    this.data.inputMsg = e.detail.value;
  },
  sendComment: function (msg) {
    if (this.data.liveRoomComponent) {
      this.data.liveRoomComponent.sendTextMsg(this.data.inputMsg, function () {
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
    if (this.data.liveRoomComponent) {
      //发送自定义点赞消息，
      var msgObject = {
        data: JSON.stringify({
          cmd: 'CustomPriseMsg',
        }),
      }
      this.data.liveRoomComponent.sendCustomMsg(msgObject, function () {
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
    //wx.navigateTo({
    //  url: '/pages/live-room-play/play?name=play2',
    //})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      pagename: options.name ? options.name : "play1",
    })

    this.data.liveRoomComponent = plugin.instance.getLiveRoomInstance();
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
        self.setData ({
          sdkAppID: ret.data.sdkAppID,
          accountType: ret.data.accType,
          userID: ret.data.userID,
          userSig: ret.data.userSig,
        }, () => {
          //在调用start的时候，组件内部initIM
          //self.data.liveRoomComponent.initIM();
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
  onPlayEvent: function(e) {
    var self = this;
    console.log("pagename:", this.data.pagename, "current e:", e)
    
    switch (e.detail.tag) {
      case 'playEvent': {
        if (e.detail.code == -2301) {
          self.stop();
          wx.showToast({
            title: '拉流多次失败',
          })
        }
        if (e.detail.code == 2004) {
          setTimeout(() => {
            wx.hideLoading();
          }, 100);
        }
        if(!this.data.playing){
          this.setData({
            playing: !this.data.playing,
          })
        }
        break;
      }
      case 'error' : {
        console.log('播放出错, errCode[' + e.detail.code + '],errMsg[' + e.detail.detail + ']');
        self.stop();
        break;
      }
    }
  },
  onMiniWindowClick: function(){
    if (this.data.liveRoomComponent){
      // this.data.liveRoomComponent.re(!this.data.fullScreen);
      var mini = [];
      var a = parseInt(Math.random()*7,10)
      if (a==1){
          mini = [];
      }else if (a==2){
        mini = ["push"];
      }else if (a==3){
        mini = ["push","pop"];
      }else if (a==4){
        mini = "push"
      }else if (a==5){
        mini = "pop"
      }else if (a==6){
        mini = ""
      }else {
        mini = ["pop"]
      }
      this.setData({
        'miniWindow1': mini
      })
    }      
  },
  onMiniWindowEnter: function(e){
    console.log("开启小窗口    ",e)
  },
  onMiniWindowLeaver: function(e){
    console.log("关闭小窗口    ",e)
  },
  onotherClick: function(e){
    wx.navigateTo({
      url: "../index/index",
    });
  }
})