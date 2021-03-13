// 云函数入口文件
const cloud = require('wx-server-sdk')
const {ImageClient} = require('image-node-sdk');

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let {cardUrl, type='0'} = event;
  // 腾讯卡证识别api配置
  let AppId = 'AppId';
  let SecretId = 'AKIDtd8NVP9lCG8lBTtJ8gz7MLFtHvRho0mw';
  let SecretKey = 'mIp8C9tRpyqeDXgdK8QRCfutRDwVotup';
  let imgClient = new ImageClient({ AppId, SecretId, SecretKey });

  if (type === '0') {
    return imgClient.ocrIdCard({
      data: {url_list: [cardUrl]}
    }).then(result => {
      return JSON.parse(result.body).result_list[0];
    })
  } else {
    return imgClient.ocrBankCard({
      data: {url: cardUrl}
    }).then(result => {
      const data = JSON.parse(result.body).data;
      data.code = 0;
      return data;
    })
  }
}