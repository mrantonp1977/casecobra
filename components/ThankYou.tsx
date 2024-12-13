'use client';

import { getPaymentStatus } from '@/app/thank-you/actions';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import React from 'react';
import PhonePreview from './PhonePreview';
import { formatPrice } from '@/lib/utils';

const ThankYou = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || '';
  const { data } = useQuery({
    queryKey: ['get-payment-status'],
    queryFn: async () => getPaymentStatus({ orderId }),
    retry: true,
    retryDelay: 500,
  });

  if (data === undefined) {
    return (
      <div className="w-full mt-24 flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="size-8 animate-spin text-zinc-500" />
          <h3 className="font-semibold text-xl">Loading...</h3>
          <p>
            This wont take long.
          </p>
        </div>
      </div>
    );
  }

  if (data === false) {
    return (
      <div className="w-full mt-24 flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="size-8 animate-spin text-zinc-500" />
          <h3 className="font-semibold text-xl">Verifying your payment...</h3>
          <p>Please wait while we verify your payment status.</p>
        </div>
      </div>
    );
  }

  const { configuration, shippingAddress, billingAddress, amount } = data;
  const { color } = configuration;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-xl">
          <p className="text-2xl text-center font-semibold text-primary">
            Thank you for your purchase!
          </p>
          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
            Your case is on the way!
          </h1>
          <p className="mt-2 text-base text-zinc-500">
            We have received your payment and your order is now being processed. You will receive an email with your tracking number once your order has been shipped.
          </p>
          <div className="mt-12 text-sm font-medium">
            <p className="text-zinc-900 font-semibold">
              Order Number
            </p>
            <p className="text-zinc-500 mt-2 border border-zinc-200 rounded-lg p-2">
              {orderId}
            </p>
          </div>
        </div>
        <div className="mt-10 border-t border-zinc-200">
          <div className="mt-10 flex flex-auto flex-col">
            <h4 className="font-semibold text-zinc-900">
              You make a great choice!
            </h4>
            <p className="mt-2 text-sm text-zinc-600">
              We at CaseCobra believe that a phone case doesn't have to be boring, and we are glad you think so too. Your case is being prepared and will be shipped soon. If you have any questions, please don't hesitate to contact us.
            </p>
          </div>
        </div>
        <div className="flex space-x-6 overflow-hidden mt-4 rounded-xl bg-gray-900/5 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl">
          <PhonePreview 
            croppedImageUrl={configuration.croppedImageUrl!} 
            color={color!}
          />
        </div>
        <div>
          <div className="grid grid-cols-2 gap-x-6 py-10 text-sm">
            <div>
              <p className="font-semibold text-gray-900">
                Shipping Address
              </p>
              <div className="mt-2 text-zinc-700">
                <address className="not-italic">
                  <span className="block">
                    {shippingAddress?.name}
                  </span>
                  <span className="block">
                    {shippingAddress?.street}
                  </span>
                  <span className="block">
                    {shippingAddress?.postalCode} {shippingAddress?.city}
                  </span>
                </address>
              </div>
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                Billing Address
              </p>
              <div className="mt-2 text-zinc-700">
                <address className="not-italic">
                  <span className="block">
                    {billingAddress?.name}
                  </span>
                  <span className="block">
                    {billingAddress?.street}
                  </span>
                  <span className="block">
                    {billingAddress?.postalCode} {billingAddress?.city}
                  </span>
                </address>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-6 border-t border-zinc-200 py-10 text-sm">
            <div>
              <p className="font-semibold text-zinc-900">
                Payment Status
              </p>
              <p className="font-semibold mt-2 text-zinc-700">
                Paid 
                <CheckCircle2 className="size-4 inline-block ml-2 text-green-500" />
              </p>
            </div>
            <div>
              <p className="font-semibold text-zinc-900">
                Shipping Method
              </p>
              <p className="font-semibold mt-2 text-zinc-700">
                DHL Express, takes 1-3 working days
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-6 border-t border-zinc-200 pt-10 text-sm">
          <div className="flex justify-between">
            <p className="font-semibold text-zinc-900">
              Subtotal
            </p>
            <p className="font-semibold  text-zinc-700">
              {formatPrice(amount)}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="font-semibold  text-zinc-900">
              Shipping
            </p>
            <p className="font-semibold text-zinc-700">
              {formatPrice(0)}
            </p>
          </div>
          <div className="flex justify-between">
            <p className="font-semibold text-lg text-zinc-900">
              Total
            </p>
            <p className="font-semibold text-lg text-zinc-700">
              {formatPrice(amount)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
};

export default ThankYou;
