import { redirect } from 'next/navigation'
import React from 'react'

const Page = () => {
  redirect('/organization/all');
}

export default Page