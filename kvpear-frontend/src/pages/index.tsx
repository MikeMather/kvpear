import { getServerSession } from '@/auth/session';
import Layout from './layout'
import Hero from '@/components/landing/Hero/Hero';
import UseCases from '@/components/landing/UseCases/UseCases';
import Section from '@/components/landing/Section/Section';
import Solutions from '@/components/landing/Solutions/Solutions';
import Demos from '@/components/landing/Demos/Demos';
import Pricing from '@/components/landing/Pricing/Pricing';
import { LinkButton } from '@/components/common/LinkButton';
import Cta from '@/components/landing/Cta/Cta';

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
      <Section>
        <Hero />
      </Section>
      <Section striped>
        <UseCases />
      </Section>
      <Section>
        <Solutions />
      </Section>
      <Section>
        <Demos />
      </Section>
      <Section>
        <Pricing />
      </Section>
      <Section>
        <Cta />
      </Section>
    </Layout>
  )
}
