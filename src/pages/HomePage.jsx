import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../data/database'
import styles from './HomePage.module.css'

const HomePage = () => {
  const [trips, setTrips] = useState([])

  useEffect(() => {
    setTrips(db.getTrips())
  }, [])

  const deleteTrip = (id) => {
    if (window.confirm('このプランを削除しますか？')) {
      db.deleteTrip(id)
      setTrips(db.getTrips())
    }
  }

  return (
    <div className={styles.homepage}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h2>あなただけの旅プランを作成しましょう</h2>
          <p>AIが最適なルートと時間配分を提案し、理想の旅行を実現します</p>
          <Link to="/plan" className={styles.ctaButton}>
            プラン作成を開始
          </Link>
        </div>
      </section>

      <section className={styles.myTrips}>
        <h3>あなたのプラン</h3>
        {trips.length === 0 ? (
          <div className={styles.emptyState}>
            <p>まだプランがありません</p>
            <Link to="/plan" className={styles.createButton}>
              最初のプランを作成
            </Link>
          </div>
        ) : (
          <div className={styles.tripGrid}>
            {trips.map(trip => (
              <div key={trip.id} className={styles.tripCard}>
                <div className={styles.tripHeader}>
                  <h4>{trip.title}</h4>
                  <div className={styles.tripActions}>
                    <Link to={`/trip/${trip.id}`} className={styles.viewButton}>
                      詳細
                    </Link>
                    <button
                      onClick={() => deleteTrip(trip.id)}
                      className={styles.deleteButton}
                    >
                      削除
                    </button>
                  </div>
                </div>
                <div className={styles.tripInfo}>
                  <p className={styles.dates}>
                    {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                  </p>
                  <p className={styles.destinations}>
                    {trip.destinations?.length || 0}か所の目的地
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default HomePage