import React from "react"

type Props = {
  onButtonClick: () => void
  title: React.ReactNode
  subtitle: React.ReactNode
  iconClass: string
  buttonText: React.ReactNode
}

export default function Empty({ onButtonClick, title, subtitle, iconClass, buttonText }: Props) {
  return (
    <div className="empty">
      <div className="empty-icon">
        <i className={iconClass} style={{ margin: '0 auto 30px auto' }}></i>
      </div>
      <p className="empty-title h5">{title}</p>
      <div className="empty-subtitle">{subtitle}</div>
      <div className="empty-action">
        <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={onButtonClick}>{buttonText}</button>
      </div>
    </div>
  )
}