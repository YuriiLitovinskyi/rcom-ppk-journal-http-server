const { body } = require('express-validator');

const companyId = 123456;

const rules = [
    body('companyId')
        .exists()
        .withMessage('companyId is required')
        .not()
        .isEmpty()
        .withMessage('companyId should not be empty')   
        .not()
        .isString()
        .withMessage('companyId must be a number')     
        .isNumeric()
        .withMessage('companyId must be numeric')
        .isIn([companyId])
        .withMessage('companyId does not match'),
    body('ppk_num')
        .exists()
        .withMessage('ppk_num is required')
        .not()
        .isEmpty()
        .withMessage('ppk_num should not be empty')  
        .not()
        .isString()
        .withMessage('ppk_num must be a number')      
        .isNumeric()
        .withMessage('ppk_num must be numeric'),
    body('start_time')
        .exists()
        .withMessage('start_time is required')
        .not()
        .isEmpty()
        .withMessage('start_time should not be empty')
        .not()
        .isString()
        .withMessage('start_time must be a number')     
        .isNumeric()
        .withMessage('start_time must be numeric'),
    body('end_time')
        .exists()
        .withMessage('end_time is required')
        .not()
        .isEmpty()
        .withMessage('end_time should not be empty') 
        .not()
        .isString()
        .withMessage('end_time must be a number')        
        .isNumeric()
        .withMessage('end_time must be numeric'),
];

module.exports = rules;