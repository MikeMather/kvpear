import Link from "next/link";
import { PropsWithChildren } from "react";
import { MDXProvider } from "@mdx-js/react";
import useAuth from "@/auth/useAuth";
import AppLayout from "../AppLayout/AppLayout";
import Layout from "@/pages/layout";

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

  const auth = useAuth();

  const Container = auth?.user ? AppLayout : Layout;

  return (
    <Container>
      <MDXProvider components={{ h1: H1, h2: H2 }}>
        <div className="container">
          <div className="columns">
            <div className="column col-3 hide-xs">
              <ul className="nav" style={{ position: 'fixed' }}>
                <li className="nav-item">
                  <Link href="#authentication">Authentication</Link>
                </li>
                <li className="nav-item">
                  <Link href="#buckets">Buckets</Link>
                  <ul className="nav">
                    <li className="nav-item">
                      <Link href="#create-bucket">Create</Link>
                    </li>
                    <li className="nav-item">
                      <Link href="#list-buckets">List</Link>
                    </li>
                    <li className="nav-item">
                      <Link href="#delete-buckets">Delete</Link>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <Link href="#kvs">Key-values</Link>
                  <ul className="nav">
                    <li className="nav-item">
                      <Link href="#create-kv">Create</Link>
                    </li>
                    <li className="nav-item">
                      <Link href="#get-kv">Retrieve</Link>
                    </li>
                    <li className="nav-item">
                      <Link href="#list-kv">List/Search</Link>
                    </li>
                    <li className="nav-item">
                      <Link href="#delete-kv">Delete</Link>
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
    </Container>
  )
}