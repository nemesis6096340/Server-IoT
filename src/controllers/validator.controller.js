import { body, validationResult } from "express-validator";

const validatorCtrl = {};

const validationCheck = function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }
    next();
}

validatorCtrl.validator = function (method) {
    switch (method) {
        case 'createUser': {
            return [
                body('userName', 'El usuario no existe').exists(),
                body('email', 'Invalid email').exists().isEmail(),
                body('phone').optional().isInt(),
                body('status').optional().isIn(['enabled', 'disabled']),
                validationCheck
            ]
        }
        case 'accessRequests': {
            return [
                body('email', 'Invalid email').exists().isEmail(),
                validationCheck
            ]
        }
        case 'loginUser': {
            return [
                body('email', 'Invalid email').exists().isEmail(),
                body('password', 'Invalid password').exists(),
                validationCheck
            ]
        }
    }
}

export default validatorCtrl;
