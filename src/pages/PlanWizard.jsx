import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../data/database'
import styles from './PlanWizard.module.css'

const PlanWizard = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    places: [''],
    selectedInterests: [],
    travelStyle: 'relaxed' // relaxed or fast
  })

  const interests = db.getInterests()

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

  const generatePlan = () => {
    if (!validateCurrentStep()) return

    // 新しい旅行プランを作成
    const newTrip = db.createTrip({
      title: formData.title,
      startDate: formData.startDate,
      endDate: formData.endDate,
      places: formData.places.filter(place => place.trim()),
      selectedInterests: formData.selectedInterests,
      travelStyle: formData.travelStyle
    })

    // 興味に基づいてスポットを選択し、目的地として追加
    const filteredPlaces = formData.places.filter(place => place.trim())
    filteredPlaces.forEach(place => {
      // 地名やランドマーク名で検索
      const allSpots = db.getAllSpots()
      const matchingSpots = allSpots.filter(spot =>
        (spot.name.toLowerCase().includes(place.toLowerCase()) ||
         spot.city.toLowerCase().includes(place.toLowerCase()) ||
         spot.country.toLowerCase().includes(place.toLowerCase())) &&
        spot.interests.some(interest => formData.selectedInterests.includes(interest))
      )

      // 最大3つのスポットを選択
      const selectedSpots = matchingSpots.slice(0, 3)
      selectedSpots.forEach(spot => {
        db.addDestinationToTrip(newTrip.id, {
          name: spot.name,
          city: spot.city,
          country: spot.country,
          stayDurationMinutes: spot.duration,
          spotId: spot.id,
          description: spot.description
        })
      })
    })

    // 作成したプランの詳細ページに遷移
    navigate(`/trip/${newTrip.id}`)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className={styles.stepContent}>
            <h3>基本情報を入力してください</h3>
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
            <h3>行きたい場所を教えてください</h3>
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
            <h3>興味のあるジャンルを選択してください</h3>
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
            <h3>旅行スタイルを選択してください</h3>
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
              onClick={generatePlan}
              disabled={!validateCurrentStep()}
              className={styles.generateButton}
            >
              プランを生成
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default PlanWizard