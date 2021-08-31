const jwt = require("jsonwebtoken")


const SECRET = "SECRET"


const sign = (payload) => jwt.sign(payload, SECRET)

const verify = (accessToken) => jwt.verify(accessToken, SECRET)


module.exports = {
sign,
verify
}