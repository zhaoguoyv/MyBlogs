// 数据库设置模块

const mongoose = require('mongoose')
const db = mongoose.createConnection("mongodb://localhost:27017/myblogs", {useNewUrlParser: true})

// 用原生es6的promise取代mongoose自实现的promise
mongoose.Promise = global.Promise

db.on("error", () => {
    console.log("数据库连接失败...")
})

db.on("open", () => {
    console.log("数据库连接成功...")
})

// 在操作数据库之前，要使用Schema设置每个字段的数据类型
const Schema = mongoose.Schema

module.exports = {
    db,
    Schema
}
