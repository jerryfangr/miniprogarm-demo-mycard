// pages/home/components/w-cart-category/w-cart-category.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    categories: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    itemClick(event) {
      const index = event.currentTarget.dataset.index;
      const name = this.data.categories[index].name;
      wx.navigateTo({
        url: `/pages/cardlist/cardlist?type=${index}&name=${name}`,
      })
    }
  }
})
