const authController = require('../controllers/auth.controller')
const authValidator = require('../validators/auth.validator')

const authRoutes = [
    {
        url: '/auth/register',
        method: 'POST',
        preHandler: authValidator.registerValidator,
        handler: authController.registerController
    },
    {
        url: '/auth/login',
        method: 'POST',
        preHandler: authValidator.loginValidator,
        handler: authController.loginController
    }
]

module.exports = authRoutes