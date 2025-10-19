import React from 'react';
import '../../styles/select.css';
type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <select ref={ref} className={`select ${className}`} {...props}>
        {children}
      </select>
    );
  }
);

Select.displayName = 'Select';
export default Select;
