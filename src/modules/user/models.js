const {row, rows} = require("../../../database/pg")
const { search } = require("../teacher/routes")

const model = {
  checkUsername: ({username}) => {
   const sql = `select * from users where username = $1`

   return row(sql, username)
  },

  checkPhone: ({phone}) => {
  const sql = `select * from users where user_phone_number = $1`

  return row(sql, phone)
  },

  signUP: ({ first_name, last_name, username, phone, role}) => {

    const Sql = `
    insert into users (first_name, last_name, username, user_phone_number, role_id) values ($1, $2, $3, $4, $5) returning *
    `
    return row(Sql, first_name, last_name, username, phone, role)
  },

  signIn: (phone) => {

    const Sql = `
    select * from users where user_phone_number = $1`

    return row(Sql, phone)
  },

  signUpGoogle: ({given_name, family_name, picture, email, sub}) => {
    const Sql = `
    insert into users (first_name, last_name, username, user_email, password, role_id, user_avatar) values ($1, $2, $3, coalesce($4, null), crypt($5, gen_salt('bf')), $6, $7) returning *
    `

    return row(Sql, given_name, family_name, sub, email, sub, 1, picture)
  },

  signInGoogle: ({email, sub}) => {
    const Sql = `
      select * from users
      where user_email = $1 and password = crypt($2, password)
    `
   return row(Sql, email, sub)
  },
  
  MyCourses: (id) => {
    const sql = `select courses.course_id,
    course_name,course_image,course_level,
    course_duration, course_price, c.category_name, u.first_name, u.last_name, u.user_avatar, count(video_name) as video_count from courses left join users as u on courses.author_id = u.user_id left join categories as c on courses.category_id = c.category_id left join topics as t on courses.course_id = t.course_id left join videos on t.topic_id = videos.topic_id left join purchases as p on courses.course_id = p.course_id where p.user_id = $1 group by course_name, courses.course_id, c.category_id, u.first_name, u.last_name, u.user_avatar order by course_id desc limit 30`

    return rows(sql, id*1)
  },

  addComment: (user_id, course_id, content) => {
    const sql = `
      insert into comments (user_id, course_id, comment_content) values ($1, $2, $3) returning *
    `
    return row(sql, user_id, course_id, content)
  },

  
}



module.exports.model = model













