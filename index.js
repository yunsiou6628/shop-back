// index => 主要是連接資料庫後，再根據前台傳送進來的請求，讓它做不同的事情
import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

import './passport/passport.js'
import userRoute from './routes/user.js'
import productsRoute from './routes/products.js'
import categoryRoute from './routes/products_category.js'
import ordersRoute from './routes/orders.js'

mongoose.connect(process.env.DB_URL) // 連接資料庫(.env)

const app = express()

// cors 限制前台連到後台的網址，限制 github 跟 localhost 可以傳入
app.use(cors({
  origin (origin, callback) {
    if (origin === undefined || origin.includes('github') || origin.includes('localhost')) {
      callback(null, true)
    } else {
      callback(new Error('Not Allowed'), false)
    }
  }
}))
app.use((_, req, res, next) => {
  res.status(400).send({ success: false, message: '請求被拒' })
})

// 錯誤處理要跟 json 一起
app.use(express.json())
app.use((_, req, res, next) => {
  res.status(400).send({ success: false, message: '請求格式錯誤' })
})

// 位置應該放在錯誤處理後，進路由 Route，最後才會進到找不到，放錯位置會導致在還沒處理錯誤就先回傳找不到
app.use('/users', userRoute)
app.use('/products', productsRoute)
app.use('/products_category', categoryRoute)
app.use('/orders', ordersRoute)

app.all('*', (req, res) => {
  res.status(404).send({ success: false, message: '找不到' })
})

app.listen(process.env.PORT || 4000, () => {
  console.log('Server is running')
})
