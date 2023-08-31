import Link from "next/link"
import Layout from "./layout"

export default function Custom4500() {

  const containerStyle: any = {
    height: '85vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }

  return (
    <Layout>
      <div className="empty" style={containerStyle}>
        <p className="empty-title h3">Something went wrong on our end</p>
        <p className="empty-subtitle">If the problem persists, please contact us</p>
        <div className="empty-action">
          <Link href="/" className="btn btn-primary">Go home</Link>
        </div>
      </div>
    </Layout>
  )
}