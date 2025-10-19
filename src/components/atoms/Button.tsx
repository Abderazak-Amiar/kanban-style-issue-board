import React from 'react';
import '../../styles/button.css';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <button ref={ref} className={`btn ${className}`} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
