'use client'
import { SessionProvider } from 'next-auth/react'


const AppContext = ({children}) => {
  return (
    <SessionProvider>
        {children}
    </SessionProvider>
  )
}

export default AppContext