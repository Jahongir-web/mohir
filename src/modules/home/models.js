const {row, rows} = require("../../../database/pg")


const model = {

    categories: () => {
     
     const sql = `select * from categories`   

     return rows(sql)
    },

    AllCourses: () => {
        const sql = `select courses.course_id,
        course_name,course_image,course_level,
        course_duration, course_price, c.category_name, u.first_name, u.last_name, u.user_avatar, count(video_name) as video_count from courses left join users as u on courses.author_id = u.user_id left join categories as c on courses.category_id = c.category_id left join topics as t on courses.course_id = t.course_id left join videos on t.topic_id = videos.topic_id group by course_name, courses.course_id, c.category_id, u.first_name, u.last_name, u.user_avatar order by course_id desc limit 30`

        return rows(sql)
    },

    courseItem: (id) => {
        const sql = `
        select courses.course_id,
        course_name,course_intro_video,course_level,
        course_duration, course_price, c.category_name, count(video_name) as video_count, course_profit, course_requirements, course_for_who from courses left join categories as c on courses.category_id = c.category_id left join topics as t on courses.course_id = t.course_id left join videos on t.topic_id = videos.topic_id  where courses.course_id = $1 group by course_name, courses.course_id, c.category_id
        `
        return rows(sql, id)
    },

    courseAuthors: (id) => {
        const sql = `
                select u.user_id, c.course_id, u.first_name, u.last_name, u.user_avatar, u.facebook, u.telegram, u.linked_in, 
                u.instagram, u.role_id from course_author join users as u on u.user_id = course_author.user_id join 
                courses as c on c.course_id = course_author.course_id where c.course_id = $1
        `
        return rows(sql, id)
    },

    freeCourses: () => {
        const sql = `select courses.course_id,
        course_name,course_image,course_level,
        course_duration, course_price, c.category_name, u.first_name, u.last_name, u.user_avatar, count(video_name) as video_count from courses left join users as u on courses.author_id = u.user_id left join categories as c on courses.category_id = c.category_id left join topics as t on courses.course_id = t.course_id left join videos on t.topic_id = videos.topic_id where course_price = '0' group by course_name, courses.course_id, c.category_id, u.first_name, u.last_name, u.user_avatar order by course_id desc limit 30`

        return rows(sql)
    },

    freeCoursesByCategory: (id) => {
        const sql = `select courses.course_id,
        course_name,course_image,course_level,
        course_duration, course_price, c.category_name, u.first_name, u.last_name, u.user_avatar, count(video_name) as video_count from courses left join users as u on courses.author_id = u.user_id left join categories as c on courses.category_id = c.category_id left join topics as t on courses.course_id = t.course_id left join videos on t.topic_id = videos.topic_id where course_price = '0' and c.category_id = $1 group by course_name, courses.course_id, c.category_id, u.first_name, u.last_name, u.user_avatar order by course_id desc limit 30`

        return rows(sql, id*1)
    },

    searchCourses: (title) => {
        const sql = `select courses.course_id,
        course_name,course_image,course_level,
        course_duration, course_price, c.category_name, u.first_name, u.last_name, u.user_avatar, count(video_name) as video_count from courses left join users as u on courses.author_id = u.user_id left join categories as c on courses.category_id = c.category_id left join topics as t on courses.course_id = t.course_id left join videos on t.topic_id = videos.topic_id where course_name ilike $1 group by course_name, courses.course_id, c.category_id, u.first_name, u.last_name, u.user_avatar`

        return rows(sql, `%${title}%`)
    },

    coursesByCategoryId: (id) => {
        const sql = `select courses.course_id,
        course_name,course_image,course_level,
        course_duration, course_price, c.category_name, u.first_name, u.last_name, u.user_avatar, count(video_name) as video_count from courses left join users as u on courses.author_id = u.user_id left join categories as c on courses.category_id = c.category_id left join topics as t on courses.course_id = t.course_id left join videos on t.topic_id = videos.topic_id where c.category_id = $1 group by course_name, courses.course_id, c.category_id, u.first_name, u.last_name, u.user_avatar order by course_id desc limit 30`

        return rows(sql, id)
    },

    filterCourses: (id, level, price) => {
        const sql = `select courses.course_id,
        course_name,course_image,course_level,
        course_duration, course_price, c.category_name, u.first_name, u.last_name, u.user_avatar, count(video_name) as video_count from courses left join users as u on courses.author_id = u.user_id left join categories as c on courses.category_id = c.category_id left join topics as t on courses.course_id = t.course_id left join videos on t.topic_id = videos.topic_id WHERE CASE WHEN 0 < $1 THEN c.category_id = $1 ELSE c.category_id = ANY
        (SELECT category_id
        FROM categories) END AND CASE WHEN 0 <= $2 THEN course_level = $2 ELSE course_level = ANY(select course_level from courses) END AND CASE WHEN 1 = $3 THEN course_price > 0 WHEN 0 = $3 THEN course_price = 0 ELSE course_price >= 0 END group by course_name, courses.course_id, c.category_id, u.first_name, u.last_name, u.user_avatar order by course_id desc limit 60`

        return rows(sql, id, level, price)  
    }    
}

module.exports.model = model

// `select count(course_name) as courses, u.first_name, p.course_id  from courses join course_author as a on a.course_id = courses.course_id join users as u on u.user_id = a.user_id join purchases as p on p.course_id = courses.course_id where u.user_id = 3 group by u.first_name, p.course_id`