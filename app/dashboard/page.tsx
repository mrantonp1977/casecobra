import StatusDropdown from '@/components/StatusDropdown';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import prisma from '@/db';
import { formatPrice } from '@/lib/utils';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { notFound } from 'next/navigation';
import React from 'react';

const Page = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

  if (!user || user.email !== ADMIN_EMAIL) {
    return notFound();
  }

  const orders = await prisma.order.findMany({
    where: {
      isPaid: true,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user: true,
      shippingAddress: true,
    },
  });

  const lastWeekSum = await prisma.order.aggregate({
    where: {
      isPaid: true,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      },
    },
    _sum: {
      amount: true,
    },
  });
  const lastMonthSum = await prisma.order.aggregate({
    where: {
      isPaid: true,
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 30)),
      },
    },
    _sum: {
      amount: true,
    },
  });

  const WEEKLY_GOAL = 500;
  const MONTHLY_GOAL = 2000;

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <div className="max-w-7xl mx-auto w-full flex flex-col sm:gap-4 sm:py-4">
        <div className="flex flex-col gap-16">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="text-lg font-semibold text-muted-foreground">
                  Last Month
                </CardDescription>
                <CardTitle className="text-4xl">
                  {formatPrice(lastWeekSum._sum.amount ?? 0)}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-md font-semibold text-muted-foreground">
                of {formatPrice(WEEKLY_GOAL)} goal
              </CardContent>
              <CardFooter>
                <Progress
                  value={((lastWeekSum._sum.amount ?? 0) * 100) / WEEKLY_GOAL}
                />
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="text-lg font-semibold text-muted-foreground">
                  Last Week
                </CardDescription>
                <CardTitle className="text-4xl">
                  {formatPrice(lastMonthSum._sum.amount ?? 0)}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-md font-semibold text-muted-foreground">
                of {formatPrice(MONTHLY_GOAL)} goal
              </CardContent>
              <CardFooter>
                <Progress
                  value={((lastMonthSum._sum.amount ?? 0) * 100) / MONTHLY_GOAL}
                />
              </CardFooter>
            </Card>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Incoming Orders</h1>
          <Table>
            <TableHeader>
              <TableRow className="text-lg font-semibold text-muted-foreground border-b-2 border-green-700">
                <TableHead>Customer</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="hidden sm:table-cell">Payment</TableHead>
                <TableHead className="hidden sm:table-cell">
                  Purchase Date
                </TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="bg-accent">
                  <TableCell>
                    <div className="font-medium">
                      {order.shippingAddress?.name}
                    </div>
                    <div className="hidden text-md text-muted-foreground md:inline">
                      {order.user?.email}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <StatusDropdown id={order.id} orderStatus={order.status} />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {order.isPaid ? (
                      <span className="text-green-500 font-semibold">Paid</span>
                    ) : (
                      <span className="text-red-500">Unpaid</span>
                    )}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatPrice(order.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Page;
