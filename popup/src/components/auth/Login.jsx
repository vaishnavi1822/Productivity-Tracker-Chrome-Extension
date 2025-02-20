import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const Login = ({ onToggleForm }) => {
  const { login, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    // Validate input
    if (!formData.email || !formData.password) {
      setFormError('Email and password are required');
      return;
    }

    try {
      const success = await login(formData);
      if (success) {
        console.log('Login successful');
      }
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      {(error || formError) && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
          {error || formError}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="mt-4 text-sm text-center">
        Don't have an account?{' '}
        <button
          onClick={onToggleForm}
          className="text-blue-500 hover:underline"
        >
          Register
        </button>
      </p>
    </div>
  );
};

export default Login; 