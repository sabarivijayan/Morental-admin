"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Alert } from 'antd';
import adminLoginService from '@/services/login-services';
import { LoginFormField } from '@/interfaces/login';
import styles from './login-page.module.css'; // Import CSS module for styling

const Login: React.FC = () => {
    // State for storing email and password inputs
    const [email, setEmail] = useState<LoginFormField['email']>('');
    const [password, setPassword] = useState<LoginFormField['password']>('');
    const [errorLogin, setErrorLogin] = useState<string>(''); // State for handling login errors

    const router = useRouter(); // Hook to access router for navigation
    const { login, loading } = adminLoginService(); // Destructure login function and loading state from the service

    // Handler for form submission
    const handleSubmit = async () => {
        setErrorLogin(''); // Reset any previous error messages

        try {
            // Attempt to log in with provided email and password
            await login(email, password);
            // Redirect to dashboard after successful login
            setTimeout(() => {
                router.push('/dashboard');
            }, 1000); // Add a slight delay before redirecting
        } catch (error) {
            // Handle any errors during login
            if (error instanceof Error) {
                setErrorLogin(error.message); // Set error message from caught error
            } else {
                setErrorLogin('An unexpected error occurred during login'); // Fallback error message
            }
        }
    };

    return (
        <div className={styles.container}>
            <Form
                name="login" // Name for the form
                layout="vertical" // Vertical layout for form items
                onFinish={handleSubmit} // Handler for form submission
            >
                <Form.Item
                    label="Email" // Label for email input
                    name="email" // Name for the form field
                    rules={[{ required: true, message: 'Please enter your email!' }]} // Validation rules
                    className={styles.formItem}
                >
                    <Input
                        value={email} // Bind email state to input value
                        onChange={(e) => setEmail(e.target.value)} // Update state on input change
                        placeholder="Enter your email" // Placeholder text for email input
                        className={styles.input}
                    />
                </Form.Item>

                <Form.Item
                    label="Password" // Label for password input
                    name="password" // Name for the form field
                    rules={[{ required: true, message: 'Please enter your password!' }]} // Validation rules
                    className={styles.formItem}
                >
                    <Input.Password
                        value={password} // Bind password state to input value
                        onChange={(e) => setPassword(e.target.value)} // Update state on input change
                        placeholder="Enter your password" // Placeholder text for password input
                        className={styles.input}
                    />
                </Form.Item>

                {errorLogin && (
                    <Alert
                        message={errorLogin} // Display error message
                        type="error" // Type of alert
                        showIcon // Show icon next to alert
                        className={styles.errorAlert} // Styling for error alert
                    />
                )}

                <Form.Item className={styles.formItem}>
                    <Button
                        type="primary" // Button style type
                        htmlType="submit" // HTML type for form submission
                        loading={loading} // Show loading spinner if loading
                        className={styles.loginButton}
                    >
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Login;
