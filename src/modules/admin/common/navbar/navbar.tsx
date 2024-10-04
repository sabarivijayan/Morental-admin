// components/Navbar.tsx
import Image from 'next/image';
import styles from './navbar.module.css';

interface NavbarProps {
  onToggleSidebar: () => void; // Function to toggle sidebar visibility
}

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.menuIcon} onClick={onToggleSidebar}>
        {/* Icon to toggle the sidebar */}
        <Image src="/icons/menu.svg" alt="Menu" width={24} height={24} />
      </div>
      <div className={styles.logo}>MORENT</div>
    </nav>
  );
};

export default Navbar;
