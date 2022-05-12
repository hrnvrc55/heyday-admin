import { Form, Input, Button, Checkbox } from 'antd';
import React, {useState} from "react";
import {ApiContext} from "../provider/ApiProvider";
import axios from "axios";

const LoginPage = () => {
    const {setUser} = React.useContext(ApiContext);
    const [loading, setLoading] = useState(false);
    const onFinish = async (values) => {
        // console.log('Success:', values);
        // setUser(values);
        // localStorage.setItem('userData',JSON.stringify(values));
        setLoading(true);
        await axios.post(`/auth/login`,values).then(resp => {
            setUser(resp.data.result.user);
        }).finally(() => setLoading(false))
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className="d-flex justify-content-center align-items-center h-100">
            <div>
                <div className="mb-2">
                    <div className="d-flex justify-content-center">
                        <h3>HEYDAY</h3>
                    </div>
                    <div className="d-flex justify-content-center">
                        <small>Admin Panel</small>
                    </div>
                </div>
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    className="border p-4"
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button loading={loading} type="primary" htmlType="submit">
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            </div>

        </div>
    );
};

export default LoginPage;