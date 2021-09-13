const {row, rows} = require("../../../database/pg")


const model = {

    categories: () => {
     
     const sql = `select * from categories`   

     return rows(sql)
    },

    courses: () => {
        const sql = `select courses.course_id,
        course_name,course_image,course_level,
        course_duration, course_price, c.category_name, course_author.user_id, u.first_name, u.last_name, u.user_avatar, count(video_name) as video_count from courses left join course_author on courses.course_id = course_author.course_id left join users as u on course_author.user_id = u.user_id left join categories as c on courses.category_id = c.category_id left join topics as t on courses.course_id = t.course_id left join videos on t.topic_id = videos.topic_id group by course_name, courses.course_id, c.category_id, course_author.user_id, u.first_name, u.last_name, u.user_avatar order by course_id desc limit 3`

        return rows(sql)
    },

    freeCourses: () => {
        const sql = `select courses.course_id,
        course_name,course_image,course_level,
        course_duration, course_price, c.category_name, course_author.user_id, u.first_name, u.last_name, u.user_avatar, count(video_name) as video_count from courses left join course_author on courses.course_id = course_author.course_id left join users as u on course_author.user_id = u.user_id left join categories as c on courses.category_id = c.category_id left join topics as t on courses.course_id = t.course_id left join videos on t.topic_id = videos.topic_id  where course_price = '0' group by course_name, courses.course_id, c.category_id, course_author.user_id, u.first_name, u.last_name, u.user_avatar order by course_id desc limit 3`

        return rows(sql)
    },

    freeCoursesByCategory: (id) => {
        const sql = `select courses.course_id,
        course_name,course_image,course_level,
        course_duration, course_price, c.category_name, course_author.user_id, u.first_name, u.last_name, u.user_avatar, count(video_name) as video_count from courses left join course_author on courses.course_id = course_author.course_id left join users as u on course_author.user_id = u.user_id left join categories as c on courses.category_id = c.category_id left join topics as t on courses.course_id = t.course_id left join videos on t.topic_id = videos.topic_id  where course_price = '0' and c.category_id = $1 group by course_name, courses.course_id, c.category_id, course_author.user_id, u.first_name, u.last_name, u.user_avatar order by course_id desc limit 3`

        return rows(sql, id*1)
    },

    searchCourses: (title) => {
        const sql = `select courses.course_id,
        course_name,course_image,course_level,
        course_duration, course_price, c.category_name, course_author.user_id, u.first_name, u.last_name, u.user_avatar, count(video_name) as video_count from courses left join course_author on courses.course_id = course_author.course_id left join users as u on course_author.user_id = u.user_id left join categories as c on courses.category_id = c.category_id left join topics as t on courses.course_id = t.course_id left join videos on t.topic_id = videos.topic_id  where course_name ilike $1 group by course_name, courses.course_id, c.category_id, course_author.user_id, u.first_name, u.last_name, u.user_avatar`

        return rows(sql, `%${title}%`)
    },

    coursesByCategoryId: (id) => {
        const sql = `select courses.course_id,
        course_name,course_image,course_level,
        course_duration, course_price, c.category_name, course_author.user_id, u.first_name, u.last_name, u.user_avatar, count(video_name) as video_count from courses left join course_author on courses.course_id = course_author.course_id left join users as u on course_author.user_id = u.user_id left join categories as c on courses.category_id = c.category_id left join topics as t on courses.course_id = t.course_id left join videos on t.topic_id = videos.topic_id  where c.category_id = $1 group by course_name, courses.course_id, c.category_id, course_author.user_id, u.first_name, u.last_name, u.user_avatar order by course_id desc limit 3`

        return rows(sql, id*1)
    }
}

module.exports.model = model