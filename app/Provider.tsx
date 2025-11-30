"use client";

import { Toaster } from "sonner";

 

 

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster duration={5000} position="top-right" richColors expand={true} />
      {children}
    </>
  );
}