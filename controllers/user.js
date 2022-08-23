// controllers - user.js => 使用者新增/編輯/刪除/查詢
// controllers 呼叫 models 對 資料庫(mongo DB)做 "新增/編輯/刪除/查詢"的操作

import users from '../models/userscart.js'
import products from '../models/products.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
// import orders from '../models/orders.js'

// 內容格式驗證

// 註冊
export const register = async (req, res) => {
  // if (!req.headers['content-type'] || !req.headers['content-type'].includes('application/json')) {
  //   return res.status(400).send({ success: false, message: '資料格式錯誤' })
  // }
  // => 移到 middleware - content.js 去寫

  // 密碼驗證
  const password = req.body.password
  if (!password) {
    res.status(400).send({ success: false, message: '缺少密碼欄位' })
    return
  }
  if (password.length < 4) {
    return res.status(400).send({ success: false, message: '密碼必須 4 個字以上' })
  }
  if (password.length > 20) {
    return res.status(400).send({ success: false, message: '密碼必須 20 個字以下' })
  }
  if (!password.match(/^[A-Za-z0-9]+$/)) {
    return res.status(400).send({ success: false, message: '密碼格式錯誤' })
  }
  req.body.password = bcrypt.hashSync(password, 10)
  try {
    await users.create(req.body)
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    console.log(error)
    // 可能會有的錯誤
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      return res.status(400).send({ success: false, message })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(400).send({ success: false, message: '帳號已存在' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

// 登入
export const login = async (req, res) => {
  // if (!req.headers['content-type'] || !req.headers['content-type'].includes('application/json')) {
  //   return res.status(400).send({ success: false, message: '資料格式錯誤' })
  // }
  // => 移到 middleware - content.js 去寫
  try {
    const token = jwt.sign({ _id: req.user._id }, process.env.SECRET, { expiresIn: '7 days' })
    req.user.tokens.push(token)
    await req.user.save()
    res.status(200).send({
      success: true,
      message: '',
      // 把前台會用到的資料傳回去
      result: {
        token,
        account: req.user.account,
        email: req.user.email,
        cart: req.user.cart.length,
        role: req.user.role
        // role 管理員權限
      }
    })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 登出
export const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token !== req.token)
    await req.user.save()
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 舊換新
export const extend = async (req, res) => {
  try {
    const idx = req.user.tokens.findIndex(token => token === req.token)
    const token = jwt.sign({ _id: req.user._id }, process.env.SECRET, { expiresIn: '7 days' })
    req.user.tokens[idx] = token
    await req.user.save()
    res.status(200).send({ success: true, message: '', result: token })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 取遞資料
export const getUser = (req, res) => {
  try {
    console.log(req.user)
    res.status(200).send({
      success: true,
      message: '',
      // 把前台會用到的資料傳回去
      result: {
        account: req.user.account,
        email: req.user.email,
        cart: req.user.cart.length,
        role: req.user.role
        // role 管理員權限
      }
    })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 顯示所有會員資料，只有管理員可以看
export const getAllUser = async (req, res) => {
  try {
    const result = await users.find()
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const addCart = async (req, res) => {
  try {
    // 驗證商品
    const result = await products.findById(req.body.product)
    // 沒找到或已下架
    if (!result || !result.sell) {
      return res.status(404).send({ success: false, message: '商品不存在' })
    }
    // 找購物車有沒有這個商品
    const idx = req.user.cart.findIndex(item => item.product.toString() === req.body.product)
    if (idx > -1) {
      req.user.cart[idx].quantity += req.body.quantity
    } else {
      req.user.cart.push({
        product: req.body.product,
        quantity: req.body.quantity
      })
    }
    await req.user.save()
    res.status(200).send({ success: true, message: '', result: req.user.cart.length })
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

export const editCart = async (req, res) => {
  try {
    if (req.body.quantity <= 0) {
      await users.findOneAndUpdate(
        { _id: req.user._id, 'cart.product': req.body.product },
        {
          $pull: {
            cart: { product: req.body.product }
          }
        }
      )
      // const idx = req.user.cart.findIndex(item => item.product.toString() === req.body.product)
      // req.user.cart.splice(idx, 1)
      // await req.user.save()
    } else {
      await users.findOneAndUpdate(
        { _id: req.user._id, 'cart.product': req.body.product },
        {
          $set: {
            // $ 代表符合陣列搜尋條件的索引
            'cart.$.quantity': req.body.quantity
          }
        }
      )
      // const idx = req.user.cart.findIndex(item => item.product.toString() === req.body.product)
      // req.user.cart[idx].quantity = req.body.quantity
      // await req.user.save()
    }
    res.status(200).send({ success: true, message: '' })
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

export const getCart = async (req, res) => {
  try {
    const result = await users.findById(req.user._id, 'cart').populate('cart.product')
    res.status(200).send({ success: true, message: '', result: result.cart })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

// 刪除使用者
export const deleteUser = async (req, res) => {
  try {
    await users.findByIdAndDelete(req.params.id)
    // 刪除使用者時訂單所有資料一次一起刪除
    // await orders.deleteMany({ user: req.params.id })
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
