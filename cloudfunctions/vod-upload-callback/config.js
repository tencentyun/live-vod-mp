const baseConfig = {
  secretId: process.env.SecretId,
  secretKey: process.env.SecretKey,
  baseHost: 'tencentcloudapi.com',
  subAppId: process.env.SubAppId,
}

const vodConfig = {
  ...baseConfig,
  serviceType: 'vod',
  apiVersion: '2018-07-17', 
};

const liveConfig = {
  ...baseConfig,
  serviceType: 'live',
  apiVersion: '2018-08-01', 
  pushDomain: process.env.PushDomain,
  recordType: process.env.RecordType
}

module.exports = {
  vodConfig,
  liveConfig
}