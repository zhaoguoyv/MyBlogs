const { db } = require('../Schema/config')
const ArticleSchema = require('../Schema/article')
const UserSchema = require('../Schema/user')
const CommentSchema = require('../Schema/comment')

const Article = db.model("articles", ArticleSchema)
const User = db.model("users", UserSchema)
const Comment = db.model("comments", CommentSchema)

exports.save = async ctx => {
  let message = {
    status: 0,
    msg: "登录才可发表评论！"
  }
  if(ctx.session.isNew) return ctx.body = message
  
  const data = ctx.request.body
  data.form = ctx.session.uid
  const _comment = new Comment(data)

  await _comment
    .save()
    .then(data => {
      message = {
        status: 1,
        msg: "评论成功！"
      }
      Article
        .update({_id: data.article}, {$inc: {commentNum: 1}}, err => {
          if(err) return console.log(err)
        })
      User
        .update({_id: data.form}, {$inc: {commentNum: 1}}, err => {
          if(err) return console.log(err)
        })
    })
    .catch(err => {
      message = {
        status: 0,
        msg: err
      }
    })
    ctx.body = message
}
