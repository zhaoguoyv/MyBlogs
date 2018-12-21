const { Schema } = require('./config')
const ObjectId = Schema.Types.ObjectId

const CommentSchema = new Schema({
  content: String,
  form: {
    type: ObjectId,
    ref: "users"
  },
  article: {
    type: ObjectId,
    ref: "articles"
  }
}, {
    versionKey: false,
    timestamps: {
        createdAt: "created"    // 设置创建时间参数名
    }
})

module.exports = CommentSchema 
