// 使用者 models (Schema資料型態)

import mongoose from 'mongoose'
import validator from 'validator'
// validator 偵錯套件 => https://www.npmjs.com/package/validator

// 存使用者 帳號、密碼、信箱、使用者登入的 jwt、購物車
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '名字欄位未填寫']
  },
  account: {
    type: String,
    // required 必填
    required: [true, '帳號欄位未填寫'],
    minlength: [4, '帳號必須 4 個字以上'],
    maxlength: [20, '帳號必須 20 個字以下'],
    // unique 避免重複註冊
    unique: true,
    match: [/^[A-Za-z0-9]+$/, '帳號格式錯誤']
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: [true, '信箱欄位未填寫'],
    // unique 避免重複
    unique: true,
    // 驗證
    validator: {
      validator (email) {
        return validator.isEmail(email)
      },
      message: '信箱格式錯誤'
    }
  },
  // 性別 用 1.男 2.女
  // gender: {
  //   type: Number
  // required: [true, '性別欄位未勾選']
  // },
  // birthday: {
  //   type: Number
  // required: [true, '生日欄位未填寫']
  // },
  // line_id: {
  //   type: String
  // required: [true, 'line_id欄位未填寫']
  // },
  // phone: {
  // 數字型態的話開頭 0 會不見，用文字就不會有這個問題
  // type: String
  // required: [true, '手機欄位未填寫'],
  // validator: {
  //   validator(phone) {
  //     return validator.isMobilePhone(phone, 'zh-TW')
  //   },
  //   message: '手機格式錯誤'
  // }
  // },
  // 身分證
  // identification: {
  //   type: String
  // required: [true, '身分證欄位未填寫'],
  // validator: {
  //   validator(identification) {
  //     return validator.isIdentityCard(identification, 'zh-TW')
  //   },
  //   message: '身分證格式錯誤'
  // }
  // },
  // 緊急聯絡人
  // emergency_contact: {
  //   type: String
  // required: [true, '緊急聯絡人欄位未填寫']
  // },
  // emergency_contact_phone: {
  //   type: Number
  // required: [true, '緊急聯絡人電話欄位未填寫'],
  // validator: {
  //   validator(phone) {
  //     return validator.isMobilePhone(phone, 'zh-TW')
  //   },
  //   message: '手機格式錯誤'
  // }
  // },
  // 使用者登入的 jwt
  tokens: {
    type: [String]
  },
  // 購物車 type [{ 陣列包內容物 }]
  cart: {
    type: [
      {
        // 使用者購買商品
        product: {
          type: mongoose.ObjectId,
          ref: 'products'
          // required: [true, '商品欄位未填寫']
        },
        // 使用者購買數量
        quantity: {
          type: Number
          // required: [true, '數量欄位未填寫']
        }
      }
    ]
  },
  role: {
    // 0 = 使用者
    // 1 = 管理員
    type: Number,
    default: 0
    // 若要前台分兩頁寫(會在 middleware - admin 檔案改寫 req , 前台 LoginView 會有 2 頁寫登入)
  }
}, { versionKey: false }) // 移除 versionKey、__V

export default mongoose.model('users', schema)
