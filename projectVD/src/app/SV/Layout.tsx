"use client";

import DefaultLayout from "@/components/Layouts/DefaultLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DefaultLayout>{children}</DefaultLayout>;
}