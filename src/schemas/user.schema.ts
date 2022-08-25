import Joi from 'joi';

export function melliCodeValidation(melliCode) {
    if (!/^\d{10}$/.test(melliCode)) return false;
    const check = +melliCode[9];
    const sum = melliCode.split('').slice(0, 9).reduce((acc, x, i) => acc + +x * (10 - i), 0) % 11;
    return sum < 2 ? check === sum : check + sum === 11;
}
export const userSchema = Joi.object({
    first_name: Joi.string().max(30).min(3).required(),
    last_name: Joi.string().max(30).min(3).required(),
    job: Joi.string().required(),
    phone_number: Joi.string().regex(/(0|\+98)?([ ]|-|[()]){0,2}9[1|2|3|4|5|6|7|8|9|0]([ ]|-|[()]){0,2}(?:[0-9]([ ]|-|[()]){0,2}){8}/).required(),
    education_level: Joi.string().min(3).max(50). required(),
    natcode: Joi.string().custom((value, helper) => {
        if (!melliCodeValidation(value)) return helper.error('ﮎﺩ ﻢﻠﯾ ﺺﺤﯿﺣ ﻦﯿﺴﺗ')
        return value;
    }).required(),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')). required(),
    address: Joi.string().min(3).max(255).required(),
})