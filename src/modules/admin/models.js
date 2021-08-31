const {row, rows} = require("../../../database/pg")


const model = {
    createCategory: ({category_name, image}) => {

        const sql = `insert into categories (category_name, category_image) values ($1, coalesce($2, null)) returning *`

        return row(sql, category_name, image)
    },
    deleteCategory: (id) => {

        const sql = `delete from categories where category_id = $1 returning`

        return row(sql, id)
    }
}

module.exports.model = model