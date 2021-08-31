const {row, rows} = require("../../../database/pg")


const model = {
    addCourse: ({data: {title, info, lavel, tags, category_id, price}, imgName}) => {
     
     const sql = `insert into courses 
     (course_name, course_info, course_image, course_lavel, course_tags, course_price, category_id) 
     values ($1, coalesce($2, null), coalesce($3, null), $4, coalesce($5, null), $6, $7) returning *`

     return row(sql, title, info, imgName, lavel, tags, price, category_id)

    },
    addAuthor: (author_id, course_id) => {

        const sql = `insert into course_author(user_id, course_id) values ($1, $2) returning *`

        return row(sql, author_id, course_id)
    },

    deleteCourse: (id) => {

        const sql = `delete from courses where course_id = $1 returning *`

        return row(sql, id)
    },
    addTopic: (topic_name, course_id) => {

        const sql = `insert into topics (topic_name, course_id) values ($1, $2) returning *` 

        return row(sql, topic_name, course_id)
    },
    addVideo: ({video_name, video_link, topic_id, user_id, course_id}) => {

        const sql = `insert into videos (video_name, video_link, topic_id, user_id, course_id) values ($1, $2, $3, $4, $5) returning *`

        return row(sql, video_name, video_link, topic_id, user_id, course_id)
    },
    
}

module.exports.model = model