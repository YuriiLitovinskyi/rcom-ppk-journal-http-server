const { body } = require('express-validator');

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
        .withMessage('companyId must be numeric'),
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
        .isISO8601()
        .withMessage('start_time must be ISODate'),
    body('end_time')
        .exists()
        .withMessage('end_time is required')
        .not()
        .isEmpty()
        .withMessage('end_time should not be empty') 
        .isISO8601()
        .withMessage('end_time must be ISODate'),
];

module.exports = rules;