const {row, rows} = require("../../../database/pg")


const model = {
    addCourse: ({data: {title, info, level, tags, category_id, price}, imgName}) => {
     
     const sql = `insert into courses 
     (course_name, course_info, course_image, course_level, course_tags, course_price, category_id) 
     values ($1, coalesce($2, null), coalesce($3, null), $4, coalesce($5, null), $6, $7) returning *`

     return row(sql, title, info, imgName, level, tags, price, category_id)

    },
    addAuthor: (author_id, course_id) => {

        const sql = `insert into course_author(user_id, course_id) values ($1, $2) returning *`

        return row(sql, author_id, course_id)
    },

    updateCourse: (course_id, intro_link, duration, course_profit, course_requirements, for_who) => {

        const sql = `update courses set course_intro_video = $2, course_duration = $3, course_profit = $4, course_requirements = $5, course_for_who = $6 where course_id = $1 returning *`

        return row(sql, course_id, intro_link, duration, course_profit, course_requirements, for_who)
    },

    deleteCourse: (id) => {

        const sql = `delete from courses where course_id = $1 returning *`

        return row(sql, id)
    },

    addTopic: (topic_name, course_id) => {
        const sql = `insert into topics (topic_name, course_id) values ($1, $2) returning *` 

        return row(sql, topic_name, course_id)
    },

    addVideo: (title, link, topic_id, material, info) => {
        const sql = `insert into videos (video_name, video_link, topic_id, video_material, video_info) values ($1, $2, $3, coalesce($4, null), coalesce($5, null)) returning *`

        return row(sql, title, link, topic_id, material, info)
    },
    
}

module.exports.model = model