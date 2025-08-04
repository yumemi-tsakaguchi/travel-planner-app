import { Link } from 'react-router-dom'
import styles from './Header.module.css'

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <h1>旅プランAI</h1>
        </Link>
        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>
            ホーム
          </Link>
          <Link to="/plan" className={styles.navLink}>
            プラン作成
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header