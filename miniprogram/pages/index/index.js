var plugin = requirePlugin("liveRoomPlugin");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    canShow: 0,
    tapTime: '',		// 防止两次点击操作间隔太快
    entryInfos: [
      { icon: "../Resources/play.png", title: "直播室-播放", desc: "<live-room-play>", navigateTo: "../live-room-play/play" },
      { icon: "../Resources/push.png", title: "直播室-推流", desc: "<live-room-push>", navigateTo: "../live-room-push/push" },
      { icon: "../Resources/tic.png", title: "直播室-白板", desc: "<board-component>", navigateTo: "../tic/index/index"},
    ],
    playing: false,
  },

  onEntryTap: function (e) {
    console.log(e);
    if (this.data.canShow) {
      // if(1) {
      // 防止两次点击操作间隔太快
      var nowTime = new Date();
      if (nowTime - this.data.tapTime < 1000) {
        return;
      }
      var toUrl = this.data.entryInfos[e.currentTarget.id].navigateTo;
      console.log(toUrl);
      wx.navigateTo({
        url: toUrl,
      });
      this.setData({ 'tapTime': nowTime });
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后再试。',
        showCancel: false
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onLoad");
    if (options.testenv){
      plugin.instance.setTestEnv(options.testenv);
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("onReady");
    if (!wx.createLivePlayerContext) {
      setTimeout(function () {
        wx.showModal({
          title: '提示',
          content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后再试。',
          showCancel: false
        });
      }, 0);
    } else {
      // 版本正确，允许进入
      this.data.canShow = 1;
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("onShow");
    this.setData({
      playing: false,
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("onHide");

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("onUnload");

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("onPullDownRefresh");

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("onReachBottom");

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log("onShareAppMessage");
    return {
      title: '腾讯视频云',
      path: '/pages/main/main',
      imageUrl: 'https://mc.qcloudimg.com/static/img/dacf9205fe088ec2fef6f0b781c92510/share.png'
    }
  },

  onPlayClick: function() {
    var liveRoomComponent = plugin.instance.getLiveRoomInstance();
    

    if (!this.data.playing) {
      this.setData({
        playing: !this.data.playing,
      })
      liveRoomComponent.exitPictureInPicture();
      console.log("调用了liveRoomComponent.exitPictureInPicture()");
      wx.showLoading({
        title: '关闭小窗',
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 2000)
    }else{
      wx.showLoading({
        title: '已调用关闭小窗，误重复调用',
      })
      setTimeout(function () {
        wx.hideLoading()
      }, 1000)
    }
  },
})