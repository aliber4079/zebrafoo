// Require and initialize outside of your main handler
const mysql = require('serverless-mysql')({
  config: {
    host     : process.env.MYSQL_HOST,
    database : process.env.MYSQL_DATABASE,
    user     : process.env.MYSQL_USER,
    password : process.env.MYSQL_PASSWORD
  }
})
// Main handler function
export default async function handler(req,res) {
  // Run your query
  let results = await mysql.query(req.body.sql)

  // Run clean up function
  await mysql.end()
  res.status(200).json(results)
}
