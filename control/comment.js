const Article = require('../Models/article')
const User = require('../Models/user')
const Comment = require('../Models/comment')

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

  let res = {
    state: 1,
    message: "删除成功！"
  }

  Comment.findById(commentId)
    .then(data => data.remove())
    .catch(err => {
      res = {
        state: 0,
        message: err
      }
    })

    ctx.body = res
}
