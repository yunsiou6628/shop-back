// 文章專欄 models (Schema資料型態)

import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '文章標題未填寫']
  },
  image: {
    type: String
  },
  // 文章
  article: {
    type: String
  },
  // 發布
  release: {
    type: Boolean,
    default: false
    // 預設不發布
  }
}, { versionKey: false })

export default mongoose.model('article_column', schema)
