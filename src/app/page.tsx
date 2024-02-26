import Image from "next/image";
import React from "react";
import ConsentForm from "../components/ConsentForm/ConsentForm";

export default function Home() {
  return (
    <main className="flex min-h-screen justify flex-col items-center justify-between p-24 bg-white">
      <ConsentForm />
    </main>
  );
}
