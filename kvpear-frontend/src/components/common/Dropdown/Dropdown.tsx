
type DropdownMenutItem = {
  label: string;
  action: () => void;
}

type DropdownProps = {
  icon?: string;
  items: DropdownMenutItem[];
  label: string;
}

export const Dropdown = ({ icon, label, items }: DropdownProps) => (
  <div className="dropdown">
    <button className="btn btn-link dropdown-toggle" tabIndex={0}>
      {icon && <i className={`icon icon-${icon}`} style={{ marginRight: '8px' }}></i>}
      {label}
      <i className="icon icon-caret" style={{ marginLeft: '10px' }}></i>
    </button>
    <ul className="menu">
      {items.map((item, index) => (
        <li key={index} className="menu-item">
          <span className="btn btn-link" onClick={item.action}>{item.label}</span>
        </li> 
      ))}
    </ul>
  </div>
)