"use client";

import { NextUIProvider } from "@nextui-org/react";
import SessionProvider from "./adminsessionProvider";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <NextUIProvider>{children}</NextUIProvider>
    </SessionProvider>
  );
}
