import React from 'react';
import '../../styles/select.css';
import type { SelectProps } from '../../types';

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
