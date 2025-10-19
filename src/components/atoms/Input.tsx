import React from 'react';
import '../../styles/input.css';
import type { InputProps } from '../../types';

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => {
    return <input ref={ref} className={`input ${className}`} {...props} />;
  }
);

Input.displayName = 'Input';
export default Input;
