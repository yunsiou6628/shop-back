// 商品分類(修改)
import express from 'express'
import content from '../middleware/content.js'
import * as auth from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import {
  createCategory,
  getAllCategorys,
  getCategory,
  editCategory,
  deleteCategory
} from '../controllers/products_category.js'

const router = express.Router()

router.post('/', content('application/json'), auth.jwt, admin, createCategory)
router.get('/all', getAllCategorys)
router.get('/:id', getCategory)
router.patch('/:id', content('application/json'), auth.jwt, admin, editCategory)
router.delete('/:id', auth.jwt, admin, deleteCategory)

export default router
