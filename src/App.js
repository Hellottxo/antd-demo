import React from 'react';
import Tree from './views/DragAndDrop/index'
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import './App.css';
import { Layout, Menu, Icon } from 'antd';
const { Header, Content, Sider } = Layout;

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Layout style={{ height: '100%' }}>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={broken => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
        >
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">
              <Icon type="user" />
              <span className="nav-text">跨树拖拽</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }} />
          <Content style={{ margin: '24px 16px 0', height: '100%' }}>
            <div style={{ padding: 24, background: '#fff', height: '100%' }}>
              <Tree />
            </div>
          </Content>
        </Layout>
      </Layout>
    </DndProvider>
  );
}

export default App;
