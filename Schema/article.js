const { Schema } = require('./config')
const ObjectId = Schema.Types.ObjectId

const ArticleSchema = new Schema({
    title: String,
    author: {
        type: ObjectId,
        ref: "users"
    },  // 关联 users 的表
    content: String,
    tips: String,
}, {
    versionKey: false,
    timestamps: {
        createdAt: "created"    // 设置创建时间参数名
    }
})

module.exports = ArticleSchema
