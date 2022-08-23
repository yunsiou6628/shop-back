// middleware - upload.js 上傳?

import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

const upload = multer({
  storage: new CloudinaryStorage({ cloudinary }),
  fileFilter (req, file, cb) {
    // 如果 file 編碼類型，開頭是圖片
    if (!file.mimetype.startsWith('image')) {
      // 如果不是圖片開頭的話  cb = callback
      // 用一樣的錯誤類型格式，比較好錯誤處理
      cb(new multer.MulterError('LIMIT_FORMAT'), false)
    } else {
      cb(null, true)
    }
  },
  // 檔案大小
  limts: {
    fileSize: 1024 * 1024
    // 1024 bytes = 1 kb
  }
})

export default async (req, res, next) => {
  // console.log('經過upl')
  upload.single('image')(req, res, async error => {
    if (error instanceof multer.MulterError) {
      let message = '上傳失敗'
      if (error.code === 'LIMIT_FILE_SIZE') {
        message = '檔案太大'
      } else if (error.code === 'LIMIT_FORMAT') {
        message = '檔案格式錯誤'
      }
      res.status(400).send({ success: false, message })
    } else if (error) {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    } else {
      next()
      // next() => 去下一個 middleware ， 若沒有 next 請求會一直卡在 middleware 就不回傳出去
    }
  })
}
