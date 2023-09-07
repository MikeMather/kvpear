import AppLayout from '@/components/common/AppLayout/AppLayout';
import styles from './account.module.scss';
import { protectedSsrRoute } from '@/auth/session';
import { GetServerSideProps } from 'next';
import { UserDocument } from '@/database/models/user';
import BillingForm from '@/components/common/Forms/BillingForm/BillingForm';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { LinkButton } from '@/components/common/LinkButton';
import { useForm } from 'react-hook-form';
import { ccn } from '@/styles/styleUtils';
import { useApi } from '@/utils/api';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

export const getServerSideProps = protectedSsrRoute(async (ctx: GetServerSideProps, session: UserDocument) => {
  return {
    props: {
      user: session,
    }
  }
});

const stripPublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string;
const stripePromise = loadStripe(stripPublishableKey);

const emailFormSchema = yup.object({
  email: yup.string().email().required('Please enter a valid email')
});

export default function Account({ user }: { user: UserDocument }) {

  const { patch, error, isLoading } = useApi();
  const { register, handleSubmit, formState: { errors } } = useForm<{ email: string }>({
    resolver: yupResolver(emailFormSchema),
    defaultValues: {
      email: user.email
    }
  });

  const options = {
    mode: 'setup',
    currency: 'usd'
  }

  const onSubmitEmail = async (data: any) => {
    await patch('/api/user', data, {
      successMessage: 'Email updated successfully',
      errorMessage: 'Error updating email'
    });
  }

  return (
    <AppLayout>
        <div className="page_header">
          <h1>Account details</h1>
          <section className={styles.account_section}>
            <h4>Contact Details</h4>
            <span>You'll use this email to login and for all communications</span>
            <form className="form" style={{ maxWidth: '400px' }} onSubmit={handleSubmit(onSubmitEmail)}>
              <div className={ccn("form-group", { 'has-error': !!errors?.email })}>
                <label className="form-label">Email</label>
                <input 
                  className="form-input" 
                  type="email"
                  {...register('email', { required: true })}
                />
                {errors?.email && <p className="form-input-hint">Email is required</p>}
                <button 
                  className={ccn("btn btn-primary btn-lg float-right mt-2", { 'loading': isLoading })}
                  type="submit">Save</button>
              </div>
            </form>
          </section>
          <section className={styles.account_section}>
            <h4>Billing</h4>
            <span style={{ marginBottom: '20px' }}>Set up your billing details to ensure access to the API without disruption</span>
            {user.customerId 
              ? <div>
                  <p className="text-primary">Use the button below to manage your payment details and view past invoices</p>
                  <LinkButton href="/api/billing/customer-portal" className="btn btn-primary btn-lg">Manage Billing</LinkButton>
                </div>
              : <>
                {/* @ts-ignore */}
                <Elements stripe={stripePromise} options={options}>
                  <BillingForm />
                </Elements>
              </>
            }
          </section>
        </div>
    </AppLayout>
  );
};