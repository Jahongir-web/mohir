const {row, rows} = require("../../../database/pg")


const model = {

    categories: () => {
     
     const sql = `select * from categories`   

     return rows(sql)
    },

    AllCourses: () => {
        const sql = `select courses.course_id,
        course_name,course_image,course_level,
        course_duration, course_price, c.category_name, c.category_id, u.first_name, u.last_name, u.user_avatar, count(video_name) as video_count from courses left join users as u on courses.author_id = u.user_id left join categories as c on courses.category_id = c.category_id left join topics as t on courses.course_id = t.course_id left join videos on t.topic_id = videos.topic_id where course_ready = true group by course_name, courses.course_id, c.category_id, u.first_name, u.last_name, u.user_avatar`

        return rows(sql)
    },

    courseItem: (id) => {
        const sql = `
        select courses.course_id,
        course_name,course_intro_video,course_level,
        course_duration, course_price, c.category_name, c.category_id, count(video_name) as video_count, course_profit, course_requirements, course_for_who from courses left join categories as c on courses.category_id = c.category_id left join topics as t on courses.course_id = t.course_id left join videos on t.topic_id = videos.topic_id  where courses.course_id = $1 group by course_name, courses.course_id, c.category_id
        `
        return row(sql, id)
    },

    courseAuthorsId: (id) => {
        const sql = `
        select u.user_id from course_author join users as u on u.user_id = course_author.user_id join 
        courses as c on c.course_id = course_author.course_id where c.course_id = $1
        `
        return rows(sql, id)
    },

    courseTopics: (id) => {
        const sql = `
        select * from topics where course_id = $1
        `
        return rows(sql, id)
    },

    courseComments: (id) => {
        const sql = `
        select u.user_id, (u.first_name || ' ' || u.last_name) as fullname, u.username, u.user_avatar, c.comment_id, c.comment_content, to_char(c.created_at, 'DD.MM.YYYY | HH24:MI') as date from comments as c
         join users as u using(user_id) where course_id = $1
        `
        return rows(sql, id)
    },

    courseVideos: (id) => {
        const sql = `
        select t.topic_id, v.video_id, v.video_name, v.video_link, v.video_info, v.video_material, v.video_duration from courses as c left join topics as t on c.course_id = t.course_id left join videos as v on t.topic_id = v.topic_id where c.course_id = $1
        `
        return rows(sql, id)
    },

    getVideo: (id) => {
        const sql = `
            select * from videos where video_id = $1
        `
        return row(sql, id)
    },

    checkWatched: (user_id, id) => {
        const sql = `
            select * from videos_history where user_id = $1 and video_id = $2
        `
        return row(sql, user_id, id)
    },

    addWatchedVideos: (user_id, id) => {
        const sql = `
            insert into videos_history(user_id, video_id) values ($1, $2) returning *
        `
        return row(sql, user_id, id)
    },

    watchedVideos: (user_id) => {
        const sql = `
        select h.video_id, case when h.user_id = $1 then true end as show from videos_history as h right join videos as v on v.video_id = h.video_id where user_id = $1
        `
        return rows(sql, user_id)
    },

    courseQuizz: (id) => {
        const sql = `
        select q.quiz_id, q.video_id, q.quiz_title, q.quiz_info from courses as c left join topics as t on c.course_id = t.course_id left join videos as v on t.topic_id = v.topic_id join quiz as q on q.video_id = v.video_id where c.course_id = $1
        `
        return rows(sql, id)
    },

    freeCourses: () => {
        const sql = `select courses.course_id,
        course_name,course_image,course_level,
        course_duration, course_price, c.category_name, u.first_name, u.last_name, u.user_avatar, count(video_name) as video_count from courses left join users as u on courses.author_id = u.user_id left join categories as c on courses.category_id = c.category_id left join topics as t on courses.course_id = t.course_id left join videos on t.topic_id = videos.topic_id where course_ready = true and course_price = '0' group by course_name, courses.course_id, c.category_id, u.first_name, u.last_name, u.user_avatar order by course_id desc limit 30`

        return rows(sql)
    },

    freeCoursesByCategory: (id) => {
        const sql = `select courses.course_id,
        course_name,course_image,course_level,
        course_duration, course_price, c.category_name, u.first_name, u.last_name, u.user_avatar, count(video_name) as video_count from courses left join users as u on courses.author_id = u.user_id left join categories as c on courses.category_id = c.category_id left join topics as t on courses.course_id = t.course_id left join videos on t.topic_id = videos.topic_id where course_ready = true and course_price = '0' and c.category_id = $1 group by course_name, courses.course_id, c.category_id, u.first_name, u.last_name, u.user_avatar order by course_id desc limit 30`

        return rows(sql, id*1)
    },

    searchCourses: (title) => {
        const sql = `select courses.course_id,
        course_name,course_image,course_level,
        course_duration, course_price, c.category_name, u.first_name, u.last_name, u.user_avatar, count(video_name) as video_count from courses left join users as u on courses.author_id = u.user_id left join categories as c on courses.category_id = c.category_id left join topics as t on courses.course_id = t.course_id left join videos on t.topic_id = videos.topic_id where course_ready = true and course_name ilike $1 group by course_name, courses.course_id, c.category_id, u.first_name, u.last_name, u.user_avatar`

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
    },
    
    getTeacher: (id) => {
        const sql = `select users.user_id, user_avatar, (first_name || ' ' || last_name) as fullname, facebook, telegram, linked_in, instagram, user_info, (select count(c.course_name) from users join course_author as a on a.user_id = users.user_id join courses as c on c.course_id = a.course_id where users.user_id = $1) as count_course, count(p.course_id) as students from users join course_author as a on a.user_id = users.user_id join courses as c on c.course_id = a.course_id join purchases as p on p.course_id = a.course_id where users.user_id = $1 group by users.user_id
        `
        return row(sql, id)
    },

    getTeacherCourses: (id) => {
        const sql = `select courses.course_id,
        course_name,course_image,course_level,
        course_duration, course_price, c.category_name, u.first_name, u.last_name, u.user_avatar, count(video_name) as video_count from courses left join course_author on course_author.course_id = courses.course_id left join users as u on course_author.user_id = u.user_id left join categories as c on courses.category_id = c.category_id left join topics as t on courses.course_id = t.course_id left join videos on t.topic_id = videos.topic_id where u.user_id = $1 group by course_name, courses.course_id, c.category_id, u.first_name, u.last_name, u.user_avatar order by course_id asc limit 40
        `
        return rows(sql, id)
    },
    
    getCategoryBlogs: () => {
        const sql = `
        select blog_id, category_id, category_name from blogs join categories_blog using(blog_id) join categories using(category_id)
        `
        return rows(sql)
    },
    
    
    allBlogs: () => {
        const sql = `
        select blog_id, blog_title, blog_image, to_char(blogs.created_at, 'DD.MM.YYYY') as date, (u.first_name || ' ' || u.last_name) as author, u.user_avatar from blogs left join users as u using(user_id)
        `
        return rows(sql)
    },

    blog: (id) => {
        const sql = `
        select blog_id, blog_title, blog_image, blog_content, to_char(blogs.created_at, 'DD.MM.YYYY') as date, (u.first_name || ' ' || u.last_name) as author, u.user_avatar from blogs left join users as u using(user_id) where blog_id = $1
        `
        return row(sql, id)
    },
    
    categoryBlog: (id) => {
        const sql = `
        select blog_id, category_id, category_name from blogs join categories_blog using(blog_id) join categories using(category_id) where categories_blog.blog_id = $1
        `
        return rows(sql, id)
    },

    allTeachers: () => {
        const sql = `
        select users.user_id, user_avatar, (first_name || ' ' || last_name) as fullname, count(p.course_id) as students from users join course_author as a on a.user_id = users.user_id  left join purchases as p on p.course_id = a.course_id where users.role_id = 1 group by users.user_id
        `
        return rows(sql)
    },
    
    countCourses: () => {
        const sql = `
        select count(c.course_name), users.user_id from users left join course_author as a on a.user_id = users.user_id left join courses as c on c.course_id = a.course_id where users.role_id = 1 group by a.user_id, users.user_id 
        `
        return rows(sql)
    },
}

module.exports.model = model

