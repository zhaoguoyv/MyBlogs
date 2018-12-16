// 加密模块

const crypto = require('crypto')

module.exports = (password, KEY = "zgy cool") => {
    const hmac = crypto.createHmac("sha256", KEY)
    hmac.update(password)
    const passwordHmac = hmac.digest("hex")
    return passwordHmac
}
