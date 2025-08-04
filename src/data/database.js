// データベース代替のローカルストレージ管理
class LocalDatabase {
  constructor() {
    this.initializeDatabase();
  }

  // データのリセット（開発用）
  resetDatabase() {
    localStorage.removeItem('interests');
    localStorage.removeItem('spots');
    localStorage.removeItem('users');
    localStorage.removeItem('trips');
  }

  initializeDatabase() {
    // 開発用：データベースを強制的にリセット（説明文を追加したため）
    this.resetDatabase()
    
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
        { id: 1, name: 'パリ歴史博物館', city: 'パリ', country: 'フランス', interests: [1], duration: 90, description: 'パリの歴史を学べる充実した展示が魅力。古代から現代まで、パリの変遷を時代順に辿ることができます。' },
        { id: 2, name: 'ノートルダム大聖堂', city: 'パリ', country: 'フランス', interests: [1, 6], duration: 45, description: 'ゴシック建築の傑作として知られる大聖堂。美しいステンドグラスと荘厳な雰囲気が訪れる人を魅了します。' },
        { id: 3, name: 'モンマルトルのカフェ', city: 'パリ', country: 'フランス', interests: [4], duration: 60, description: '芸術家が集う丘の上のカフェ。パリの街並みを見下ろしながら、本格的なフランスコーヒーを楽しめます。' },
        { id: 4, name: 'ルーヴル美術館', city: 'パリ', country: 'フランス', interests: [5], duration: 180, description: '世界最大級の美術館。モナリザをはじめとする名作の数々と、美しいガラスのピラミッドが印象的です。' },
        { id: 5, name: 'エッフェル塔', city: 'パリ', country: 'フランス', interests: [3], duration: 90, description: 'パリのシンボルとして愛される鉄塔。展望台からの眺めは絶景で、夜のライトアップも必見です。' },
        
        // ローマのスポット
        { id: 6, name: 'コロッセオ', city: 'ローマ', country: 'イタリア', interests: [1], duration: 120, description: '古代ローマ時代の円形闘技場。当時の迫力ある戦いの舞台を見学し、古代の歴史に思いを馳せることができます。' },
        { id: 7, name: 'トレビの泉', city: 'ローマ', country: 'イタリア', interests: [3], duration: 30, description: 'バロック様式の美しい噴水。コインを投げ入れると再びローマを訪れることができるという言い伝えがあります。' },
        { id: 8, name: 'バチカン美術館', city: 'ローマ', country: 'イタリア', interests: [5, 6], duration: 150, description: 'システィーナ礼拝堂のミケランジェロの天井画は圧巻。宗教美術の宝庫として世界中から注目を集めています。' },
        { id: 9, name: 'パンテオン', city: 'ローマ', country: 'イタリア', interests: [1, 6], duration: 45, description: '古代ローマ建築の傑作。巨大なドームと中央の天窓から差し込む光が神秘的な空間を演出します。' },
        { id: 10, name: 'ローマの地元レストラン', city: 'ローマ', country: 'イタリア', interests: [2], duration: 120, description: '本場のイタリア料理を堪能。カルボナーラやアマトリチャーナなど、ローマ伝統の味を味わえます。' },
        
        // 東京のスポット
        { id: 11, name: '浅草寺', city: '東京', country: '日本', interests: [1, 6], duration: 60, description: '東京最古の寺院。雷門から本堂まで続く仲見世通りでは、伝統的な日本の雰囲気を楽しめます。' },
        { id: 12, name: '築地市場', city: '東京', country: '日本', interests: [2], duration: 90, description: '新鮮な海鮮が味わえる市場。早朝のマグロの競りや、職人が握る絶品寿司を堪能できます。' },
        { id: 13, name: '東京国立博物館', city: '東京', country: '日本', interests: [1, 5], duration: 120, description: '日本の文化遺産を展示する国内最大の博物館。国宝や重要文化財など、貴重な作品を数多く所蔵しています。' },
        { id: 14, name: '表参道ヒルズ', city: '東京', country: '日本', interests: [7], duration: 120, description: '最新のファッションとトレンドが集まるショッピングスポット。建築美も楽しめる洗練された空間です。' },
        { id: 15, name: '新宿御苑', city: '東京', country: '日本', interests: [8, 3], duration: 90, description: '都心のオアシスとして親しまれる庭園。四季折々の美しい景色と、静寂な空間でリラックスできます。' }
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

}

// シングルトンインスタンスをエクスポート
export const db = new LocalDatabase();