import styles from '../../styles/Game.module.css'

export default function Layout({ children }) {
  return <div className={styles.layout}>{children}</div>
}
