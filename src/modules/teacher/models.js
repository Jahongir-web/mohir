const {row, rows} = require("../../../database/pg")


const model = {
    addCourse: (title, info, level, tags, category_id, price, author_id, imgName) => {
     
     const sql = `insert into courses 
     (course_name, course_info, course_image, course_level, course_tags, course_price, category_id, author_id) 
     values ($1, coalesce($2, null), coalesce($3, null), $4, coalesce($5, null), $6, $7, $8) returning *`

     return row(sql, title, info, imgName, level, tags, price, category_id, author_id)
    },

    addAuthor: (author_id, course_id) => {

        const sql = `insert into course_author(user_id, course_id) values ($1, $2) returning *`

        return row(sql, author_id, course_id)
    },

    updateCourse: (course_id, intro_link, duration, course_profit, course_requirements, for_who) => {

        const sql = `update courses set course_intro_video = $2, course_duration = $3, course_profit = $4, course_requirements = $5, course_for_who = $6 where course_id = $1 returning *`

        return row(sql, course_id, intro_link, duration, course_profit, course_requirements, for_who)
    },

    publishCourse: (course_id) => {

        const sql = `update courses set course_ready = true where course_id = $1 returning *`

        return row(sql, course_id)
    },

    deleteAuthor: (id) => {

        const sql = `delete from course_author where course_id = $1 returning *`

        return row(sql, id)
    },

    deleteCourse: (id) => {

        const sql = `delete from courses where course_id = $1 returning *`

        return row(sql, id)
    },

    addTopic: (topic_name, course_id) => {
        const sql = `insert into topics (topic_name, course_id) values ($1, $2) returning *` 

        return row(sql, topic_name, course_id)
    },

    deleteTopic: (id) => {
        const sql = `
            delete from topics where topic_id = $1 returning *
        `
        return row(sql, id)
    },

    addVideo: (title, link, topic_id, material, info) => {
        const sql = `insert into videos (video_name, video_link, topic_id, video_material, video_info) values ($1, $2, $3, coalesce($4, null), coalesce($5, null)) returning *`

        return row(sql, title, link, topic_id, material, info)
    },

    addQuiz: (video_id, title, info) => {
        const sql = `insert into quiz (video_id, quiz_title, quiz_info) values ($1, $2, $3) returning *`

        return row(sql, video_id, title, info)
    },

    addQuestion: (quiz_id, text, type) => {
        const sql = `insert into questions (quiz_id, question_text, type_id) values ($1, $2, $3) returning *`

        return row(sql, quiz_id, text, type)
    },

    addAnswer: (question_id, text, is_correct) => {
        const sql = `insert into answers (question_id, answer_text, is_correct) values ($1, $2, $3) returning *`

        return row(sql, question_id, text, is_correct)
    },
    
    deleteVideo: (id) => {
        const sql = `
            delete from videos where video_id = $1 returning *
        `
        return row(sql, id)
    },

    addBlog: (title, content, imgName, user_id) => {
      const sql = `
        insert into blogs (blog_title, blog_content, blog_image, user_id) values ($1, $2, $3, $4) returning *
      `
      return row(sql, title, content, imgName, user_id)
    },
    
    addBlogCategory: (category_id, blog_id) => {
      const sql = `
      insert into categories_blog(category_id, blog_id) values ($1, $2) returning *
      `
      return row(sql, category_id, blog_id)
    },
    
    deleteBlogCategory: (id) => {
        const sql = `
        delete from categories_blog where blog_id = $1 returning *
        `
        return row(sql, id)
    },

    deleteBlog: (id) => {
        const sql = `
        delete from blogs where blog_id = $1 returning *
        `
        return row(sql, id)
    },
}

module.exports.model = model