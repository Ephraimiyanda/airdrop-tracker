"use client";

import { NextUIProvider } from "@nextui-org/react";
import SessionProvider from "./adminsessionProvider";
import { Suspense } from "react";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <NextUIProvider><Suspense>{children}</Suspense></NextUIProvider>
    </SessionProvider>
  );
}
