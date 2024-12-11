
import DesignPreview from '@/components/DesignPreview'
import prisma from '@/db'
import { notFound } from 'next/navigation'


interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

const Page = async ({ searchParams }: PageProps) => {
  const { id } = searchParams

  if (!id || typeof id !== 'string') {
    return notFound()
  }

  const configuration = await prisma.configuration.findUnique({
    where: { id },
  })

  if(!configuration) {
    return notFound()
  }

  return <DesignPreview configuration={configuration} />
}

export default Page

