// middleware - content.js 內容
// 把 controllers 的 user.js 內容類型 => 抓出來寫(不然會一直重複寫)

// content-type 驗證型態
// 寫 middleware 一定要有 (req, res, next)
export default (type) => {
  return (req, res, next) => {
    if (!req.headers['content-type'] || !req.headers['content-type'].includes(type)) {
      return res.status(400).send({ success: false, message: '資料格式錯誤' })
      // 如果 (請求沒有 內容類型) 或 (內容類型 不是json )
      // return 400錯誤 / message: 資料格式錯誤
    }
    next()
    // next() 執行下一步，需在 next 前，透過 req 把東西帶入進去
  }
}
