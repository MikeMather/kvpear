import React from "react";

type Props = {
  title: string;
  subtitle?: string;
  body: React.ReactNode;
  footer: React.ReactNode;
}

export default function Card({ title, subtitle, body, footer }: Props) {
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title h5">{title}</div>
        <div className="card-subtitle text-gray">{subtitle}</div>
      </div>
      <div className="card-body">
        {body}
      </div>
      <div className="card-footer">
        {footer}
      </div>
    </div>
  )
}