// src/app/ui/invoices/buttons.tsx
'use client';

import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteInvoice } from '@/app/lib/actions';
import { useState } from 'react';

export function CreateInvoice() {
  return (
    <Link
      href="/dashboard/invoices/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Invoice</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateInvoice({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/invoices/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteInvoice({ id }: { id: string }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteInvoiceWithId = deleteInvoice.bind(null, id);

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    setIsDeleting(true);
    try {
      await deleteInvoiceWithId();
    } catch (error) {
      console.error('Error al eliminar:', error);
      setIsDeleting(false);
    }
  };

  return (
    <>
      <form onSubmit={handleDelete}>
        <button
          type="submit"
          className="rounded-md border p-2 hover:bg-gray-100"
          disabled={isDeleting}
        >
          <span className="sr-only">Delete</span>
          <TrashIcon className="w-5" />
        </button>
      </form>

      {/* Modal de confirmación */}
      {showConfirm && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowConfirm(false)}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-3 text-gray-900 break-words">
              ¿Eliminar factura?
            </h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed break-words overflow-wrap-anywhere">
              Esta acción es permanente y no se puede deshacer. ¿Estás seguro de que quieres eliminar esta factura?
            </p>
            <div className="flex gap-3 justify-end flex-wrap">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
                disabled={isDeleting}
              >
                {isDeleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}