// pages/cardlist/cardlist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 0,
    title: '',
    collection: null,
    page: 0,
    limit: 10,
    cardList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取卡片数据库collection
    let type = options.type || 0;
    let collectionName = options.type == 0 ? 'idcard' : 'bankcard';

    this.setData({
      type,
      title: options.name,
      collection: wx.cloud.database().collection(collectionName)
    });

    // 载入该类型卡证10条数据
    this.loadCards().then(res => {
    })
  }, 

  /**
   * 对数据库数据分页获取，添加到data.cardList
   */
  loadCards () {
    let start = this.data.page * this.data.limit;
    return this.queryCardData(start, this.data.limit).then(res => {
      this.setData({
        page: this.data.page + 1,
        cardList: this.data.cardList.concat(res.data)
      });
    });
  },

  /**
   * 获取数据库数据指定位置开始的一段数据
   * @param {*} start 取数据的起始位置，start之前跳过
   * @param {*} limit 取数据的数量
   */
  queryCardData(start, limit) {
    return this.data.collection.skip(start).limit(limit).get();
  },

  copyID (event) {
    const index = event.currentTarget.dataset.index;
    const id = this.data.cardList[index]?.id || 'null';
    wx.setClipboardData({
      data: id,
    })
  },

  deleteCard (event) {
    const index = event.currentTarget.dataset.index;
    const _id = this.data.cardList[index]?._id;
    if (_id !== undefined) {
      this.data.collection
        .doc(_id)
        .remove()
        .then(res => {
          this.data.cardList.splice(index, 1);
          this.setData({
            cardList: this.data.cardList
          })
        })
    } else {
      wx.showToast({
        icon: 'error',
        title: '删除失败',
      })
    }
  },
})