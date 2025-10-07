// src/app/lib/actions.ts
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { AuthError } from 'next-auth';
import { auth } from '@clerk/nextjs/server';;

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Schema de validación
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Por favor seleccione un cliente.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Por favor ingrese un monto mayor a $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Por favor seleccione un estado para la factura.',
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

// Tipo para el estado del formulario - CORREGIDO
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string;
};

// Crear factura - con State
export async function createInvoice(prevState: State, formData: FormData): Promise<State> {
  // Validar los datos del formulario
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  // Si la validación falla, retornar errores
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Campos faltantes. No se pudo crear la factura.',
    };
  }

  // Preparar datos para inserción
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];

  // Insertar datos en la base de datos
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    console.error('Error al actualizar factura:', error);
    return {
      message: 'Error de base de datos: No se pudo actualizar la factura.',
    };
  }

  // Revalidar la caché de la página de facturas y redirigir
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

// Actualizar factura
export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
): Promise<State> {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Campos faltantes. No se pudo actualizar la factura.',
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error('Error al actualizar:', error);
    return {
      message: 'Error de base de datos: No se pudo actualizar la factura.',
    };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

// Eliminar factura
export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
  } catch (error) {
    console.error('Error al eliminar factura:', error);
    throw new Error('No se pudo eliminar la factura.');
  }
}

export async function authenticate(prevState: any, formData: FormData) {
  const { userId } = await auth();

  // Si no hay usuario autenticado, redirigí al login de Clerk
  if (!userId) {
    redirect('/sign-in');
  }

  const callbackUrl = (formData.get('callbackUrl') as string) || '/dashboard';
  redirect(callbackUrl);
}