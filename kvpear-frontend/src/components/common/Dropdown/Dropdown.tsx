
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
      <span className="btn">
        {icon && <i className={`icon icon-${icon}`} style={{ marginRight: '5px' }}></i>}
        {label}
      </span>
      <span className="btn dropdown-toggle" tabIndex={0}>
        <i className="icon icon-caret"></i>
      </span>

      <ul className="menu">
        {items.map((item, index) => (
         <li key={index} className="menu-item">
            <span onClick={item.action}>{item.label}</span>
          </li> 
        ))}
      </ul>
    </div>
  </div>
)