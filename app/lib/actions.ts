'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
<<<<<<< HEAD
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
 
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
 
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});
 
const CreateInvoice = FormSchema.omit({ id: true, date: true });
 
export async function createInvoice(formData: FormData) {
    const { customerId, amount, status } = CreateInvoice.parse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });
  // Test it out:
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

=======
 
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
 
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});
 
const CreateInvoice = FormSchema.omit({ id: true, date: true });
 
export async function createInvoice(formData: FormData) {
    const { customerId, amount, status } = CreateInvoice.parse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });
  // Test it out:
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

>>>>>>> parent of 0418122 (Autenticacion con Clerk)
    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}