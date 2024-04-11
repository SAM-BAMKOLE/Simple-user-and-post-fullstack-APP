const verifyRoles = (...allowedRoles)=>{
  return (req, res, next)=>{
    if (!req?.roles){
      res.status(401)
      throw new Error('Unauthenticated')
    }
    const rolesList = [...allowedRoles]
    const result = req.roles.map((role)=> rolesList.includes(role)).find(val => val === true)
    if (!result) {
      res.status(401)
      throw new Error('Unauthenticated: not allowed to view this route')
    }
    next()
  }
}

module.exports = verifyRoles;
