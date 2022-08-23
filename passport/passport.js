// 驗證策略 passport (登入登出驗證策略)

// ***** 增加 判斷 後台登入 *****

import passport from 'passport'
import passportJWT from 'passport-jwt'
import passportLocal from 'passport-local'
import bcrypt from 'bcrypt' // 加密
import users from '../models/userscart.js'

// 登入 login 策略
const LocalStrategy = passportLocal.Strategy
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

// 使用新的 LocalStrategy 帳號密碼驗證驗的策略，建立 login 的驗證方法
// 制定使用者名稱欄位，重新命名為'account''password'預設符合資料欄位
//  async (account, password, done) => {} 指驗證過後要執行的 function / done 執行下一步的動作
passport.use('login', new LocalStrategy({
  usernameField: 'account',
  passwordField: 'password'
}, async (account, password, done) => {
  try {
    const user = await users.findOne({ account })
    // 驗證過後 去資料庫找有沒有這個人
    if (!user) {
      // 資料庫 無找到 account，回 '帳號不存在'
      return done(null, false, { message: '帳號不存在' })
    }
    // 資料庫 有找到 account，但密碼不一樣，回 '密碼錯誤'
    if (!bcrypt.compareSync(password, user.password)) {
      return done(null, false, { message: '密碼錯誤' })
    }
    return done(null, user)
  } catch (error) {
    return done(error, false)
  }
}))

// 建立新的 jwt 策略
// use('jwt', new JWTStrategy => 使用 JWTStrategy 驗證策略 去建立 'jwt' 的驗證方式
// jwtFromRequest => jwt 綁定 Request，jwt 從請求 fromAuthHeaderAsBearerToken() 的 Token 抓出 ExtractJWT
// SECRET=> 從環境變數把 SECRET 拉出來，這是解密 jwt 的密鑰，不要直接寫進程式碼裡面
// passReqToCallback: true => 把 req 傳進 Callback 裡面，舊換新路由，讓他不要去執行過期的驗證
// ignoreExpiration: true => 忽略過期，要寫過期驗證
passport.use('jwt', new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET,
  passReqToCallback: true,
  ignoreExpiration: true
}, async (req, payload, done) => {
  // payload.exp => jwt 過期單位是秒鐘 *1000 轉換成毫秒 / Date.now() => node.js 單位是毫秒 (判斷有沒有過期)
  const expired = payload.exp * 1000 < Date.now()
  // if (過期了 && 路由 !== '/users/extend'舊換新 && 路由 !== '/users/logout'登出) {就是 登入逾期}
  if (expired && req.originalUrl !== '/users/extend' && req.originalUrl !== '/users/logout') {
    return done(null, false, { message: '登入逾期' })
  }
  // 若沒有逾期，就把資料傳回去原來地方
  // 取出 token
  const token = req.headers.authorization.split(' ')[1]
  try {
    const user = await users.findById(payload._id)
    if (!user) {
      return done(null, false, { message: '使用者不存在' })
    }
    if (user.tokens.indexOf(token) === -1) {
      return done(null, false, { message: '驗證錯誤' })
    }
    return done(null, { user, token })
  } catch (error) {
    return done(error, false)
  }
}))
