import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const AuthenticationForm = ({ onAuthSuccess, isLoading, setIsLoading }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Mock credentials for different user types
  const mockCredentials = {
    reception: {
      email: "reception@company.com",
      password: "reception123",
      role: "reception",
      name: "Sarah Johnson"
    },
    employee: {
      email: "employee@company.com", 
      password: "employee123",
      role: "employee",
      name: "Michael Rodriguez"
    },
    manager: {
      email: "manager@company.com",
      password: "manager123", 
      role: "manager",
      name: "Emily Chen"
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      // Check credentials against mock data
      const user = Object.values(mockCredentials)?.find(
        cred => cred?.email === formData?.email && cred?.password === formData?.password
      );

      if (user) {
        // Store user data in localStorage
        const userData = {
          ...user,
          rememberMe: formData?.rememberMe,
          loginTime: new Date()?.toISOString()
        };
        
        if (formData?.rememberMe) {
          localStorage.setItem('conferenceRoomUser', JSON.stringify(userData));
        } else {
          sessionStorage.setItem('conferenceRoomUser', JSON.stringify(userData));
        }

        onAuthSuccess(userData);
        
        // Navigate based on role
        if (user?.role === 'reception') {
          navigate('/room-calendar-view'); // Reception gets read-only calendar view
        } else {
          navigate('/dashboard-room-overview'); // Employees get full dashboard
        }
      } else {
        setErrors({
          general: `Invalid credentials. Try:\nReception: reception@company.com / reception123\nEmployee: employee@company.com / employee123\nManager: manager@company.com / manager123`
        });
      }
      
      setIsLoading(false);
    }, 1500);
  };

  const handleForgotPassword = () => {
    // Mock forgot password functionality
    alert('Password reset instructions would be sent to your email address.');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="Enter your work email"
          value={formData?.email}
          onChange={handleInputChange}
          error={errors?.email}
          required
          disabled={isLoading}
          className="w-full"
        />

        {/* Password Input */}
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter your password"
            value={formData?.password}
            onChange={handleInputChange}
            error={errors?.password}
            required
            disabled={isLoading}
            className="w-full pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
            disabled={isLoading}
          >
            <Icon name={showPassword ? "EyeOff" : "Eye"} size={18} />
          </button>
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center justify-between">
          <Checkbox
            label="Remember me"
            name="rememberMe"
            checked={formData?.rememberMe}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-primary hover:text-primary/80 transition-colors"
            disabled={isLoading}
          >
            Forgot password?
          </button>
        </div>

        {/* General Error Message */}
        {errors?.general && (
          <div className="p-3 bg-error/10 border border-error/20 rounded-md">
            <div className="flex items-start space-x-2">
              <Icon name="AlertCircle" size={16} className="text-error mt-0.5 flex-shrink-0" />
              <pre className="text-sm text-error whitespace-pre-wrap font-sans">
                {errors?.general}
              </pre>
            </div>
          </div>
        )}

        {/* Sign In Button */}
        <Button
          type="submit"
          variant="default"
          loading={isLoading}
          disabled={isLoading}
          className="w-full"
          iconName="LogIn"
          iconPosition="left"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>

        {/* Demo Credentials Helper */}
        <div className="mt-6 p-4 bg-muted/50 rounded-md border border-border">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Info" size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Demo Credentials</span>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <div><strong>Reception:</strong> reception@company.com / reception123</div>
            <div><strong>Employee:</strong> employee@company.com / employee123</div>
            <div><strong>Manager:</strong> manager@company.com / manager123</div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AuthenticationForm;