import { Suspense, type ReactNode } from "react";
import { PageLoader } from "./PageLoader";

interface SuspenseWrapperProps {
  children: ReactNode;
}

export function SuspenseWrapper({ children }: SuspenseWrapperProps) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}
