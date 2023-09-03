import Link from "next/link";


export const LinkButton = ({ href = '/', children, className = '', ...props }: any) => (
  <Link href={href}>
    <a className={`btn ${className}`} {...props}>{children}</a>
  </Link>
)