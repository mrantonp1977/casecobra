import DesignConfigurator from '@/components/DesignConfigurator';
import prisma from '@/db';
import { notFound } from 'next/navigation';
import React from 'react'

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

const Page = async ({ searchParams }: PageProps ) => {
  const { id } = await searchParams;

  if (!id || typeof id !== 'string') {
    return notFound();
  }
  
  const configuration = await prisma.configuration.findUnique({
    where: {
      id
    }
  });

  if (!configuration) {
    return notFound();
  }

  const { imageUrl, width, height } = configuration;

  return (
    <DesignConfigurator 
      configId={configuration.id}
      imageUrl={imageUrl}
      imageDimensions={{ width, height }}
    />
  )
}

export default Page