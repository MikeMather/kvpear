import { useRouter } from 'next/router';
import Layout from '../../layout';
import styles from './login.module.scss';
import Alert from '@/components/common/Alert/Alert';
import { usePost } from '@/utils/api';
import { useForm } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';

const schema = yup.object({
  email: yup.string().email().required(),
}).required();
type FormData = yup.InferType<typeof schema>;

export default function Login() {
  const router = useRouter();
  const { post, isLoading, error, isDone } = usePost()
  const { handleSubmit, register } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    post('/api/auth/send-login', data);
  };

  if (isDone && !error) {
    return (
      <Layout>
        <div className={styles.login_container}>
          <div className="hero" style={{ paddingTop: 0, paddingBottom: '40px' }}>
            <div className="hero-body text-center">
              <div className={styles.success_icons}>
                <i className="icon icon-mail text-success icon-4x"></i>
                <i className="icon icon-check text-success icon-2x"></i>
              </div>
              <h1>Check your email</h1>
              <p>We sent a link that you can use to login</p>
            </div>
            <Link href="/" className="btn btn-primary">Go Home</Link>
          </div>
        </div>
      </Layout>
    )
  };

  return (
    <Layout>
      <div className={styles.login_container}>
        <div className="hero" style={{ paddingTop: 0, paddingBottom: '40px' }}>
          <div className="hero-body text-center">
            <i className="icon icon-mail icon-4x text-primary"></i>
            <h1>Login with Email</h1>
            <p>We'll send a link that you can use to login</p>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.login_form}>
          <div className="form-group">
            <label className="form-label label-lg" htmlFor="email">Email</label>
            <input className="form-input input-lg" type="email" {...register('email', { required: true })} />
          </div>
          <button type="submit" className={`btn btn-primary ${isLoading && 'loading'}`}>Submit</button>
        </form>
        {router.query.error || error && (
          <div className={styles.alert}>
            <Alert type="error">
              {router.query.error || 'An error occurred'}
            </Alert>
          </div>
        )}
      </div>
    </Layout>
  )
}