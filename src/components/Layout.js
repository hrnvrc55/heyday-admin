import { Button } from 'antd';
import React from "react";
import { Layout, Menu, Dropdown, Space } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
    RightCircleOutlined
} from '@ant-design/icons';
import {useState} from "react";
import {adminMenu} from "../constants/menu";
import {Link} from 'react-router-dom'
import {ApiContext} from "../provider/ApiProvider";

const { Header, Sider, Content } = Layout;

function LayoutComp(props) {
    const [collapsed, setCollapsed] = useState(false);
    const {setUser,user} = React.useContext(ApiContext);

    const menu = (
        <Menu>
            <Menu.Item>
                <a
                    target="_blank"
                    rel="noopener noreferrer"
                    className="menu-item"
                    role="button"
                    onClick={() => {
                        console.log('on click');
                        localStorage.removeItem('userData');
                        setUser(null);
                    }}
                >
                    Logout
                </a>
            </Menu.Item>
        </Menu>
    );

    const toggle = () => {
        setCollapsed(!collapsed);
    };
    return (
        <div className="App">
            <Layout>
                <Sider trigger={null} className="left-menu" collapsible collapsed={collapsed}>
                    <div className="logo">
                        <a href="/">
                            <span className="text-white">HEYDAY</span>
                        </a>
                    </div>
                    <Menu theme="dark" mode="inline">
                        {adminMenu.map((item, idx) => (
                            <Menu.Item key={idx + 1} icon={item.icon}>
                                <Link to={item.url}>{item.name}</Link>
                            </Menu.Item>
                        ))}
                        <Menu.Item className="bg-success"  key={"web-site-link"} icon={<RightCircleOutlined />}>
                            <a href="https://heydayinteriors.com/" target="_blank">Go Website</a>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout className="site-layout">
                    <Header className="site-layout-background" style={{ padding: 0 }}>
                        {collapsed ? <MenuUnfoldOutlined size={25} className="text-white" onClick={() => toggle()}/> : <MenuFoldOutlined size={25} className="text-white" onClick={() => toggle()}/> }
                        <Dropdown className="user-icon" overlay={menu} placement="bottom" arrow>
                                <Space>
                                    <UserOutlined className="text-white" size={25} />
                                    <span className="text-white">{user && user.fullName}</span>

                                </Space>
                        </Dropdown>
                    </Header>
                    <Content
                        className="site-layout-background"
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            minHeight: 280,
                        }}
                    >
                        {props.children}
                    </Content>
                </Layout>
            </Layout>
        </div>
    );
}

export default LayoutComp;
