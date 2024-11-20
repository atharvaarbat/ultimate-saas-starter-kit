import React from 'react'
import { SignupForm } from './form'

export default function page() {
  return (
    <div className=''>
      <div className="flex flex-col space-y-2 text-center mb-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email below to create your account
        </p>
      </div>
      <SignupForm />
    </div>
  )
}
