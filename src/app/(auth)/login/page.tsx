import React from 'react'
import { LoginForm } from './form'

const index = () => {
  return (
    <div className=''>
      <div className="flex flex-col space-y-2 text-center mb-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email below to log into your account
        </p>
      </div>
      <LoginForm/>
    </div>
  )
}

export default index