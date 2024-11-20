"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useActionState } from "react";
import { login } from "@/server/action/auth";
import { useFormState } from 'react-dom';
import Link from "next/link";

export function LoginForm() {
  const [state, action, pending ] = useActionState(login, undefined);

  return (
    <form action={action}>
      <div className="flex flex-col gap-2">
       
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" placeholder="john@example.com" />
        </div>
        {state?.errors?.email && (
          <p className="text-sm text-red-500">{state.errors.email}</p>
        )}
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" placeholder="●●●●●●"/>
        </div>
        
        <Button aria-disabled={pending} type="submit" className="mt-2 w-full">
          {pending ? "Submitting..." : "Login"}
        </Button>
        <Link href={'/sign-up'}>
          <Button aria-disabled={pending} variant='ghost' className="mt-2 w-full font-bold">
            Create an account
          </Button>
        </Link>
      </div>
    </form>
  );
}

