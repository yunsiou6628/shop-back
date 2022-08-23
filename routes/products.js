// 商品
// routes 路徑

import express from 'express'
import content from '../middleware/content.js'
import * as auth from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import upload from '../middleware/upload.js'
import {
  createProduct,
  getProducts,
  getTypeProductssub,
  getAllProducts,
  getProduct,
  editProduct,
  deleteProduct
} from '../controllers/products.js'

const router = express.Router()

// 新增商品 upload 要放在 createProduct 之前，要有 createProduct 才會去下一個 middleware
// content => 判斷型態 ('multipart/form-data')=> 想判斷的型態(也可能是JSON)
// jwt判斷有沒有需要登入
// admin 判斷是不是管理員
// upload 把圖片上船雲端(只限圖片)
router.post('/', content('multipart/form-data'), auth.jwt, admin, upload, createProduct)
// 抓取 只顯示已上架商品
router.get('/', getProducts)
// 抓取 顯示已上架商品的小分類sub
router.post('/sub', content('application/json'), getTypeProductssub)
// 抓取 顯示所有(包含下架)商品，只有管理員可以看
router.get('/all', auth.jwt, admin, getAllProducts)
// 抓取 單個 :id 商品頁
router.get('/:id', getProduct)
// 更新
router.patch('/:id', content('multipart/form-data'), auth.jwt, admin, upload, editProduct)
router.delete('/:id', auth.jwt, admin, deleteProduct)

export default router
