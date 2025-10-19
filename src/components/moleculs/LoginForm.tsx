import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import '../../styles/LoginForm.css';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import Select from '../atoms/Select';

const LoginForm = () => {
  const [user, setUser] = useState('Alice');
  const [role, setRole] = useState('');
  const { login, isAuthenticated } = useAuthStore();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(user.trim(), role.trim());
    console.log('==>OK', ok);
    console.log('==>isAuthenticated', isAuthenticated);
  };

  return (
    <>
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
          <label className="input-label" htmlFor="role">
            Role
          </label>
          <Select
            id="role"
            value={role}
            aria-label="role"
            data-testid="role-input"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setRole(e.target.value)
            }
            required
          >
            <option value="" disabled>
              Select role
            </option>
            <option value="admin">Admin</option>
            <option value="contributor">Contributor</option>
          </Select>
        </div>

        <Button type="submit" aria-label="login" data-testid="submit-btn">
          Sign In
        </Button>
      </form>
    </>
  );
};
export default LoginForm;
