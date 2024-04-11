const jwt = require('jsonwebtoken')

const verifyJWT = (req, res, next)=> {
  const cookieToken = req.cookies.access
  const authHeader = req.headers.authorization || req.headers.Authorization;
  
  if (!cookieToken && !authHeader?.startsWith('Bearer ')) {
    res.status(403)
    throw new Error('Invalid or Empty token')
  }
  const token = !cookieToken && authHeader.split(' ')[1]
  
  jwt.verify(cookieToken || token, process.env.ACCESS_TOKEN, (err, decoded)=>{
    if (err) {
      res.status(403)
      throw new Error('Invalid or expired token')
    }
    req.user = decoded.userId
    req.roles = decoded.roles
  })
  next();
}


module.exports = verifyJWT;
