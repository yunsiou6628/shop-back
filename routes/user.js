// 使用者
// routes 路徑

import express from 'express'
import * as auth from '../middleware/auth.js'
import content from '../middleware/content.js'
import admin from '../middleware/admin.js'
import {
  register,
  login,
  logout,
  extend,
  getUser,
  getAllUser,
  deleteUser,
  addCart,
  editCart,
  getCart
} from '../controllers/user.js'

const router = express.Router()

// 註冊、登入、登出、舊換新、取遞資料
router.post('/', content('application/json'), register)
router.post('/login', content('application/json'), auth.login, login)
// 先驗證資料格式內容類型 content('application./json')-再去跑 passport 的 auth.login -最後再去跑自己的 controllers login
router.delete('/logout', auth.jwt, logout)
router.post('/extend', auth.jwt, extend)
router.get('/', auth.jwt, getUser)
router.get('/all', auth.jwt, getAllUser)
router.delete('/:id', auth.jwt, admin, deleteUser)
router.post('/cart', content('application/json'), auth.jwt, addCart)
router.patch('/cart', content('application/json'), auth.jwt, editCart)
router.get('/cart', auth.jwt, getCart)

// ***** 增加後台路徑資料 *****

export default router
