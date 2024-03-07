import { object, string, mixed } from 'yup';
import { COLLEGES, PROVINCES } from './constants.js';

export const prescriberDataSchema = object({
    firstName: string().required(),
    lastName: string().required(),
    province: mixed().oneOf(PROVINCES),
    licensingCollege: mixed().oneOf(COLLEGES),
    licenceNumber: string().required(),
})