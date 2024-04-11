require('dotenv').config();
const mongoose = require('mongoose')
const connStr = process.env.DB_CONN


const connectDB = async function () {
  try {
    const conn = await mongoose.connect(connStr)
    console.log(`Database running with connection ${conn.connection.host}`)
  } catch (error) {
    console.error(error)
    // throw new Error(error)
    process.exit(1)
  }
}

module.exports = { connectDB }
