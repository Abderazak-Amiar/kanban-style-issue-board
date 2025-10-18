import React, { useState } from 'react';
import '../../styles/LoginForm.css';
import Button from '../atoms/Button';
import Input from '../atoms/Input';

const LoginForm = () => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('User:', user);
    console.log('Password:', password);
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2 className="login-title">Welcome</h2>
      <div className="form-group">
        <label className="input-label" htmlFor="user">
          User
        </label>
        <Input
          id="user"
          type="user"
          placeholder="Enter username"
          value={user}
          aria-label="username"
          data-testid="username-input"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setUser(e.target.value)
          }
          required
        />
      </div>

      <div className="form-group">
        <label className="input-label" htmlFor="password">
          Password
        </label>
        <Input
          id="password"
          type="password"
          placeholder="Enter password"
          value={password}
          aria-label="password"
          data-testid="password-input"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPassword(e.target.value)
          }
          required
        />
      </div>

      <Button type="submit" ria-label="login" data-testid="submit-btn">
        Sign In
      </Button>
    </form>
  );
};

export default LoginForm;
