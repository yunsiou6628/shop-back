// controllers - products.js  => 商品新增/編輯/刪除/查詢
// controllers 呼叫 models 對 資料庫(mongo DB)做 "新增/編輯/刪除/查詢"的操作
// 接在 products.後面的動做 =>  mongoose 語法 (像是 create / find .....)

// import { json } from 'express'
import products from '../models/products.js'
import productsCategory from '../models/products_category.js'

// 新增商品 (進資料庫)
export const createProduct = async (req, res) => {
  try {
    // console.log(req.file)
    console.log(req.body.product_date)
    console.log(JSON.parse(req.body.product_date))
    // 去 products 資料庫 create 創建資料
    const result = await products.create({
      name: req.body.name,
      price: req.body.price,
      // JSON.parse(req.body.product_date) 把字串轉為物件，存進資料庫內
      product_date: JSON.parse(req.body.product_date),
      // product_date: new Date(req.body.product_date),
      // 把原本 req.body.product_date 改成 new Date(req.body.product_date)
      // product_date_start: req.body.product_date_start,
      // product_date_over: req.body.product_date_over,
      region: req.body.region,
      reserve: req.body.reserve,
      bulletin: req.body.bulletin,
      description: req.body.description,
      // 使用 ?. 可選串聯，設定圖片沒有上傳可能會沒圖片，若沒有上傳圖片 req.file 會是 undefine，對 undefine 的東西寫 .path 會出現錯誤，使用 ?. 可選串聯 就算沒有連到 req.file?.path 整個就是 undefine，如果是 undefine 就是空的 ''
      image: req.file?.path || '',
      sell: req.body.sell,
      sub: req.body.sub
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

// 已上架商品
// result => 所有上架商品 products.find({ sell: true }) 給到 result 的資料
export const getProducts = async (req, res) => {
  try {
    const result = await products.find({ sell: true })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 抓到已上架商品的小分類sub
export const getTypeProductssub = async (req, res) => {
  try {
    const result = await products.find({ sell: true, sub: req.body.sub })
    // const result = await products.find({ sub: req.body.sub })
    // console.log(result)
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 顯示所有(包含下架)商品，只有管理員可以看
export const getAllProducts = async (req, res) => {
  try {
    const result = await products.find()
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 單個 :id
export const getProduct = async (req, res) => {
  try {
    // params 路由參數
    // patch( '/products/' + form._id )
    // 前台路徑後面的欄位( + 後面的東西) = req.params.id
    const result = await products.findById(req.params.id).lean()
    const result2 = await productsCategory.findOne({ 'sub._id': result.sub })
    res.status(200).send({ success: true, message: '', result: { ...result, category: result2 } })
    // category: result2 資料欄位放到 => product.category = data.result.category
  } catch (error) {
    console.log(error)
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 編輯修改
export const editProduct = async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      price: req.body.price,
      product_date: JSON.parse(req.body.product_date),
      region: req.body.region,
      reserve: req.body.reserve,
      bulletin: req.body.bulletin,
      description: req.body.description,
      sell: req.body.sell,
      sub: req.body.sub
    }
    if (req.file) data.image = req.file.path
    const result = await products.findByIdAndUpdate(req.params.id, data, { new: true })
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

export const deleteProduct = async (req, res) => {
  try {
    await products.findByIdAndDelete(req.params.id)
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
