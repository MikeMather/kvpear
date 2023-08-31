import { getServerSession } from '@/auth/session';
import Layout from './layout'

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
    </Layout>
  )
}
