import {z} from 'zod';

export const createTareasSchema = z.object({
    titulo: z.string({
       required_error: "El título es requerido",
       invalid_type_error: "El título debe ser una cadena.", 
    }).min(1,{
        message: "El título debe tener al menos un caracter."
    }).max(255, {
        message: "El título debe tener 255 caracteres como máximo."
    }),
    descripcion: z.string({
        required_error: "La descripcion es requerida",
        invalid_type_error: "La descripcion debe ser una cadena.",
    }).min(0,{
        message: "La descripcion debe tener al menos un caracter."
    }).max(255, {
        message: "La descripcion debe tener 255 caracteres como máximo."
    }).optional(),
});

export const updateTareasSchema = z.object({
    titulo: z.string({
       required_error: "El título es requerido",
       invalid_type_error: "El título debe ser una cadena.", 
    }).min(1,{
        message: "El título debe tener al menos un caracter."
    }).max(255, {
        message: "El título debe tener 255 caracteres como máximo."
    }).optional(),
    descripcion: z.string({
        required_error: "La descripción es requerida.",
        invalid_type_error: "La descripción debe ser una cadena.",
    }).min(0,{
        message: "La descripción debe tener al menos un caracter."
    }).max(255, {
        message: "La descripción debe tener 255 caracteres como máximo."
    }).optional(),
});

