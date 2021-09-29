const {row, rows} = require("../../../database/pg")


const model = {
    createCategory: (category_name, imgName) => {

        const sql = `insert into categories (category_name, category_image) values ($1, coalesce($2, null)) returning *`

        return row(sql, category_name, imgName)
    },

    deleteCategory: (id) => {

        const sql = `delete from categories where category_id = $1 returning *`

        return row(sql, id)
    },

    deleteCommentCourse: (id) => {

        const sql = `delete from comments where comment_id = $1 returning *`

        return row(sql, id)
    }
}

module.exports.model = model