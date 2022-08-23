// 商品分類 models (Schema資料型態)

import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  // 行程大分類
  category: {
    type: String,
    required: [true, '大分類未填寫']
  },
  // 行程小分類
  sub: {
    type: [{
      name: String
    }],
    required: [true, '小分類未填寫'],
    default: []
  }

}, { versionKey: false }) // 移除 versionKey、__V

export default mongoose.model('products_category', schema)
