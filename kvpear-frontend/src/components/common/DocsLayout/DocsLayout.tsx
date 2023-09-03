import Link from "next/link";
import { PropsWithChildren } from "react";
import { MDXProvider } from "@mdx-js/react";

function getAnchor(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/[ ]/g, '-');
}
const H2 = ({ children }: PropsWithChildren<{}>) => {
  const anchor = getAnchor(children as string);
  return (
    <h2 id={anchor}>
      {children}
    </h2>
  );
};

const H1 = ({ children }: PropsWithChildren<{}>) => {
  const anchor = getAnchor(children as string);
  return (
    <h1 id={anchor}>
      {children}
    </h1>
  );
}

export default function DocsLayout({ children }: PropsWithChildren<{}>) {
  return (
    <MDXProvider components={{ h1: H1, h2: H2 }}>
      <div className="container">
        <div className="columns">
          <div className="column col-3 col-sm-12">
            <ul className="nav" style={{ position: 'fixed' }}>
              <li className="nav-item">
                <Link href="#data-buckets">Buckets</Link>
                <ul className="nav">
                  <li className="nav-item">
                    <Link href="#create-your-bucket">Create</Link>
                  </li>
                  <li className="nav-item">
                    <Link href="#buckets-list">List</Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <Link href="#keys">Keys</Link>
                <ul className="nav">
                  <li className="nav-item">
                    <Link href="#create-your-bucket">Create</Link>
                  </li>
                  <li className="nav-item">
                    <Link href="#buckets-list">List</Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <Link href="#use-cases">Use cases</Link>
                <ul className="nav">
                  <li className="nav-item">
                    <Link href="#create-your-bucket">Single table design</Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <div className="column col-9 col-sm-12">
            {children}
          </div>
        </div>
      </div>
    </MDXProvider>
  )
}