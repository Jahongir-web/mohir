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

    return row(Sql, name, last_name, username.toLowerCase(), email, password, role)
  },

  signIn: ({username, password}) => {

    const Sql = `
    select * from users
    where username = $1 and password = crypt($2, password)
   `
   return row(Sql, username.toLowerCase(), password)
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
  }

 
}



module.exports.model = model













