import { NextSeo } from 'next-seo';
import DocContent from './docs.mdx';
import DocsLayout from "@/components/common/DocsLayout/DocsLayout";
 
export default function Docs() {

  return (
    <DocsLayout>
      <NextSeo
        title="Documentation | KV Pear"
        description="Learn how to use KV Pear to build your next application."
      />
      <DocContent />
    </DocsLayout>
  )
}