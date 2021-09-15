const {Pool} = require("pg")
const dotenv = require("dotenv")

dotenv.config()

const host = process.env.PG_HOST || 'localhost'
const user = process.env.PG_USER || 'postgres'
const password = process.env.PG_PWD || 'admin1'
const database = process.env.PG_DATABASE || 'mohirdev'
const port = process.env.PG_PORT || 5432

const pool = new Pool({
  connectionString: 'postgres://tgwnybwv:SEsnuMAQ87l_dN_rv3ZpTZmHW1UEmJ01@satao.db.elephantsql.com/tgwnybwv'
})

const rows = async (SQL, ...params) => {

  const client = await pool.connect()

  try{

    const {rows} = await client.query(SQL, params)

    return rows
  }
  catch(err){

  }
  finally{
    client.release()
  }

}
const row = async (SQL, ...params) => {

  const client = await pool.connect()

  try{

    const {rows: [row]} = await client.query(SQL, params)

    return row

  }
  catch(err){
console.log(err);
  }
  finally{
    client.release()
  }

}

module.exports = {
  rows,
  row
}