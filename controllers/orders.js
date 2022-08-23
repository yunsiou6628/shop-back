import users from '../models/userscart.js'
import orders from '../models/orders.js'

export const createOrder = async (req, res) => {
  try {
    if (req.user.cart.length === 0) {
      return res.status(400).send({ success: false, message: '購物車為空' })
    }
    let result = await users.findById(req.user._id, 'cart').populate('cart.product')
    const canCheckout = result.cart.every(item => item.product.sell)
    if (!canCheckout) {
      return res.status(400).send({ success: false, message: '包含下架商品' })
    }
    // console.log(req.user._id)
    // console.log(req.body)
    result = await orders.create({
      // 使用者 ID / 購物車
      user: req.user._id,
      products: req.user.cart,
      // 入山入園表單
      name: req.body.name,
      gender: req.body.gender,
      phone: req.body.phone,
      email: req.body.email,
      birthday: req.body.birthday,
      identification: req.body.identification,
      emergency_contact: req.body.emergencyContact,
      emergency_contact_phone: req.body.emergencyContactPhone,
      // --- 付款表單 ---
      // 信用卡 / 金融卡付款
      cardtype: req.body.cardtype,
      cardnumber: req.body.cardnumber,
      validitPeriod: req.body.validitPeriod,
      certification: req.body.certification,
      cardname: req.body.cardname,
      cardbirthday: req.body.cardbirthday,
      cardPhone: req.body.cardPhone,
      // LINE PAY / 街口支付付款 核對付款資料
      checkPay: req.body.checkPay,
      checkName: req.body.checkName,
      checkAccount: req.body.checkAccount,
      // ATM 轉帳付款 核對 ATM 轉帳資料
      atmcheckName: req.body.atmcheckName,
      atmcheckAccount: req.body.atmcheckAccount,
      atmcheckDay: req.body.atmcheckDay
      // model欄位 : 前台名稱
    })
    req.user.cart = []
    await req.user.save()
    res.status(200).send({ success: true, message: '', result: result._id })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getMyOrders = async (req, res) => {
  try {
    const result = await orders.find({ user: req.user._id }).populate('products.product')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getAllOrders = async (req, res) => {
  try {
    // .populate('user', 'account')
    // 自動抓 user 欄位對應的 ref 資料，只取 account 欄位
    // console.log(result)
    const result = await orders.find().populate('products.product').populate('user', 'account')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const deleteOrders = async (req, res) => {
  try {
    await orders.findByIdAndDelete(req.params.id)
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
