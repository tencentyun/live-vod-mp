# live-vod-mp

腾讯云点播(VOD)提供的直播录制点播小程序云开发应用模板，集成了小程序云直播插件并依托云开发能力实现直播录制，文件降冷，视频转码等功能。

## 使用流程

### 步骤一 开通云服务


开通[云点播](https://cloud.tencent.com/product/vod)、[云直播](https://cloud.tencent.com/product/css)

### 步骤二 申请直播插件


按照[指引文档](https://cloud.tencent.com/document/product/1078/42916)申请小程序云直播插件，启用插件后[添加](https://console.cloud.tencent.com/live/domainmanage)小程序推流域名和播放域名


### 步骤三 一键部署

点击下方按钮，并根据要求填写表单后即可在云端一键部署本项目到自己的云开发账号上并完成相关业务配置

[![](https://main.qcloudimg.com/raw/67f5a389f1ac6f3b4d04c7256438e44f.svg)](https://console.cloud.tencent.com/tcb/env/index?action=CreateAndDeployCloudBaseProject&appUrl=https%3A%2F%2Fgithub.com%2Ftencentyun%2Flive-vod-mp&branch=main)

### 步骤四 开始开发

前往[直播控制台](https://console.cloud.tencent.com/live)获取上一步添加的域名对应的推流链接和播放链接，分别填入本项目的以下代码中。其他直播插件功能以及开发文档可参考[【使用推流组件】](https://cloud.tencent.com/document/product/1078/46456)、[【使用播放组件】](https://cloud.tencent.com/document/product/1078/34646)

````js
// ./miniprogram/pages/live-room-push/push.js

Page({
  /**
   * 页面的初始数据
   */
  data: {
    version: 2,
    // 腾讯云账号 APPID
    liveAppID: 1256927043,
    // 推流链接
    pushUrl: 'rtmp://xxx.com/live/test?txSecret=55b556d32b06ad72b4f5d2065229d237&txTime=60E40752',
    /* 省略其他代码 */
  }
````
````js
// ./miniprogram/pages/live-room-play/play.js

Page({
  /**
   * 页面的初始数据
   */
  data: {
    version: 1,
    mode: 'LIVE',
    // 腾讯云账号 APPID
    liveAppID: 1256927043,
    // 播放链接
    playUrl: 'http://xxx.com/live/pluginpush_xx2.flv',
    /* 省略其他代码 */
  }
````

- liveAppID：即腾讯云账号APPID，在腾讯云云控制台的[【账号信息】](https://console.cloud.tencent.com/developer)中查看。
- pushUrl/playUrl：在腾讯云直播控制台[【域名管理】](https://console.cloud.tencent.com/live/domainmanage)或[【地址生成器】](https://console.cloud.tencent.com/live/addrgenerator/addrgenerator)均可自助生成

## 其他功能支持

用户可通过配置点播回调事件通知实现对直播录制文件的相关处理，前往[云开发控制台](https://console.cloud.tencent.com/tcb/env/access?)获取部署应用后生成的HTTP访问服务URL，前往[云点播控制台](https://console.cloud.tencent.com/vod/callback)回调设置，填入刚才拿到的服务URL，即可完成云点播回调处理配置。
- 当前应用包含的云函数实现了接收视频文件上传回调后对视频进行自适应码流转码的功能，用户可以参照代码实现其他视频处理操作，关于云点播回调使用相关内容详见[事件通知文档](https://cloud.tencent.com/document/product/266/33779)


## CloudBase Framework 相关开发配置

查看 [CloudBase Framework 配置](https://github.com/TencentCloudBase/cloudbase-framework)