import useAuth from "@/auth/useAuth";
import Layout from "../layout";
import DocContent from './docs.mdx';
import AppLayout from "@/components/common/AppLayout/AppLayout";
import DocsLayout from "@/components/common/DocsLayout/DocsLayout";
 
export const metadata = {
  author: 'Rich Haines',
};
 
export default function Docs() {

  const { user } = useAuth();

  if (!user) {
    return (
    <Layout>
      <DocsLayout>
        <DocContent />
      </DocsLayout>
    </Layout>
    )
  }

  return (
    <AppLayout>
      <DocsLayout>
        <DocContent />
      </DocsLayout>
    </AppLayout>
  )
}