import Image from "next/image";
import { SignupForm } from "./(auth)/sign-up/form";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between text-sm lg:flex">
        Next Js + Mongo Db Starter kit
      </div>
    </main>
  );
}
