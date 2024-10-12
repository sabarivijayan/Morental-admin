"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Alert } from 'antd';
import adminLoginService from '@/services/login-services';
import { LoginFormField } from '@/interfaces/login';
import styles from './login-page.module.css'; // Import CSS module

const Login: React.FC = () => {
    const [email, setEmail] = useState<LoginFormField['email']>('');
    const [password, setPassword] = useState<LoginFormField['password']>('');
    const [errorLogin, setErrorLogin] = useState<string>('');

    const router = useRouter();
    const { login, loading } = adminLoginService();

    const handleSubmit = async () => {
        setErrorLogin('');

        try {
            await login(email, password);
            setTimeout(() => {
                router.push('/');
            }, 1000);
        } catch (error) {
            if (error instanceof Error) {
                setErrorLogin(error.message);
            } else {
                setErrorLogin('An unexpected error occurred during login');
            }
        }
    };

    return (
        <div className={styles.container}>
            <Form
                name="login"
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please enter your email!' }]}
                    className={styles.formItem}
                >
                    <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className={styles.input}
                    />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please enter your password!' }]}
                    className={styles.formItem}
                >
                    <Input.Password
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className={styles.input}
                    />
                </Form.Item>

                {errorLogin && (
                    <Alert
                        message={errorLogin}
                        type="error"
                        showIcon
                        className={styles.errorAlert}
                    />
                )}

                <Form.Item className={styles.formItem}>
                    <Button type="primary" htmlType="submit" loading={loading} className={styles.loginButton}>
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Login;
