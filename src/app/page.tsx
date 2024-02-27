import Image from "next/image";
import React from "react";
import ConsentForm from "../components/ConsentForm/ConsentForm";
import NavBar from "@/components/NavBar/NavBar";

export default function Home() {
  return (
    <main className="flex min-h-screen justify flex-col items-center justify-between px-24 py-8 bg-white">
      <ConsentForm />
    </main>
  );
}
