// article_column
// routes 路徑

import express from 'express'
import content from '../middleware/content.js'
import * as auth from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import upload from '../middleware/upload.js'
import {
  createArticle,
  getArticle,
  getAllArticle,
  getOneArticle,
  editArticle,
  deleteArticle
} from '../controllers/article_column.js'

const router = express.Router()

// 新增文章 upload 要放在 createProduct 之前，要有 createProduct 才會去下一個 middleware
// content => 判斷型態 ('multipart/form-data')=> 想判斷的型態(也可能是JSON)
// jwt判斷有沒有需要登入
// admin 判斷是不是管理員
// upload 把圖片上傳雲端(只限圖片)
router.post('/', content('multipart/form-data'), auth.jwt, admin, upload, createArticle)
// 抓取 只顯示已上架文章
router.get('/', getArticle)
// 抓取 顯示所有(包含未發布)文章，只有管理員可以看
router.get('/all', auth.jwt, admin, getAllArticle)
// 抓取 :id 單篇文章
router.get('/:id', getOneArticle)
// 更新
router.patch('/:id', content('multipart/form-data'), auth.jwt, admin, upload, editArticle)
// 刪除
router.delete('/:id', auth.jwt, admin, deleteArticle)

export default router
