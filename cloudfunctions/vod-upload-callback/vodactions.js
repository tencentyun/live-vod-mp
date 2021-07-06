const { yunApiRequest } = require('./lib');
const { vodConfig } = require('./config');
exports.ads10 = async function(fileId) {
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

exports.initInactivation = async function() {
    return yunApiRequest({
        Action: 'CreateMediaLifeCyclePolicy',
        Name: 'record-inactivation',
        OperationType: 'STANDARD_IA',
        SubAppId: vodConfig.subAppId,
    }, vodConfig);
}

