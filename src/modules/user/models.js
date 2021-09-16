const {row, rows} = require("../../../database/pg")
const { search } = require("../teacher/routes")

const model = {
  checkUsername: ({username}) => {
   const sql = `select * from users where username = $1`

   return row(sql, username)
  },
  checkEmail: ({email}) => {
  const sql = `select * from users where user_email = $1`

  return row(sql, email)
  },
  signUP: ({name, last_name, username, email, password, role}) => {

    const Sql = `
    insert into users (first_name, last_name, username, user_email, password, role_id) values ($1, $2, $3, coalesce($4, null), crypt($5, gen_salt('bf')), $6) returning *
    `

    return row(Sql, name, last_name, username, email, password, role)
  },

  signIn: ({username, password}) => {

    const Sql = `
    select * from users
    where username = $1 and password = crypt($2, password)
   `
   return row(Sql, username, password)
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
    course_duration, course_price, c.category_name, course_author.user_id, u.first_name, u.last_name, u.user_avatar, count(video_name) as video_count from courses left join course_author on courses.course_id = course_author.course_id left join users as u on course_author.user_id = u.user_id left join categories as c on courses.category_id = c.category_id left join topics as t on courses.course_id = t.course_id left join videos on t.topic_id = videos.topic_id left join purchases as p on courses.course_id = p.course_id where p.user_id = $1 group by course_name, courses.course_id, c.category_id, course_author.user_id, u.first_name, u.last_name, u.user_avatar order by course_id desc limit 30`

    return rows(sql, id*1)
  }

 
}



module.exports.model = model













