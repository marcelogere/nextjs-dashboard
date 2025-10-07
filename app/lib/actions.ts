'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { auth } from '@clerk/nextjs/server';

// Inicialización de conexión segura a la base de datos Postgres
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Esquema base para factura
const FormSchema = z.object({
  id: z.string().optional(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string().optional(),
});

// Esquema para creación (omitimos campos que no vienen por formulario)
const CreateInvoiceSchema = FormSchema.omit({ id: true, date: true });

// Esquema para actualización (por ejemplo omitimos date)
const UpdateInvoiceSchema = FormSchema.omit({ date: true });

// Tipo para estado de formulario (errores y mensajes)
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string;
};