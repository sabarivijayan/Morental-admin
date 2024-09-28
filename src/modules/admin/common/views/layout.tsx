// components/Layout.tsx
"use client"
import { useState } from 'react';

import styles from './layout.module.css'; // Assume you have some CSS for layout
import Navbar from '../navbar/navbar';
import Sidebar from '../sidebar/sidebar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className={styles.layoutContainer}>
      {/* Pass the toggleSidebar function as a prop */}
      <Navbar onToggleSidebar={toggleSidebar} />
      {/* Pass the sidebar visibility state and toggle function */}
      <Sidebar isVisible={isSidebarVisible} onClose={toggleSidebar} />
      <div className={styles.mainContent}>
        <div className={styles.pageContent}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
