import express from 'express'
import admin from '../middleware/admin.js'
import * as auth from '../middleware/auth.js'
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  deleteOrders
} from '../controllers/orders.js'

const router = express.Router()

router.post('/', auth.jwt, createOrder)
router.get('/getMyOrders', auth.jwt, getMyOrders)
router.get('/all', auth.jwt, admin, getAllOrders)
router.delete('/:id', auth.jwt, admin, deleteOrders)

export default router
