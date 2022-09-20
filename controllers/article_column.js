// controllers - article_column.js => 文章專欄新增/編輯/刪除/查詢
// controllers 呼叫 models 對 資料庫(mongo DB)做 "新增/編輯/刪除/查詢"的操作

import articles from '../models/article_column.js'

// 新增商品 (進資料庫)
export const createArticle = async (req, res) => {
  try {
    // 去 article 資料庫 create 創建資料
    const result = await articles.create({
      // 使用 ?. 可選串聯，設定圖片沒有上傳可能會沒圖片，若沒有上傳圖片 req.file 會是 undefine，對 undefine 的東西寫 .path 會出現錯誤，使用 ?. 可選串聯 就算沒有連到 req.file?.path 整個就是 undefine，如果是 undefine 就是空的 ''
      name: req.body.name,
      image: req.file?.path || '',
      article: req.body.article,
      release: req.body.release
    })
    // res.狀態(保持程式碼一致)
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    console.log(error)
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      return res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

// 已上架文章
// result => 所有上架文章 Article.find({ sell: true }) 給到 result 的資料
export const getArticle = async (req, res) => {
  try {
    const result = await articles.find({ sell: true })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 顯示所有(包含下架)文章，只有管理員可以看
export const getAllArticle = async (req, res) => {
  try {
    const result = await articles.find()
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 單篇文章 :id
export const getOneArticle = async (req, res) => {
  try {
    // params 路由參數
    // patch( '/articles/' + form._id )
    // 前台路徑後面的欄位( + 後面的東西) = req.params.id
    const result = await articles.findById(req.params.id).lean()
    res.status(200).send({ success: true, message: '', result: { ...result } })
  } catch (error) {
    // console.log(error)
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 編輯修改
export const editArticle = async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      article: req.body.article,
      release: req.body.release
    }
    if (req.file) data.image = req.file.path
    const result = await articles.findByIdAndUpdate(req.params.id, data, { new: true })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      return res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const deleteArticle = async (req, res) => {
  try {
    await articles.findByIdAndDelete(req.params.id)
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
