# 一键部署搭建自有小程序直播

腾讯云点播（Video on Demand，VOD）和云直播（Cloud Streaming Services，CSS）基于腾讯多年技术积累与基础设施建设，为有音视频应用相关需求的用户提供专业稳定快速的直播接入和音视频存储、自动化转码处理、加速分发等服务的一站式解决方案.

本应用基于云开发TCB使用腾讯云点播(VOD)以及云直播(CSS)快速搭建一个直播小程序，并且提供可配置的直播录制，文件降冷，视频处理等功能。

## 准备工作

### 安装小程序开发工具

- 下载并安装最新版本的 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- 本应用集成了小程序直播插件，请先阅读微信小程序提供的插件 [使用文档](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/plugin/using.html)，了解插件的使用范围和限制。


### 注册小程序

-  在 [微信公众平台](https://mp.weixin.qq.com/) 注册并登录小程序，**小程序认证主体需为中国大陆地区的非个人主体**
> 关于小程序具体的类目要求请参考 [小程序云直播插件的说明](https://cloud.tencent.com/document/product/1078/42916#.E5.89.8D.E6.8F.90.E6.9D.A1.E4.BB.B6)

### 开通云服务

1. [注册腾讯云](https://cloud.tencent.com/document/product/378/17985) 账号，并完成 [企业实名认证](https://cloud.tencent.com/document/product/378/10496)
> 使用上一步注册的小程序或已有小程序账号注册腾讯云，或将已有腾讯云账号与小程序账号绑定，使小程序可以使用腾讯云开发环境进行云开发，参考云开发 [账号相关问题](https://cloud.tencent.com/document/product/876/57380)
2. 开通 [云开发](https://console.cloud.tencent.com/tcb)、[云点播](https://console.cloud.tencent.com/vod)、[云直播](https://console.cloud.tencent.com/live)

### 申请插件

- 根据小程序云直播插件 [指引](https://cloud.tencent.com/document/product/1078/42916.E7.94.B3.E8.AF.B7.E6.8F.92.E4.BB.B6) 申请并启用插件
> 本应用已经将插件引入到小程序代码中，开发者只需要根据上述要求获取插件的使用资格，之后小程序即可正常使用小程序直播插件

## 部署应用

- 前往 [腾讯云控制台](https://console.cloud.tencent.com/cam)获取 API 秘钥
- 点击 [一键部署](https://console.cloud.tencent.com/tcb/env/index?action=CreateAndDeployCloudBaseProject&appUrl=https%3A%2F%2Fgithub.com%2Ftencentyun%2Flive-vod-mp&branch=main)，进入云开发控制台根据表单要求填入相关自定义配置后即可完成部署
> 表单中要求填写的推流域名需要在云直播控制台中完成 [添加](https://console.cloud.tencent.com/live/domainmanage) 并配置 CNAME

![tcb](https://imgcache.qq.com/operation/dianshi/other/tcb-form.e74ee55234cb735a68376e8c75a5badcb72d1f3e.png)

## 业务开发

1. 拉取本应用 [代码仓库](https://github.com/tencentyun/live-vod-mp.git) 到本地并填入自己的小程序APPID及相关项目配置，使用微信开发者工具进行开发
2. 根据业务需求使用小程序直播插件提供的组件进行直播相关业务开发，直播插件功能以及开发文档可参考[【使用推流组件】](https://cloud.tencent.com/document/product/1078/46456)、[【使用播放组件】](https://cloud.tencent.com/document/product/1078/34646)，需要将自身的账号以及推流、拉流配置填入相关代码中

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

## 其他说明

1. 本应用已为开发者自动完成了直播录制配置以及降冷配置，直播结束后将生成录制文件存储到云点播并完成降冷，为用户降低存储成本，关于录制具体配置可参考代码中的相关参数，开发者部署应用后可以修改参数以满足自己的功能需求
2. 部署本应用后会自动生成可调用的 http 服务，该服务实现了一个对视频进行转自适应码流的处理功能，开发者可以在 [云开发控制台]([云开发控制台](https://console.cloud.tencent.com/tcb/env/access?))获取到 http 地址后填入点播的 [回调设置](https://cloud.tencent.com/document/product/266/33779)中开启上传回调，即可自动对录制生成的视频文件进行转自适应码流处理，参考代码可实现更多的视频处理功能
