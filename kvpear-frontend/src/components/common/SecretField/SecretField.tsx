import { ccn } from "@/styles/styleUtils";
import styles from './SecretField.module.scss';
import { useState } from "react";

export default function SecretField({ secret }: { secret: string }) {
  const [tooltip, setTooltip] = useState("Copy to clipboard");


  const onCopy = () => {
    navigator.clipboard.writeText(secret);
    setTooltip("Copied!");
    setTimeout(() => setTooltip("Copy to clipboard"), 1000);
  };

  return (
    <div className="input-group">
      <input 
        className={ccn("form-input", styles.field)}
        type="password" 
        value={secret} 
        disabled
      />
      <button 
        className={ccn("btn btn-link input-group-btn tooltip", styles.field_button)} 
        data-tooltip={tooltip}
        onClick={onCopy}
      >
        <i className="icon icon-copy"></i>
      </button>
    </div>
  )
}