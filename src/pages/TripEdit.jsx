import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { db } from '../data/database'
import styles from './PlanWizard.module.css'

const TripEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    places: [''],
    selectedInterests: [],
    travelStyle: 'relaxed'
  })

  const interests = db.getInterests()

  useEffect(() => {
    const existingTrip = db.getTripById(parseInt(id))
    if (existingTrip) {
      setTrip(existingTrip)
      // 既存の場所データを取得（後方互換性のためcitiesもチェック）
      let placesData = ['']
      if (existingTrip.places && existingTrip.places.length > 0) {
        placesData = existingTrip.places
      } else if (existingTrip.cities && existingTrip.cities.length > 0) {
        // 古いデータ形式（cities）からplacesへ変換
        placesData = existingTrip.cities
      }
      
      setFormData({
        title: existingTrip.title,
        startDate: existingTrip.startDate,
        endDate: existingTrip.endDate,
        places: placesData,
        selectedInterests: existingTrip.selectedInterests || [],
        travelStyle: existingTrip.travelStyle || 'relaxed'
      })
    } else {
      navigate('/')
    }
  }, [id, navigate])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePlaceChange = (index, value) => {
    const newPlaces = [...formData.places]
    newPlaces[index] = value
    setFormData(prev => ({
      ...prev,
      places: newPlaces
    }))
  }

  const addPlace = () => {
    setFormData(prev => ({
      ...prev,
      places: [...prev.places, '']
    }))
  }

  const removePlace = (index) => {
    if (formData.places.length > 1) {
      const newPlaces = formData.places.filter((_, i) => i !== index)
      setFormData(prev => ({
        ...prev,
        places: newPlaces
      }))
    }
  }

  const toggleInterest = (interestId) => {
    setFormData(prev => ({
      ...prev,
      selectedInterests: prev.selectedInterests.includes(interestId)
        ? prev.selectedInterests.filter(id => id !== interestId)
        : [...prev.selectedInterests, interestId]
    }))
  }

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => prev - 1)
  }

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return formData.title.trim() && formData.startDate && formData.endDate
      case 2:
        return formData.places.some(place => place.trim())
      case 3:
        return formData.selectedInterests.length > 0
      default:
        return true
    }
  }

  const updatePlan = () => {
    if (!validateCurrentStep()) return

    // 旅行プランを更新
    const updatedTrip = db.updateTrip(parseInt(id), {
      title: formData.title,
      startDate: formData.startDate,
      endDate: formData.endDate,
      places: formData.places.filter(place => place.trim()),
      selectedInterests: formData.selectedInterests,
      travelStyle: formData.travelStyle
    })

    if (updatedTrip) {
      // 既存の目的地をクリア
      updatedTrip.destinations = []
      
      // 新しい興味に基づいてスポットを再生成
      const filteredPlaces = formData.places.filter(place => place.trim())
      filteredPlaces.forEach(place => {
        const allSpots = db.getAllSpots()
        const matchingSpots = allSpots.filter(spot =>
          (spot.name.toLowerCase().includes(place.toLowerCase()) ||
           spot.city.toLowerCase().includes(place.toLowerCase()) ||
           spot.country.toLowerCase().includes(place.toLowerCase())) &&
          spot.interests.some(interest => formData.selectedInterests.includes(interest))
        )

        const selectedSpots = matchingSpots.slice(0, 3)
        selectedSpots.forEach(spot => {
          db.addDestinationToTrip(updatedTrip.id, {
            name: spot.name,
            city: spot.city,
            country: spot.country,
            stayDurationMinutes: spot.duration,
            spotId: spot.id
          })
        })
      })

      // 更新したプランの詳細ページに遷移
      navigate(`/trip/${updatedTrip.id}`)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className={styles.stepContent}>
            <h3>基本情報を編集してください</h3>
            <div className={styles.formGroup}>
              <label>旅行のタイトル</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="例: ヨーロッパ周遊の旅"
                className={styles.input}
              />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>開始日</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label>終了日</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className={styles.input}
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className={styles.stepContent}>
            <h3>行きたい場所を編集してください</h3>
            {formData.places.map((place, index) => (
              <div key={index} className={styles.cityInput}>
                <input
                  type="text"
                  value={place}
                  onChange={(e) => handlePlaceChange(index, e.target.value)}
                  placeholder="行きたい場所を入力（例：エッフェル塔、京都、富士山）"
                  className={styles.input}
                />
                {formData.places.length > 1 && (
                  <button
                    onClick={() => removePlace(index)}
                    className={styles.removeButton}
                  >
                    削除
                  </button>
                )}
              </div>
            ))}
            <button onClick={addPlace} className={styles.addButton}>
              場所を追加
            </button>
          </div>
        )

      case 3:
        return (
          <div className={styles.stepContent}>
            <h3>興味のあるジャンルを編集してください</h3>
            <div className={styles.interestGrid}>
              {interests.map(interest => (
                <button
                  key={interest.id}
                  onClick={() => toggleInterest(interest.id)}
                  className={`${styles.interestButton} ${
                    formData.selectedInterests.includes(interest.id) ? styles.selected : ''
                  }`}
                >
                  {interest.name}
                </button>
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className={styles.stepContent}>
            <h3>旅行スタイルを編集してください</h3>
            <div className={styles.styleOptions}>
              <button
                onClick={() => handleInputChange('travelStyle', 'relaxed')}
                className={`${styles.styleButton} ${
                  formData.travelStyle === 'relaxed' ? styles.selected : ''
                }`}
              >
                <h4>ゆっくり楽しみたい</h4>
                <p>各スポットでじっくり時間を過ごす</p>
              </button>
              <button
                onClick={() => handleInputChange('travelStyle', 'fast')}
                className={`${styles.styleButton} ${
                  formData.travelStyle === 'fast' ? styles.selected : ''
                }`}
              >
                <h4>サクサク回りたい</h4>
                <p>多くのスポットを効率的に巡る</p>
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (!trip) {
    return <div>読み込み中...</div>
  }

  return (
    <div className={styles.wizard}>
      <div className={styles.container}>
        <div className={styles.progress}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
          <span className={styles.progressText}>
            ステップ {currentStep} / 4
          </span>
        </div>

        {renderStep()}

        <div className={styles.actions}>
          {currentStep > 1 && (
            <button onClick={prevStep} className={styles.backButton}>
              戻る
            </button>
          )}
          {currentStep < 4 ? (
            <button
              onClick={nextStep}
              disabled={!validateCurrentStep()}
              className={styles.nextButton}
            >
              次へ
            </button>
          ) : (
            <button
              onClick={updatePlan}
              disabled={!validateCurrentStep()}
              className={styles.generateButton}
            >
              プランを更新
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default TripEdit