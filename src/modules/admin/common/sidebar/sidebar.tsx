import { FC } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './sidebar.module.css';
import cookies from 'js-cookie'


interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
}

const Sidebar: FC<SidebarProps> = ({ isVisible, onClose }) => {
  const router = useRouter();

  const handleLogout = () => {
    // Clear user session or token
    cookies.remove('adminToken'); // Assuming the token is stored in cookies

    // Redirect to the login page
    router.push('/');

    // Close the sidebar after logging out
    onClose();
  };

  return (
    <div
      className={`${styles.sidebar} ${isVisible ? styles.visible : ''}`}
    >
      {/* Close button */}
      <div className={styles.closeButton} onClick={onClose}>
        <Image src="/icons/close-square.svg" alt="Close" width={24} height={24} />
      </div>

      <div className={styles.menu}>
        <h3 className={styles.menuHeader}>Main Menu</h3>
        <ul className={styles.menuList}>
          <li className={styles.menuItem} onClick={() => { router.push('/dashboard'); onClose(); }}>
            <Image src="/icons/home.svg" alt="Dashboard" width={20} height={20} />
            Dashboard
          </li>
          <li className={styles.menuItem} onClick={() => { router.push('/list-manufacturers'); onClose(); }}>
            <Image src="/icons/building.svg" alt="Add Manufacturer" width={20} height={20} />
            Manufacturers
          </li>
          <li className={styles.menuItem} onClick={() => { router.push('/list-cars'); onClose(); }}>
            <Image src="/icons/car.svg" alt="Add Cars" width={20} height={20} />
            Cars
          </li>
          <li className={styles.menuItem} onClick={() => { router.push('/list-rentable-cars'); onClose(); }}>
            <Image src="/icons/driving.svg" alt="Add Rentable Cars" width={20} height={20} />
            Rentable Cars
          </li>
          <li className={styles.menuItem} onClick={() => { router.push('/booked-cars'); onClose(); }}>
            <Image src="/icons/smart-car.svg" alt="Booked Cars" width={20} height={20} />
            Booked Cars
          </li>
        </ul>
      </div>

      {/* Divider */}
      <div className={styles.divider}></div>

      {/* Log Out Button */}
      <div className={styles.logoutContainer}>
        <li className={styles.menuItem} onClick={handleLogout}>
          <Image src="/icons/logout.svg" alt="Logout" width={20} height={20} />
          Log Out
        </li>
      </div>
    </div>
  );
};

export default Sidebar;
