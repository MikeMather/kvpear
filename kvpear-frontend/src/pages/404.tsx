import Layout from "./layout"

export default function Custom404() {

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
        <p className="empty-title h3">This page doesn't exist</p>
        <p className="empty-subtitle">Sorry.</p>
        <div className="empty-action">
          <a href="/" className="btn btn-primary">Go home</a>
        </div>
      </div>
    </Layout>
  )
}