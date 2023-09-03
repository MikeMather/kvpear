import { getServerSession } from '@/auth/session';
import Layout from './layout'
import Hero from '@/components/landing/Hero/Hero';
import UseCases from '@/components/landing/UseCases/UseCases';

export const getServerSideProps = async (ctx: any) => {
  const { req } = ctx;
  const session = await getServerSession(req);
  if (session) {
    return {
      redirect: {
        destination: '/buckets',
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};

export default function Home() {

  return (
    <Layout>
      <Hero />
      <UseCases />
    </Layout>
  )
}
