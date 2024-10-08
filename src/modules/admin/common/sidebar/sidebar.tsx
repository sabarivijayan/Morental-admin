import { FC } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './sidebar.module.css';

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
}

const Sidebar: FC<SidebarProps> = ({ isVisible, onClose }) => {
  const router = useRouter();

  const handleLogout = () => {
    // Implement your log out logic here
    // For example, you might clear user session and redirect to login page
    console.log('Logging out...'); // Placeholder for logout logic
    router.push('/login'); // Redirect to login page
    onClose(); // Close the sidebar after log out
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
          <li className={styles.menuItem} onClick={() => { router.push('/add-manufacturer'); onClose(); }}>
            <Image src="/icons/building.svg" alt="Add Manufacturer" width={20} height={20} />
            Add Manufacturer
          </li>
          <li className={styles.menuItem} onClick={() => { router.push('/add-cars'); onClose(); }}>
            <Image src="/icons/car.svg" alt="Add Cars" width={20} height={20} />
            Add Cars
          </li>
          <li className={styles.menuItem} onClick={() => { router.push('/add-rentable-cars'); onClose(); }}>
            <Image src="/icons/driving.svg" alt="Add Rentable Cars" width={20} height={20} />
            Add Rentable Cars
          </li>
          <li className={styles.menuItem} onClick={() => { router.push('/add-location'); onClose(); }}>
            <Image src="/icons/location.svg" alt="Locations" width={20} height={20} />
            Locations
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
