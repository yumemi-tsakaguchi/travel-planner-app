import { Link, useLocation } from 'react-router-dom'
import styles from './Header.module.css'

const Header = () => {
  const location = useLocation()
  const isPlanPage = location.pathname === '/plan'
  const isEditPage = location.pathname.includes('/edit')

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <h1>旅プランAI</h1>
        </Link>
        {(isPlanPage || isEditPage) && (
          <nav className={styles.nav}>
            <Link to="/" className={styles.navLink}>
              ホーム
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header