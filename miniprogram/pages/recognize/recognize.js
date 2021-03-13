// pages/recognize/recognize.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 0,
    name: '',
    cardInfo: null,
    collection: null
  },

  selectCard (event) {
    wx.chooseImage({// 获取本地图片
      count: 1,
      sourceType: ['album', 'camera'],
    }).then(res => {// 上传云存储，获取fileID
      wx.showLoading({title: '识别中...'})
      return this.uploadFile(res.tempFilePaths[0]);
    }).then(res => {// 通过fileID生成可访问连接
      return this.toTempUrl(res.fileID);
    }).then(res => {// 发送服务端调用腾讯识别api
      return this.recognizeImage(res.fileList[0].tempFileURL, res.fileID);
    }).then(result => {// 处理识别结果
      if (result.isFail) {
        wx.showToast({icon: 'error', title:'识别失败'});
        this.setData({cardInfo: null})
        this.deleteImage(result.fileID);
      } else {
        wx.hideLoading();
        this.setData({cardInfo: result})
      }
    }).catch(error => { // 识别流程中出错处理
      console.log(error)
      wx.showToast({icon: 'error', title:'识别出错'});
      this.setData({cardInfo: null})
    })
  },

  uploadFile (filePath) {
    return wx.cloud.uploadFile({
      filePath,
      cloudPath: 'image/card_' + new Date().getTime() + '_openid.png'
    })
  },

  toTempUrl (fileID) {
    return wx.cloud.getTempFileURL({
      fileList: [fileID],
    }).then(res => {
      res.fileID = fileID;
      return res;
    })
  },

  recognizeImage (imageUrl, fileID) {
    return wx.cloud.callFunction({
      name: 'recognizeCard',
      data: {
        cardUrl: imageUrl,
        type: this.data.type
      }
    }).then(res => {
      if (res.result.code !== 0) {
        return {
          isFail: true,
          fileID
        };
      }
      return this.handleData(res.result, fileID);
    })
  },

  handleData(result, fileID) {
    if (this.data.type == 0) {
      return {
        id: result.data.id,
        address: result.data.address,
        birth: result.data.birth,
        name: result.data.name,
        nation: result.data.nation,
        sex: result.data.sex,
        fileID
      }
    } else {
      return {
        id: result.items[0].itemstring,
        type: result.items[1].itemstring,
        name: result.items[2].itemstring,
        bank: result.items[3].itemstring,
        contractLife: result.items[4].itemstring,
        fileID
      }
    }
  },

  saveCard () {
    wx.showLoading({title: '保存中...'});
    this.data.collection.where({
        id: this.data.cardInfo.id
    }).get().then(res => {
      if (res.data.length > 0) {
        const _id = res.data[0]._id;
        this.deleteImage(res.data[0].fileID);
        return this.coverInfo(_id);
      } else {
        return this.saveInfo();
      }
    }).then(info => {
      wx.showToast({title: info});
    })
  },

  saveInfo () {
    return this.data.collection.add({
      data: this.data.cardInfo
    }).then(res => {
      return '保存成功!';
    })
  },
  
  coverInfo (_id) {
    return this.data.collection.doc(_id).set({
      data: this.data.cardInfo
    }).then(res => {
      return '更新成功!';
    })
  },

  deleteImage(fileID) {
    return wx.cloud.deleteFile({
      fileList: [fileID]
    })
  },

  copyCard () {
    wx.setClipboardData({
      data: this.data.cardInfo.id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let collectionName = options.type === '0' ? 'idcard' : 'bankcard';
    this.setData({
      type: options.type,
      name: options.name,
      collection: wx.cloud.database().collection(collectionName)
    })
  },

})