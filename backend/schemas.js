import { object, string, mixed, boolean } from 'yup';
import { COLLEGES, PROVINCES } from './constants.js';

export const prescriberDataSchema = object({
    firstName: string().required(),
    lastName: string().required(),
    province: mixed().oneOf(PROVINCES).required(),
    licensingCollege: mixed().oneOf(COLLEGES).required(),
    licenceNumber: string().required(),
})

export const prescriberPrescriptionSearchSchema = object({
    providerCode: string().required(),
    date: string(),
    initial: string(),
    prescribed: boolean(),
    status: string()
}).noUnknown()

export const prescriberPrescriptionPatchSchema = object({
    providerCode: string().required(),
    date: string().required(),
    initial: string().required(),
    prescribed: boolean(),
    status: string(),
    description: string().nullable()
}).noUnknown()

export const prescriberSearchSchema = object({
    providerCode: string(),
    email: string(),
    firstName: string(),
    lastName: string(),
    licensingCollege: mixed().oneOf(COLLEGES),
    licenceNumber: string(),
}).noUnknown()

export const prescriberPatchSchema = object({
    email: string(),
    firstName: string(),
    lastName: string(),
    language: string(),
    city: string(),
    province: mixed().oneOf(PROVINCES),
    profession: string(),
    licensingCollege: mixed().oneOf(COLLEGES),
    licenceNumber: string(),
}).noUnknown()