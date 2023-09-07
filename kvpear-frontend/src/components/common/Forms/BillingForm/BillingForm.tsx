import AppLayout from '@/components/common/AppLayout/AppLayout';
import { ccn } from '@/styles/styleUtils';
import { useApi } from '@/utils/api';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';

export default function BillingForm() {

  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { get, error: apiError } = useApi();

  const options = {
    mode: 'setup',
    currency: 'usd'
  }

  const handleError = (error: any) => {
    setError(error);
    setLoading(false);
  }

  const onSubmitBilling = async (e: any) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setError(false);
    setLoading(true);
    const {error: submitError} = await elements.submit()
    if (error) {
      handleError(error);
      return;
    }
    const { isOk, data } = await get('/api/billing/setup');
    if (isOk) {
      const { clientSecret } = data;
      const successMessage = encodeURIComponent('Billing details updated successfully');
      const {error} = await stripe.confirmSetup({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `http://localhost:3000/account?message=${successMessage}`
        },
      });
      if (error) {
        handleError(error);
        return;
      }
    } else {
      setError(apiError)
    }
    setLoading(false);
  }

  return (
    <>
      {/* @ts-ignore */}
      <form onSubmit={onSubmitBilling}>
        <PaymentElement />
        <button 
          type="submit" 
          className={ccn("btn btn-primary float-right btn-lg", { loading })}>
          Save
        </button>
        {error && <p className="text-error">{error}</p>}
      </form>
    </>
  );
};