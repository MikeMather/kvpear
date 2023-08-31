
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
    <div className="btn-group">
      <a href="#" className="btn">
        {icon && <i className={`icon icon-${icon}`} style={{ marginRight: '5px' }}></i>}
        {label}
      </a>
      <a href="#" className="btn dropdown-toggle" tabIndex={0}>
        <i className="icon icon-caret"></i>
      </a>

      <ul className="menu">
        {items.map((item, index) => (
         <li key={index} className="menu-item">
            <a href="#" onClick={item.action}>{item.label}</a>
          </li> 
        ))}
      </ul>
    </div>
  </div>
)