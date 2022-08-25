import Joi from 'joi'
import { melliCodeValidation } from './user.schema';

export const documentSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    document_number: Joi.string().custom((value, helper) => {
        if (!parseInt(value)) return helper.error('شماره سند صحیح نیست')

        return value;
    }).required(),
    access: Joi.array().required()
})

export const addPermissionSchema = Joi.object({
    docId: Joi.string().uuid().required(),
    user_natcode: Joi.string().custom((value, helper) => {
        if (!melliCodeValidation(value)) return helper.error('ﮎﺩ ﻢﻠﯾ ﺺﺤﯿﺣ ﻦﯿﺴﺗ')
        return value;
    }).required(),
})