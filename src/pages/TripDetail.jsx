import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { db } from '../data/database'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import styles from './TripDetail.module.css'

const TripDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
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

  const exportToPDF = async () => {
    // 一時的にHTML要素を作成
    const tempDiv = document.createElement('div')
    tempDiv.style.position = 'absolute'
    tempDiv.style.left = '-9999px'
    tempDiv.style.width = '800px'
    tempDiv.style.fontFamily = 'Hiragino Sans, Yu Gothic, Meiryo, sans-serif'
    tempDiv.style.fontSize = '14px'
    tempDiv.style.lineHeight = '1.6'
    tempDiv.style.color = '#333'
    tempDiv.style.background = 'white'
    tempDiv.style.padding = '20px'
    
    const itinerary = generateItinerary()
    
    tempDiv.innerHTML = `
      <div style="border: 3px dashed #ff6b6b; border-radius: 15px; padding: 30px; margin: 20px; background: linear-gradient(45deg, #fff9e6 0%, #ffe4e1 100%); position: relative;">
        <!-- しおりの表紙風デザイン -->
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px double #ff6b6b; padding-bottom: 20px;">
          <div style="font-size: 14px; color: #666; margin-bottom: 10px;">🌸✈️ 旅のしおり ✈️🌸</div>
          <h1 style="color: #ff6b6b; font-size: 28px; margin: 10px 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.1); font-weight: bold;">${trip.title}</h1>
          <div style="font-size: 16px; color: #444; font-weight: bold;">
            ${new Date(trip.startDate).toLocaleDateString()} ～ ${new Date(trip.endDate).toLocaleDateString()}
          </div>
        </div>

        <!-- 基本情報 -->
        <div style="background: white; border: 2px solid #ff6b6b; border-radius: 10px; padding: 20px; margin-bottom: 25px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <h3 style="color: #ff6b6b; margin-top: 0; margin-bottom: 15px; font-size: 18px; border-bottom: 2px solid #ff6b6b; padding-bottom: 5px;">📋 基本情報</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 15px;">
            <div style="background: #fff9e6; padding: 10px; border-radius: 8px; border-left: 4px solid #ffa726;">
              <strong>📍 目的地数:</strong> ${trip.destinations?.length || 0}か所
            </div>
            <div style="background: #fff9e6; padding: 10px; border-radius: 8px; border-left: 4px solid #66bb6a;">
              <strong>⏰ 合計時間:</strong> ${formatDuration(getTotalDuration())}
            </div>
            ${trip.places && trip.places.length > 0 ? `
              <div style="background: #fff9e6; padding: 10px; border-radius: 8px; border-left: 4px solid #42a5f5; width: 100%;">
                <strong>🎯 行きたい場所:</strong> ${trip.places.join(', ')}
              </div>
            ` : ''}
            ${trip.departureLocation && trip.arrivalLocation ? `
              <div style="background: #fff9e6; padding: 10px; border-radius: 8px; border-left: 4px solid #ab47bc; width: 100%;">
                <strong>🚁 ルート:</strong> ${trip.departureLocation} → ${trip.arrivalLocation}
              </div>
            ` : ''}
            ${trip.transportation ? `
              <div style="background: #fff9e6; padding: 10px; border-radius: 8px; border-left: 4px solid #ef5350;">
                <strong>🚗 移動手段:</strong> ${(() => {
                  const transportMap = { 'flight': '✈️ 飛行機', 'train': '🚅 電車', 'car': '🚗 車', 'bus': '🚌 バス' }
                  return transportMap[trip.transportation] || trip.transportation
                })()}
              </div>
            ` : ''}
          </div>
        </div>

        <!-- 旅程表 -->
        <div style="background: white; border: 2px solid #ff6b6b; border-radius: 10px; padding: 20px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <h3 style="color: #ff6b6b; margin-top: 0; margin-bottom: 20px; font-size: 18px; border-bottom: 2px solid #ff6b6b; padding-bottom: 5px;">🗓️ 旅程表</h3>
          
          ${itinerary.map(day => `
            <div style="margin-bottom: 30px; page-break-inside: avoid;">
              <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ff8a65 100%); color: white; padding: 15px; border-radius: 12px; margin-bottom: 15px; box-shadow: 0 3px 6px rgba(0,0,0,0.2);">
                <h4 style="margin: 0; font-size: 18px; display: flex; align-items: center;">
                  <span style="background: rgba(255,255,255,0.3); border-radius: 50%; width: 30px; height: 30px; display: inline-flex; align-items: center; justify-content: center; margin-right: 10px; font-weight: bold;">${day.day}</span>
                  ${day.day}日目 - ${day.date.toLocaleDateString()}
                </h4>
              </div>
              
              ${day.destinations.map((dest, index) => {
                const description = dest.description || 
                  (dest.spotId ? db.getSpots().find(spot => spot.id === dest.spotId)?.description : null)
                return `
                  <div style="background: #fafafa; border: 1px solid #e0e0e0; border-left: 6px solid #ff6b6b; border-radius: 8px; padding: 18px; margin-bottom: 15px; position: relative; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <div style="position: absolute; top: -10px; left: 15px; background: #ff6b6b; color: white; border-radius: 50%; width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold;">${index + 1}</div>
                    
                    <div style="font-size: 18px; font-weight: bold; color: #333; margin-bottom: 8px; margin-top: 5px;">
                      📍 ${dest.name}
                    </div>
                    
                    <div style="color: #666; margin-bottom: 12px; font-size: 14px;">
                      🌍 ${dest.city}, ${dest.country}
                    </div>
                    
                    ${description ? `
                      <div style="background: #fff; border-radius: 6px; padding: 12px; margin-bottom: 12px; border-left: 3px solid #42a5f5; font-style: italic; color: #555; line-height: 1.6;">
                        💡 ${description}
                      </div>
                    ` : ''}
                    
                    <div style="background: #e8f5e8; color: #2e7d32; padding: 8px 12px; border-radius: 6px; font-size: 14px; font-weight: bold; display: inline-block;">
                      ⏰ 滞在時間: ${formatDuration(dest.stayDurationMinutes)}
                    </div>
                  </div>
                `
              }).join('')}
            </div>
          `).join('')}
        </div>

        <!-- フッター -->
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px dashed #ff6b6b; color: #666; font-size: 14px;">
          <div style="margin-bottom: 10px;">🌟 素敵な旅になりますように 🌟</div>
          <div style="font-size: 12px;">旅プランAI で作成 | ${new Date().toLocaleDateString()}</div>
        </div>
      </div>
    `
    
    document.body.appendChild(tempDiv)
    
    try {
      // HTML要素をCanvasに変換
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: 'white',
        width: 800,
        height: tempDiv.scrollHeight
      })
      
      // PDFを作成
      const doc = new jsPDF('p', 'mm', 'a4')
      const imgData = canvas.toDataURL('image/png')
      
      const pdfWidth = doc.internal.pageSize.getWidth()
      const pdfHeight = doc.internal.pageSize.getHeight()
      const imgWidth = pdfWidth - 20
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      let heightLeft = imgHeight
      let position = 10
      
      // 最初のページに画像を追加
      doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
      heightLeft -= pdfHeight - 20
      
      // 複数ページにまたがる場合の処理
      while (heightLeft > 0) {
        position = heightLeft - imgHeight + 10
        doc.addPage()
        doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
        heightLeft -= pdfHeight - 20
      }
      
      // PDFを新しいタブで開く
      const pdfBlob = doc.output('blob')
      const pdfUrl = URL.createObjectURL(pdfBlob)
      window.open(pdfUrl, '_blank')
      
    } catch (error) {
      console.error('PDF生成エラー:', error)
      alert('PDF生成中にエラーが発生しました。')
    } finally {
      // 一時要素を削除
      document.body.removeChild(tempDiv)
    }
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
              しおり
            </button>
          </div>
        </div>

        <div className={styles.summary}>
          <span className={styles.summaryItem}>📍 {trip.destinations?.length || 0}か所</span>
          <span className={styles.summaryItem}>⏰ {formatDuration(getTotalDuration())}</span>
          <span className={styles.summaryItem}>🏙️ {(trip.places || trip.cities || []).join(', ')}</span>
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
                          <p className={styles.location}>{destination.city}, {destination.country}</p>
                          {(() => {
                            // 既存のプランの場合、spotIdから説明文を取得
                            const description = destination.description || 
                              (destination.spotId ? db.getSpots().find(spot => spot.id === destination.spotId)?.description : null)
                            return description ? <p className={styles.description}>{description}</p> : null
                          })()}
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