import React from 'react';
import '../../styles/input.css';
import type { InputProps } from '../../types';

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => {
    return <input ref={ref} className={`input ${className}`} {...props} />;
  }
);

// Set displayName for better debugging experience in React DevTools
Input.displayName = 'Input';
export default Input;
