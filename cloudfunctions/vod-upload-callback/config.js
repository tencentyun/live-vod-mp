const baseConfig = {
  secretId: process.env.SecretId,
  secretKey: process.env.SecretKey,
  baseHost: 'tencentcloudapi.com',
  subAppId: process.env.SubAppId,
}

exports.vodConfig = {
  ...baseConfig,
  serviceType: 'vod',
  apiVersion: '2018-07-17', 
};

exports.liveConfig = {
  ...baseConfig,
  serviceType: 'live',
  apiVersion: '2018-08-01', 
  pushDomain: process.env.PushDomain,
  recordType: process.env.RecordType
}