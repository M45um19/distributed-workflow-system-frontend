"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <>
      {!isDashboard && <Navbar />}
      <main className={`flex-grow ${!isDashboard ? "pt-20" : ""}`}>{children}</main>
      {!isDashboard && <Footer />}
    </>
  );
}
