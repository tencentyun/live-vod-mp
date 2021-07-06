const { yunApiRequest } = require('./lib');
const { liveConfig } = require('./config');
const { headUpperCase } = require('./utils');

exports.createRecordTemp = async function(params) {
    const type = headUpperCase(params.type);
    if (!type) {
      throw new Error('invalid type');
    }
    return yunApiRequest({
        Action: 'CreateLiveRecordTemplate',
        TemplateName: 'default-record',
        [`${type}Param`]: {
          VodSubAppId: liveConfig.subAppId,
        }

    }, vodConfig);
}

exports.createRecordRule = async function (DomainName, templateId) {
  if(!domainName || !templateId) {
    throw new Error('invalid params config');
  }
  return yunApiRequest({
    Action: 'CreateLiveRecordRule',
    AppName: '',
    DomainName: domainName,
    StreamName: '',
    TemplateId: templateId,
  })
}
/**
 * 创建录制模板并绑定推流域名
 * @param {{type: 'mp4' | 'flv' | 'hls', pushDomain: string}} params 
 */
exports.initRecordRule = async function(params = {}) {
  try {
    const res = await createRecordTemp({
      type: params.type || liveConfig.recordType || 'mp4',
    });
    const templateId = res.data.TemplateId;
    const result = await createRecordRule(params.pushDomain || liveConfig.pushDomain, templateId);
    return result;
  } catch (e) {
    console.log('---- error ----');
    console.log(e);
    throw e;
  }
}
