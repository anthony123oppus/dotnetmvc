import React, { ReactNode } from 'react'

const DefaultLayout : React.FC<{children : ReactNode}> = ({children}) => {
  return (
    
    <main className="p-20 w-[100vw]">
        {children}
    </main>
  )
}

export default DefaultLayout
