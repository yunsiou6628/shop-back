// middleware - admin.js 管理員?
// (req, res, next) 三個代表寫 middleware ，四個 多 error 的是錯誤處理
export default (req, res, next) => {
  // console.log(req)
  // req.user => products.js 裡面的 auth.jwt 會把查到的資料放到 req.user 裡面 --> products.js => router.post('/', content('multipart/form-data'), auth.jwt, admin, upload, createProduct)
  if (req.user.role !== 1) {
    res.status(403).send({ success: false, message: '權限不足' })
  } else {
    next()
  }
}
