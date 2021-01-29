import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  withRouter
} from "react-router-dom";
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import './App.css';
import { Layout, Menu } from 'antd';
import menu from './routes';

const { Header, Content, Sider } = Layout;

const LeftSider = withRouter((props) => (
  <Menu
    theme="dark"
    mode="inline"
    selectedKeys={[props.location.pathname]}
  >
    {menu.map((e) => (
      <Menu.Item key={e.path}>
        <Link key={e.path} className="nav-text" to={e.path}>{e.title}</Link>
      </Menu.Item>
    ))}
  </Menu>
))

const App = () => (
  <DndProvider backend={HTML5Backend}>
    <Router>
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
          <LeftSider />
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }} />
          <Content style={{ margin: '24px 16px 0', height: '100%', overflow: 'auto' }}>
            <Switch>
              {menu.map((e) => (
                <Route key={e.path} path={e.path} component={e.component} />
              ))}
            </Switch>
          </Content>
        </Layout>
      </Layout>
    </Router>
  </DndProvider>
);

export default App;
