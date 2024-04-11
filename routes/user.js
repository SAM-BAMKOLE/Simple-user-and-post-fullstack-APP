const express = require('express')
const path = require('path')
const router = express.Router();
const { getUsers, deleteUser, makeAdmin, updateUsername, updatePassword } = require(path.join(__dirname, "..", 'controllers', 'user.js'))
const ROLES_LIST = require(path.join(__dirname, '..', 'config', 'rolesList.js'))
const verifyRoles = require(path.join(__dirname, '..', 'middlewares', 'verifyRoles.js'))
/*
router.get('/', (req, res)=> {
  res.send('Hello from all users!')
})
*/
// router.route('/').get(verifyRoles(ROLES_LIST.Admin), getUsers)
router.get('/', getUsers)
router.route("/:userId").delete(verifyRoles(ROLES_LIST.Admin), deleteUser)

router.put('/make-admin', verifyRoles(ROLES_LIST.Admin), makeAdmin)
router.patch("/update-username", updateUsername)
router.patch('/update-password', updatePassword)

module.exports = router;
