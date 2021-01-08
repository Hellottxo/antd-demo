// import "core-js/proposals/string-replace-all"
// import 'regenerator-runtime/runtime';
// import 'core-js/stable';
import React from 'react';
import Tree from './views/DragAndDrop/index'
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import './App.css';
import { UserOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import Chart from './views/Charts';
const { Header, Content, Sider } = Layout;

function App() {
  const str = '1/2/3/4/5';
  console.log(str.replaceAll('/', '-'));
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
              <UserOutlined />
              <span className="nav-text">跨树拖拽</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }} />
          <Content style={{ margin: '24px 16px 0', height: '100%' }}>
            <div style={{ padding: 24, background: '#fff', height: '100%' }}>
              <Tree />
              <Chart />
            </div>
          </Content>
        </Layout>
      </Layout>
    </DndProvider>
  );
}

export default App;
