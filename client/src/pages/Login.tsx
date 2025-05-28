import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';
import Auth from '../utils/auth';

const Login = () => {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [login, { error }] = useMutation(LOGIN_USER);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();
    
    // Log the actual form data
    console.log('Attempting login with:', {
      email: formState.email,
      password: formState.password
    });

    try {
      const { data } = await login({
        variables: {
          email: formState.email,
          password: formState.password
        },
      });

      console.log('Login response:', data);

      if (data?.login?.token) {
        console.log('Login successful, token received');
        Auth.login(data.login.token);
      } else {
        console.error('Login failed: No token received in response:', data);
        throw new Error('Login failed: No token received');
      }
    } catch (e: any) {
      console.error('Login error:', {
        message: e.message,
        networkError: e.networkError,
        graphQLErrors: e.graphQLErrors,
        stack: e.stack
      });
    }

    setFormState({
      email: '',
      password: '',
    });
  };

  return (
    <main className="flex-row justify-center mb-4">
      <div className="col-12 col-lg-10">
        <div className="card">
          <h4 className="card-header bg-dark text-light p-2">Login</h4>
          <div className="card-body">
            <form onSubmit={handleFormSubmit}>
              <input
                className="form-input"
                placeholder="Your email"
                name="email"
                type="email"
                value={formState.email}
                onChange={handleChange}
              />
              <input
                className="form-input"
                placeholder="******"
                name="password"
                type="password"
                value={formState.password}
                onChange={handleChange}
              />
              <button
                className="btn btn-block btn-primary"
                style={{ cursor: 'pointer' }}
                type="submit"
              >
                Submit
              </button>
            </form>

            {error && (
              <div className="my-3 p-3 bg-danger text-white">
                {error.message || 'An error occurred during login. Please try again.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
