const { yunApiRequest } = require('./lib');
const { vodConfig } = require('./config');
async function ads10 (fileId) {
    return yunApiRequest({
        Action: 'ProcessMedia',
        FileId: fileId,
        SubAppId: vodConfig.subAppId,
        MediaProcessTask: {
            AdaptiveDynamicStreamingTaskSet: [{
                Definition: 10,
                WatermarkSet: [{Definition:0}]
            }],
            CoverBySnapshotTaskSet: [{
                Definition: 10,
                PositionType: "Time",
                PositionValue: 0
            }]
        },
    }, vodConfig);
}

async function initInactivation () {
    return yunApiRequest({
        Action: 'CreateMediaLifeCyclePolicy',
        Name: 'record-inactivation',
        OperationType: 'STANDARD_IA',
        SubAppId: vodConfig.subAppId ? +vodConfig.subAppId : undefined,
    }, vodConfig);
}

async function getRecordMedia() {
    return yunApiRequest({
        Action: 'SearchMedia',
        Limit: 10,
        Offset: 0,
        SourceTypes: ['Record'],
    }, vodConfig);
}

module.exports = {
    ads10,
    initInactivation,
    getRecordMedia
}

