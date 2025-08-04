import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { db } from '../data/database'
import styles from './TripDetail.module.css'

const TripDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editingDestination, setEditingDestination] = useState(null)

  useEffect(() => {
    const tripData = db.getTripById(parseInt(id))
    if (tripData) {
      setTrip(tripData)
    } else {
      navigate('/')
    }
  }, [id, navigate])

  const updateDestinationTime = (destinationId, newDuration) => {
    const updated = db.updateDestination(trip.id, destinationId, {
      stayDurationMinutes: parseInt(newDuration)
    })
    if (updated) {
      setTrip(db.getTripById(trip.id))
    }
    setEditingDestination(null)
  }

  const removeDestination = (destinationId) => {
    if (window.confirm('この目的地を削除しますか？')) {
      db.removeDestinationFromTrip(trip.id, destinationId)
      setTrip(db.getTripById(trip.id))
    }
  }

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0 && mins > 0) {
      return `${hours}時間${mins}分`
    } else if (hours > 0) {
      return `${hours}時間`
    } else {
      return `${mins}分`
    }
  }

  const getTotalDuration = () => {
    if (!trip?.destinations) return 0
    return trip.destinations.reduce((total, dest) => total + dest.stayDurationMinutes, 0)
  }

  const generateItinerary = () => {
    if (!trip?.destinations) return []
    
    const days = Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24)) + 1
    const destinationsPerDay = Math.ceil(trip.destinations.length / days)
    
    const itinerary = []
    for (let day = 0; day < days; day++) {
      const dayDestinations = trip.destinations.slice(
        day * destinationsPerDay,
        (day + 1) * destinationsPerDay
      )
      if (dayDestinations.length > 0) {
        itinerary.push({
          day: day + 1,
          date: new Date(new Date(trip.startDate).getTime() + day * 24 * 60 * 60 * 1000),
          destinations: dayDestinations
        })
      }
    }
    return itinerary
  }

  const exportToPDF = () => {
    // 簡易PDF出力（実際のプロジェクトではjsPDFなどのライブラリを使用）
    const content = `
旅行プラン: ${trip.title}
期間: ${new Date(trip.startDate).toLocaleDateString()} - ${new Date(trip.endDate).toLocaleDateString()}

スケジュール:
${generateItinerary().map(day => `
${day.day}日目 (${day.date.toLocaleDateString()}):
${day.destinations.map(dest => `- ${dest.name} (${formatDuration(dest.stayDurationMinutes)})`).join('\n')}
`).join('\n')}

合計滞在時間: ${formatDuration(getTotalDuration())}
    `
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${trip.title}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!trip) {
    return <div className={styles.loading}>読み込み中...</div>
  }

  const itinerary = generateItinerary()

  return (
    <div className={styles.tripDetail}>
      <div className={styles.container}>
        <div className={styles.header}>
          <button onClick={() => navigate('/')} className={styles.backButton}>
            ← 戻る
          </button>
          <div className={styles.tripInfo}>
            <h1>{trip.title}</h1>
            <p className={styles.dates}>
              {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
            </p>
          </div>
          <div className={styles.headerActions}>
            <button onClick={() => navigate(`/trip/${trip.id}/edit`)} className={styles.editButton}>
              編集
            </button>
            <button onClick={exportToPDF} className={styles.exportButton}>
              PDF出力
            </button>
          </div>
        </div>

        <div className={styles.summary}>
          <div className={styles.summaryCard}>
            <h3>📍 目的地</h3>
            <p>{trip.destinations?.length || 0}か所</p>
          </div>
          <div className={styles.summaryCard}>
            <h3>⏰ 合計時間</h3>
            <p>{formatDuration(getTotalDuration())}</p>
          </div>
          <div className={styles.summaryCard}>
            <h3>🏙️ 都市</h3>
            <p>{trip.cities?.join(', ')}</p>
          </div>
        </div>

        <div className={styles.itinerary}>
          <h2>旅程</h2>
          {trip.destinations?.length === 0 ? (
            <div className={styles.emptyState}>
              <p>まだ目的地が追加されていません</p>
            </div>
          ) : (
            itinerary.map(day => (
              <div key={day.day} className={styles.dayCard}>
                <div className={styles.dayHeader}>
                  <h3>{day.day}日目</h3>
                  <span className={styles.date}>
                    {day.date.toLocaleDateString()}
                  </span>
                </div>
                <div className={styles.destinations}>
                  {day.destinations.map((destination, index) => (
                    <div key={destination.id} className={styles.destinationCard}>
                      <div className={styles.destinationInfo}>
                        <div className={styles.destinationNumber}>
                          {index + 1}
                        </div>
                        <div className={styles.destinationDetails}>
                          <h4>{destination.name}</h4>
                          <p>{destination.city}, {destination.country}</p>
                          <div className={styles.duration}>
                            {editingDestination === destination.id ? (
                              <div className={styles.editDuration}>
                                <input
                                  type="number"
                                  defaultValue={destination.stayDurationMinutes}
                                  onChange={(e) => {
                                    if (e.key === 'Enter') {
                                      updateDestinationTime(destination.id, e.target.value)
                                    }
                                  }}
                                  onBlur={(e) => updateDestinationTime(destination.id, e.target.value)}
                                  className={styles.durationInput}
                                  autoFocus
                                />
                                <span>分</span>
                              </div>
                            ) : (
                              <span
                                onClick={() => setEditingDestination(destination.id)}
                                className={styles.editableDuration}
                              >
                                滞在時間: {formatDuration(destination.stayDurationMinutes)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeDestination(destination.id)}
                        className={styles.removeButton}
                      >
                        削除
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default TripDetail