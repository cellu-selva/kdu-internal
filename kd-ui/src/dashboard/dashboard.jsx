import React, { useState } from "react";
import { Dashboard, Header, Sidebar } from 'react-adminlte-dash';
import { uuid } from 'uuidv4';
import { useHistory } from "react-router-dom";

const nav = () => ([
  <Header.Item href="/some/link" key="1" />
]);

const menuItems = [
  {
    title: 'Products',
    href: '/product'
  },
  {
    title: 'Stock',
    href: '/stock'
  },
  {
    title: 'Stock Summary',
    href: '/stock-summary'
  }, {
    title: 'Sales',
    href: '/sales'
  },
  {
    title: 'Vendor',
    href: '/vendor'
  },
  {
    title: 'Expense',
    href: '/expense'
  },
  {
    title: 'Report',
    href: '/report'
  }
]

const appName = () => (
  <span><b>Kadal Unavu</b></span>
)

const AppDashboard = ({ children }) => {
  const history = useHistory();
  const menu = menuItems.map(function (e) { return e.href; })
  const menuIndex = menu.indexOf(window.location.pathname);
  const [activeMenu, setActiveMenu] = useState(menuItems[menuIndex].title)
  const sb = () => ([
    <Sidebar.Menu header="" key="1">
      {menuItems.map((menu) => {
        const { title, href } = menu
        return <Sidebar.Menu.Item key={uuid()} title={title} href={href} active={title === activeMenu ? true: false } onClick={e => {
          setActiveMenu(title);
          history.push(`${href}`)
          }}/>
      })}
    </Sidebar.Menu>
  ]);

  return (
    <Dashboard
      navbarChildren={nav()}
      sidebarChildren={sb()}
      theme="skin-blue"
      logoLg={appName()}
    >
      {children}
    </Dashboard > 
  )
};

export default AppDashboard;
