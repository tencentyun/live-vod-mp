const { yunApiRequest } = require('./lib');
const { liveConfig } = require('./config');
const { headUpperCase } = require('./utils');

async function createRecordTemp (params) {
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

    }, liveConfig);
}

async function createRecordRule (domainName, templateId) {
  if(!domainName || !templateId) {
    throw new Error('invalid params config');
  }
  return yunApiRequest({
    Action: 'CreateLiveRecordRule',
    AppName: '',
    DomainName: domainName,
    StreamName: '',
    TemplateId: templateId,
  }, liveConfig);
}
/**
 * 创建录制模板并绑定推流域名
 * @param {{type: 'mp4' | 'flv' | 'hls', pushDomain: string}} params 
 */
async function initRecordRule (params = {}) {
  try {
    const res = await createRecordTemp({
      type: params.type || liveConfig.recordType || 'mp4',
    });
    const templateId = res.data.Response.TemplateId;
    console.log('record template created: ', templateId);
    const result = await createRecordRule(params.pushDomain || liveConfig.pushDomain, templateId);
    if (result.code !== 0) {
      throw new Error(result.message);
    }
    return result;
  } catch (e) {
    console.log('---- error ----');
    console.log(e);
    throw e;
  }
}

module.exports = {
  createRecordTemp,
  createRecordRule,
  initRecordRule
}
