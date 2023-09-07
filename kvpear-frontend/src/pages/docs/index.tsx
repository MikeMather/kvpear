import DocContent from './docs.mdx';
import DocsLayout from "@/components/common/DocsLayout/DocsLayout";
 
export default function Docs() {

  return (
    <DocsLayout>
      <DocContent />
    </DocsLayout>
  )
}