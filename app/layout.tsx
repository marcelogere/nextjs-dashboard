import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
<<<<<<< HEAD
import { ClerkProvider } from '@clerk/nextjs'; // Importa ClerkProvider
=======
>>>>>>> parent of 0418122 (Autenticacion con Clerk)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
<<<<<<< HEAD
      <body className={`${inter.className} antialiased`}>
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
=======
>>>>>>> parent of 0418122 (Autenticacion con Clerk)
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
