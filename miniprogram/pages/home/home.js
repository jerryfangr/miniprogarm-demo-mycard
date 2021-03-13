// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categories: [
      {
        name: '身份证',
        icon: '/assets/image/id-card.png'
      },
      {
        name: '银行卡',
        icon: '/assets/image/bank-card.png'
      },
    ],
  },

  pickCategory (event) {
    const type = event.detail.value;
    const name = this.data.categories[type].name;

    wx.navigateTo({
      url: `/pages/recognize/recognize?type=${type}&name=${name}`,
    })
  },

})