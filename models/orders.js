// 訂單 models (Schema資料型態)

import mongoose from 'mongoose'
import validator from 'validator'

const schema = new mongoose.Schema({
  // 存是誰的訂單
  user: {
    type: mongoose.ObjectId,
    ref: 'users'
  },
  products: [
    {
      product: {
        type: mongoose.ObjectId,
        ref: 'products',
        required: [true, '商品欄位未填寫']
      },
      quantity: {
        type: Number,
        required: [true, '數量欄位未填寫']
      }
    }
  ],
  // 存入山入園資料
  name: {
    type: String,
    required: [true, '名字欄位未填寫']
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
  // 性別 用 1.男 2.女 3.其他 輸入數字
  gender: {
    type: Number,
    required: [true, '性別欄位未勾選']
  },
  birthday: {
    type: Date,
    required: [true, '生日欄位未填寫']
  },
  // line_id: {
  //   type: String,
  //   required: [true, 'line_id欄位未填寫']
  // },
  phone: {
    // 數字型態的話開頭 0 會不見，用文字就不會有這個問題
    type: String,
    required: [true, '手機欄位未填寫'],
    validator: {
      validator (phone) {
        return validator.isMobilePhone(phone, 'zh-TW')
      },
      message: '手機格式錯誤'
    }
  },
  // 身分證
  identification: {
    type: String,
    required: [true, '身分證欄位未填寫'],
    validator: {
      validator (identification) {
        return validator.isIdentityCard(identification, 'zh-TW')
      },
      message: '身分證格式錯誤'
    }
  },
  // 緊急聯絡人
  emergency_contact: {
    type: String,
    required: [true, '緊急聯絡人欄位未填寫']
  },
  emergency_contact_phone: {
    type: String,
    required: [true, '緊急聯絡人電話欄位未填寫'],
    validator: {
      validator (phone) {
        return validator.isMobilePhone(phone, 'zh-TW')
      },
      message: '手機格式錯誤'
    }
  },
  // --- 付款表單 ---
  // 信用卡 / 金融卡付款
  cardtype: {
    type: Object
    // required: [true, '信用卡類別未勾選']
  },
  cardnumber: {
    type: String
    // required: [true, '信用卡卡號未填寫']
  },
  validitPeriod: {
    type: String
    // required: [true, '卡號有效期限未填寫']
  },
  certification: {
    type: String
    // required: [true, '信用卡認證碼未填寫']
  },
  cardname: {
    type: String
    // required: [true, '持卡人姓名未填寫']
  },
  cardbirthday: {
    type: String
    // required: [true, '持卡人生日未填寫']
  },
  cardPhone: {
    type: String
    // required: [true, '持卡人手機未填寫'],
    // validator: {
    //   validator(phone) {
    //     return validator.isMobilePhone(phone, 'zh-TW')
    //   },
    //   message: '手機格式錯誤'
    // }
  },
  // LINE PAY / 街口支付付款 核對付款資料
  checkPay: {
    type: Object
    // required: [true, '付款方式未填寫']
  },
  checkName: {
    type: String
    // required: [true, '姓名未填寫']
  },
  checkAccount: {
    type: String
    // required: [true, '帳戶後五碼']
  },
  // ATM 轉帳付款 核對 ATM 轉帳資料
  atmcheckName: {
    type: String
    // required: [true, '姓名未填寫']
  },
  atmcheckAccount: {
    type: String
    // required: [true, '帳戶後五碼']
  },
  atmcheckDay: {
    type: String
    // required: [true, '帳戶後五碼']
  }
}, { versionKey: false }) // 移除 versionKey、__V

export default mongoose.model('orders', schema)
