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

export const patientPrescriptionSearchSchema = object({
    providerCode: string(),
    date: string(),
    initial: string(),
    prescribed: boolean(),
    firstName: string().required(), 
    lastName: string().required(), 
    email: string().required(), 
    address: string(), 
    language: string(), 
    status: string()
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

export const patientSearchSchema = object({
    email: string(),
    firstName: string(),
    lastName: string()
}).noUnknown()

export const patientPatchSchema = object({
    firstName: string(),
    lastName: string(),
    language: string(),
    address: string(),
    city: string(),
    province: mixed().oneOf(PROVINCES)
}).noUnknown()