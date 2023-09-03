import { ccn } from "@/styles/styleUtils";
import { PropsWithChildren, useCallback, useState } from "react"

type Props = PropsWithChildren<{
  title: string;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}>

const sizes: {[key: string]: string} = {
  sm: 'modal-sm',
  md: '',
  lg: 'modal-lg',
}

export const useModal = (defaultOpen?: boolean) => {
  const [open, setOpen] = useState(!!defaultOpen);

  const toggleModal = () => {
    setOpen(!open);
  };

  const Modal = useCallback(({ title, subtitle, children, className='', size='md' }: Props) => (
    <div className={ccn('modal', sizes[size], { active: open })} id="modal-id">
      <a onClick={toggleModal} className="modal-overlay" aria-label="Close"></a>
      <div className={ccn("modal-container", className)}>
        <div className="modal-header">
          <button className="btn btn-clear float-right" aria-label="Close" onClick={toggleModal}></button>
          <div className="modal-title h5">{title}</div>
          {subtitle && <div className="modal-subtitle">{subtitle}</div>}
        </div>
        <div className="modal-body">
          <div className="content">
            {children}
          </div>
        </div>
      </div>
    </div>
  ), [open, toggleModal]);


  return {
    Modal,
    open,
    toggleModal
  }
};
