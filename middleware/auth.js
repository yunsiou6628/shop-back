// 中間驗證 middleware - auth.js 授權
// 把驗證規則 實際驗證資料
// 透過 posman 發出請求，這個請求會經過 middleware 加工請求，會有很多 像jwt/驗證身分/...

import passport from 'passport'
import jsonwebtoken from 'jsonwebtoken'

// 寫 function - 用 login 方式驗證， session: false => 不要存任何 session
// (err, user, info) => passport.js 的  done 傳出來的資料
// if (err || !user)=> 如果沒有錯誤或沒使用者，判斷錯誤訊息是什麼
// 如果是 Missing credentails 遺失認證，改成 message = '驗證錯誤'
// return 回傳 400 or 401 顯示驗證失敗
export const login = (req, res, next) => {
  passport.authenticate('login', { session: false }, (err, user, info) => {
    if (err || !user) {
      if (info.message === 'Missing credentials') info.message = '驗證錯誤'
      return res.status(401).send({ success: false, message: info.message })
    }
    // 把抓到的 user 帶進來 req.user 裡面，可直接對使用者做操作
    req.user = user
    next()
  })(req, res, next)
}

// 使用 passport 的 jwt 驗證方式
export const jwt = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, data, info) => {
    if (err || !data) {
      if (info instanceof jsonwebtoken.JsonWebTokenError) {
        return res.status(401).send({ success: false, message: '驗證錯誤' })
      } else {
        return res.status(401).send({ success: false, message: info.message })
        // 如果驗證都正確，找到 passport.js 的 return 回傳 message: '登入逾期' / '帳號不存在' / '密碼錯誤' 回去
      }
    }
    req.user = data.user
    req.token = data.token
    next()
  })(req, res, next)
}
