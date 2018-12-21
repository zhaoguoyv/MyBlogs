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

exports.comlist = async ctx => {
  const uid = ctx.session.uid

  const data = await Comment.find({form: uid}).populate("article", "title")

  ctx.body = {
    code: 0,
    count: data.length,
    data,
  }
}

exports.del = async ctx => {
  const commentId = ctx.params.id

  let isOK = true
  let articleId, uid

  await Comment.findById(commentId, (err, data) => {
    if(err){
      isOK = false
      return
    }else{
      articleId = data.article
      uid = data.form
    }
  })

  await Article.update({_id: articleId}, {$inc: {commentNum: -1}})
  await User.update({_id: uid}, {$inc: {commentNum: -1}})
  await Comment.deleteOne({_id: commentId})

  if(isOK){
    ctx.body = {
      state: 1,
      message: "删除成功！"
    }
  }
}
