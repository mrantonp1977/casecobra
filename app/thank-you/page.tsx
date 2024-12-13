import ThankYou from '@/components/ThankYou'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <Suspense>
      <ThankYou />
    </Suspense>
  )
}

export default page