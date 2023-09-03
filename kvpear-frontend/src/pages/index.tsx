import { getServerSession } from '@/auth/session';
import Layout from './layout'
import Hero from '@/components/landing/Hero/Hero';

export const getServerSideProps = async (ctx: any) => {
  const { req } = ctx;
  const session = await getServerSession(req);
  if (session) {
    return {
      redirect: {
        destination: '/app',
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
    </Layout>
  )
}
