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

// 设置评论 remove 钩子 
// pre 前置钩子 删除事件发生之前执行
// post 后置钩子 同样在删除事件发生之前执行 只是在所有钩子的最后
// findByID... 不会触发钩子 钩子只能监听原型上的方法

CommentSchema.post("remove", doc => {
  const Article = require("../Models/article")
  const User = require("../Models/user")

  const { form, article } = doc

  Article.updateOne({_id: article}, {$inc: {commentNum: -1}}).exec()

  User.updateOne({_id: form}, {$inc: {commentNum: -1}}).exec()

})

module.exports = CommentSchema 
