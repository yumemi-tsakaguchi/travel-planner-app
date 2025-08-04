// データベース代替のローカルストレージ管理
class LocalDatabase {
  constructor() {
    this.initializeDatabase();
  }

  initializeDatabase() {
    // 興味ジャンルのマスターデータを初期化
    if (!localStorage.getItem('interests')) {
      const defaultInterests = [
        { id: 1, name: '歴史' },
        { id: 2, name: 'グルメ' },
        { id: 3, name: '絶景' },
        { id: 4, name: 'カフェ' },
        { id: 5, name: '美術館' },
        { id: 6, name: '神社・寺' },
        { id: 7, name: 'ショッピング' },
        { id: 8, name: '自然' }
      ];
      localStorage.setItem('interests', JSON.stringify(defaultInterests));
    }

    // サンプルスポットデータを初期化
    if (!localStorage.getItem('spots')) {
      const sampleSpots = [
        // パリのスポット
        { id: 1, name: 'パリ歴史博物館', city: 'パリ', country: 'フランス', interests: [1], duration: 90 },
        { id: 2, name: 'ノートルダム大聖堂', city: 'パリ', country: 'フランス', interests: [1, 6], duration: 45 },
        { id: 3, name: 'モンマルトルのカフェ', city: 'パリ', country: 'フランス', interests: [4], duration: 60 },
        { id: 4, name: 'ルーヴル美術館', city: 'パリ', country: 'フランス', interests: [5], duration: 180 },
        { id: 5, name: 'エッフェル塔', city: 'パリ', country: 'フランス', interests: [3], duration: 90 },
        
        // ローマのスポット
        { id: 6, name: 'コロッセオ', city: 'ローマ', country: 'イタリア', interests: [1], duration: 120 },
        { id: 7, name: 'トレビの泉', city: 'ローマ', country: 'イタリア', interests: [3], duration: 30 },
        { id: 8, name: 'バチカン美術館', city: 'ローマ', country: 'イタリア', interests: [5, 6], duration: 150 },
        { id: 9, name: 'パンテオン', city: 'ローマ', country: 'イタリア', interests: [1, 6], duration: 45 },
        { id: 10, name: 'ローマの地元レストラン', city: 'ローマ', country: 'イタリア', interests: [2], duration: 120 },
        
        // 東京のスポット
        { id: 11, name: '浅草寺', city: '東京', country: '日本', interests: [1, 6], duration: 60 },
        { id: 12, name: '築地市場', city: '東京', country: '日本', interests: [2], duration: 90 },
        { id: 13, name: '東京国立博物館', city: '東京', country: '日本', interests: [1, 5], duration: 120 },
        { id: 14, name: '表参道ヒルズ', city: '東京', country: '日本', interests: [7], duration: 120 },
        { id: 15, name: '新宿御苑', city: '東京', country: '日本', interests: [8, 3], duration: 90 }
      ];
      localStorage.setItem('spots', JSON.stringify(sampleSpots));
    }

    // ユーザーデータを初期化
    if (!localStorage.getItem('users')) {
      localStorage.setItem('users', JSON.stringify([]));
    }

    // 旅行プランデータを初期化
    if (!localStorage.getItem('trips')) {
      localStorage.setItem('trips', JSON.stringify([]));
    }
  }

  // ユーザー管理
  createUser(userData) {
    const users = this.getUsers();
    const newUser = {
      id: Date.now(),
      ...userData,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return newUser;
  }

  getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
  }

  // 興味ジャンル管理
  getInterests() {
    return JSON.parse(localStorage.getItem('interests') || '[]');
  }

  // スポット管理
  getSpots() {
    return JSON.parse(localStorage.getItem('spots') || '[]');
  }

  getAllSpots() {
    return this.getSpots();
  }

  getSpotsByCity(city) {
    const spots = this.getSpots();
    return spots.filter(spot => spot.city === city);
  }

  getSpotsByInterests(interestIds) {
    const spots = this.getSpots();
    return spots.filter(spot => 
      spot.interests.some(interest => interestIds.includes(interest))
    );
  }

  // 旅行プラン管理
  createTrip(tripData) {
    const trips = this.getTrips();
    const newTrip = {
      id: Date.now(),
      ...tripData,
      createdAt: new Date().toISOString(),
      destinations: []
    };
    trips.push(newTrip);
    localStorage.setItem('trips', JSON.stringify(trips));
    return newTrip;
  }

  getTrips() {
    return JSON.parse(localStorage.getItem('trips') || '[]');
  }

  getTripById(id) {
    const trips = this.getTrips();
    return trips.find(trip => trip.id === id);
  }

  updateTrip(id, updates) {
    const trips = this.getTrips();
    const index = trips.findIndex(trip => trip.id === id);
    if (index !== -1) {
      trips[index] = { ...trips[index], ...updates };
      localStorage.setItem('trips', JSON.stringify(trips));
      return trips[index];
    }
    return null;
  }

  deleteTrip(id) {
    const trips = this.getTrips();
    const filteredTrips = trips.filter(trip => trip.id !== id);
    localStorage.setItem('trips', JSON.stringify(filteredTrips));
    return true;
  }

  // 目的地管理
  addDestinationToTrip(tripId, destinationData) {
    const trip = this.getTripById(tripId);
    if (trip) {
      const newDestination = {
        id: Date.now(),
        ...destinationData,
        order: trip.destinations.length + 1
      };
      trip.destinations.push(newDestination);
      this.updateTrip(tripId, { destinations: trip.destinations });
      return newDestination;
    }
    return null;
  }

  updateDestination(tripId, destinationId, updates) {
    const trip = this.getTripById(tripId);
    if (trip) {
      const index = trip.destinations.findIndex(dest => dest.id === destinationId);
      if (index !== -1) {
        trip.destinations[index] = { ...trip.destinations[index], ...updates };
        this.updateTrip(tripId, { destinations: trip.destinations });
        return trip.destinations[index];
      }
    }
    return null;
  }

  removeDestinationFromTrip(tripId, destinationId) {
    const trip = this.getTripById(tripId);
    if (trip) {
      trip.destinations = trip.destinations.filter(dest => dest.id !== destinationId);
      // 順番を再調整
      trip.destinations.forEach((dest, index) => {
        dest.order = index + 1;
      });
      this.updateTrip(tripId, { destinations: trip.destinations });
      return true;
    }
    return false;
  }

  // データのリセット（開発用）
  resetDatabase() {
    localStorage.removeItem('interests');
    localStorage.removeItem('spots');
    localStorage.removeItem('users');
    localStorage.removeItem('trips');
    this.initializeDatabase();
  }
}

// シングルトンインスタンスをエクスポート
export const db = new LocalDatabase();