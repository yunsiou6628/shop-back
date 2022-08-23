// 商品分類
// 寫分類商品 新增編輯刪除

// -----------------------------------------------------------------------------------------------------------------

import productsCategory from '../models/products_category.js'

// 商品分類測試加資料用(假資料建立)
// const data = [
//   {
//     // 郊山/小百岳 1000公尺以下(1天)
//     category: '小百岳',
//     sub: [
//       { name: '郊山訓練' },
//       { name: '小百岳縱走' }
//     ]
//   },
//   {
//     // 1000公尺以下(1-2天)
//     category: '步道',
//     sub: [
//       { name: '歷史古道' },
//       { name: '秘境步道' }
//     ]
//   },
//   {
//     // 1500-3000公尺
//     category: '中級山',
//     sub: [
//       { name: '中級山入門行程' },
//       { name: '中級山進階行程' }
//     ]
//   },
//   {
//     // 3000公尺以上
//     category: '百岳',
//     sub: [
//       { name: '百岳新手推薦' },
//       { name: '百岳入門行程' },
//       { name: '百岳進階行程' }
//     ]
//   }
// ]
// for (const a of data) {
//   productsCategory.create(a)
// }

// ------------------------------------------------------------------------------------------------

// 新增商品
export const createCategory = async (req, res) => {
  try {
    console.log(req.body)
    const result = await productsCategory.create({
      category: req.body.category,
      sub: req.body.sub
      // sub: [{ name: req.body.sub }]
    })
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

// 顯示所有(包含下架)商品，只有管理員可以看
export const getAllCategorys = async (req, res) => {
  try {
    // console.log('here')
    const result = await productsCategory.find()
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 單個 :id
export const getCategory = async (req, res) => {
  try {
    // params 路由參數
    const result = await productsCategory.findById(req.params.id)
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 編輯修改
export const editCategory = async (req, res) => {
  try {
    const data = {
      category: req.body.category,
      sub: req.body.sub
    }
    const result = await productsCategory.findByIdAndUpdate(req.params.id, data, { new: true })
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

export const deleteCategory = async (req, res) => {
  try {
    await productsCategory.findByIdAndDelete(req.params.id)
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
