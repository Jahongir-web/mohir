const {row, rows} = require("../../../database/pg")


const model = {

    categories: () => {
     
     const sql = `select * from categories`   

     return rows(sql)
    },
    courses: () => {
        const sql = `select to_char(created_at, 'YYYY-MM-DD HH24:MI') as sana from courses`

        return row(sql)
    }


}

module.exports.model = model