"use server";

import prisma from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const getPaymentStatus = async ({ orderId}: {orderId: string}) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id || !user.email) {
    throw new Error('You must be logged in to view this page')
  }
  
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId: user.id
    },
    include: {
      billingAddress: true,
      configuration: true,
      shippingAddress: true,
      user: true
    }
  })

  if (!order) {
    throw new Error('Order not found')
  }

  if (order.isPaid) {
    return order
  } else {
    return false
  }

  
};