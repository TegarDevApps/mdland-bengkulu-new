import { Villa, Event, Restaurant, DiningItem, Booking, User, MapMarker, Wahana } from '../types';

// ─── VILLAS AT MDLAND BENGKULU ─────────────────────────────
export const VILLAS: Villa[] = [
  // === STANDARD (5) ===
  { id: 'v-s1', name: 'Standard Coastal Room', description: 'Kamar standar yang nyaman dengan balkon menghadap area resort. Pilihan ekonomis tanpa mengorbankan kenyamanan.', images: [require('../../assets/villas/Standard-Coastal-Room.jpg')], pricePerNight: 800000, maxGuests: 2, bedrooms: 1, bathrooms: 1, amenities: ['Balcony','AC','WiFi','TV'], rating: 4.5, available: true, category: 'standard' },
  { id: 'v-s2', name: 'Standard Garden Room', description: 'Kamar standar dengan pemandangan taman hijau. Tenang, bersih, dan nyaman untuk liburan singkat.', images: [require('../../assets/villas/Standard-Garden-Room.jpg')], pricePerNight: 750000, maxGuests: 2, bedrooms: 1, bathrooms: 1, amenities: ['Garden View','AC','WiFi','TV'], rating: 4.4, available: true, category: 'standard' },
  { id: 'v-s3', name: 'Standard Twin Room', description: 'Kamar twin bed cocok untuk teman atau keluarga kecil. Lokasi strategis dekat kolam renang utama.', images: [require('../../assets/villas/Standard-Twin-Room.jpg')], pricePerNight: 850000, maxGuests: 2, bedrooms: 1, bathrooms: 1, amenities: ['Twin Beds','AC','WiFi','TV','Pool Access'], rating: 4.3, available: true, category: 'standard' },
  { id: 'v-s4', name: 'Standard Pool View', description: 'Kamar standar dengan pemandangan kolam renang. Akses langsung ke area pool dan sun deck.', images: [require('../../assets/villas/Standard-Pool-View.jpg')], pricePerNight: 900000, maxGuests: 2, bedrooms: 1, bathrooms: 1, amenities: ['Pool View','AC','WiFi','TV','Pool Access'], rating: 4.5, available: true, category: 'standard' },
  { id: 'v-s5', name: 'Standard Economy', description: 'Pilihan paling terjangkau di MDLAND. Kamar bersih dengan fasilitas esensial untuk budget traveler.', images: [require('../../assets/villas/Standard-Economy.jpg')], pricePerNight: 650000, maxGuests: 2, bedrooms: 1, bathrooms: 1, amenities: ['AC','WiFi','TV'], rating: 4.2, available: true, category: 'standard' },

  // === DELUXE (5) ===
  { id: 'v-d1', name: 'Garden Retreat Villa', description: 'Villa nyaman dikelilingi taman tropis hijau. Dilengkapi kolam rendam, bathtub outdoor, dan furnitur natural dari rotan.', images: [require('../../assets/villas/Garden-Retreat-Villa.jpg')], pricePerNight: 1500000, maxGuests: 2, bedrooms: 1, bathrooms: 1, amenities: ['Plunge Pool','Garden View','Outdoor Bath','AC','WiFi'], rating: 4.7, available: true, category: 'deluxe' },
  { id: 'v-d2', name: 'Family Beach House', description: 'Rumah pantai luas untuk keluarga. Dua kamar tidur, ruang keluarga terbuka, dan halaman bermain anak menghadap laut.', images: [require('../../assets/villas/Family-Beach-House.jpg')], pricePerNight: 2000000, maxGuests: 6, bedrooms: 2, bathrooms: 2, amenities: ['Kids Area','Ocean View','Kitchen','Garden','AC','WiFi'], rating: 4.8, available: true, category: 'deluxe' },
  { id: 'v-d3', name: 'Deluxe Lagoon Villa', description: 'Villa deluxe menghadap laguna buatan. Teras privat dengan kolam rendam dan kursi berjemur.', images: [require('../../assets/villas/Deluxe-Lagoon-Villa.jpg')], pricePerNight: 1800000, maxGuests: 3, bedrooms: 1, bathrooms: 1, amenities: ['Lagoon View','Plunge Pool','Terrace','AC','WiFi','Mini Bar'], rating: 4.7, available: true, category: 'deluxe' },
  { id: 'v-d4', name: 'Deluxe Corner Villa', description: 'Villa sudut dengan ruang ekstra dan dua sisi jendela panoramik. Privasi lebih dengan lokasi ujung resort.', images: [require('../../assets/villas/Deluxe-Corner-Villa.jpg')], pricePerNight: 1650000, maxGuests: 4, bedrooms: 2, bathrooms: 1, amenities: ['Corner Unit','Panoramic View','AC','WiFi','Mini Bar'], rating: 4.6, available: true, category: 'deluxe' },
  { id: 'v-d5', name: 'Deluxe Terrace Suite', description: 'Suite deluxe dengan teras luas menghadap taman dan kolam utama. Ruang tamu terpisah dari kamar tidur.', images: [require('../../assets/villas/Deluxe-Terrace-Suite.jpg')], pricePerNight: 1900000, maxGuests: 3, bedrooms: 1, bathrooms: 1, amenities: ['Terrace','Pool View','Living Room','AC','WiFi','Mini Bar'], rating: 4.8, available: false, category: 'deluxe' },

  // === PREMIUM (5) ===
  { id: 'v-p1', name: 'Ocean Breeze Villa', description: 'Villa premium menghadap laut dengan kolam renang pribadi, teras luas, dan akses langsung ke pantai.', images: [require('../../assets/villas/Ocean-Breeze-Villa.jpg')], pricePerNight: 2500000, maxGuests: 4, bedrooms: 2, bathrooms: 2, amenities: ['Private Pool','Ocean View','Beach Access','AC','WiFi','Mini Bar'], rating: 4.9, available: true, category: 'premium' },
  { id: 'v-p2', name: 'Premium Cliff Villa', description: 'Villa premium di atas tebing dengan infinity pool menghadap Samudera Hindia. Pengalaman eksklusif.', images: [require('../../assets/villas/Premium-Cliff-Villa.jpg')], pricePerNight: 2800000, maxGuests: 4, bedrooms: 2, bathrooms: 2, amenities: ['Infinity Pool','Cliff View','Butler Service','AC','WiFi','Mini Bar'], rating: 4.9, available: true, category: 'premium' },
  { id: 'v-p3', name: 'Premium Beachfront', description: 'Villa langsung di bibir pantai. Bangun dengan suara ombak dan nikmati sunrise dari tempat tidur.', images: [require('../../assets/villas/Premium-Beachfront.jpg')], pricePerNight: 2700000, maxGuests: 4, bedrooms: 2, bathrooms: 2, amenities: ['Beachfront','Private Deck','Outdoor Shower','AC','WiFi','Mini Bar'], rating: 4.8, available: true, category: 'premium' },
  { id: 'v-p4', name: 'Premium Honeymoon', description: 'Villa romantis untuk pasangan. Dilengkapi jacuzzi outdoor, candle dinner setup, dan champagne welcome.', images: [require('../../assets/villas/Premium-Honeymoon.jpg')], pricePerNight: 3000000, maxGuests: 2, bedrooms: 1, bathrooms: 1, amenities: ['Jacuzzi','Candle Dinner','Champagne','Ocean View','AC','WiFi'], rating: 5.0, available: true, category: 'premium' },
  { id: 'v-p5', name: 'Premium Family Grand', description: 'Villa premium luas untuk keluarga besar. Tiga kamar tidur, dapur lengkap, dan area bermain anak.', images: [require('../../assets/villas/Premium-Family-Grand.jpg')], pricePerNight: 3200000, maxGuests: 8, bedrooms: 3, bathrooms: 3, amenities: ['Private Pool','Kids Area','Kitchen','Garden','AC','WiFi','BBQ Area'], rating: 4.8, available: true, category: 'premium' },

  // === SUITE (5) ===
  { id: 'v-su1', name: 'Sunset Suite', description: 'Suite eksklusif di lantai atas dengan pemandangan matahari terbenam yang spektakuler. Glass balcony dan jacuzzi privat.', images: [require('../../assets/villas/Sunset-Suite.jpg')], pricePerNight: 3500000, maxGuests: 2, bedrooms: 1, bathrooms: 1, amenities: ['Jacuzzi','Sunset View','Glass Balcony','Butler Service','Mini Bar'], rating: 5.0, available: true, category: 'suite' },
  { id: 'v-su2', name: 'Presidential Suite', description: 'Suite terluas dan termewah di MDLAND. Ruang tamu megah, dapur privat, dan butler 24 jam.', images: [require('../../assets/villas/Presidential-Suite.jpg')], pricePerNight: 5000000, maxGuests: 4, bedrooms: 2, bathrooms: 2, amenities: ['Private Pool','Butler 24h','Grand Living Room','Kitchen','Sunset View','Wine Cellar'], rating: 5.0, available: true, category: 'suite' },
  { id: 'v-su3', name: 'Royal Ocean Suite', description: 'Suite royal dengan pemandangan 180° laut. Bathtub marmer, rain shower, dan teleskop di balkon.', images: [require('../../assets/villas/Royal-Ocean-Suite.jpg')], pricePerNight: 4200000, maxGuests: 2, bedrooms: 1, bathrooms: 1, amenities: ['180° Ocean View','Marble Bath','Telescope','Butler Service','Mini Bar'], rating: 4.9, available: true, category: 'suite' },
  { id: 'v-su4', name: 'Penthouse Suite', description: 'Penthouse di puncak resort dengan rooftop privat, jacuzzi, dan pemandangan seluruh pantai Bengkulu.', images: [require('../../assets/villas/Penthouse-Suite.jpg')], pricePerNight: 4500000, maxGuests: 4, bedrooms: 2, bathrooms: 2, amenities: ['Rooftop','Jacuzzi','Panoramic View','Butler Service','Private Dining'], rating: 4.9, available: false, category: 'suite' },
  { id: 'v-su5', name: 'Honeymoon Paradise Suite', description: 'Suite romantis ultimate. Petal bath, private cinema, candle dinner di tepi laut. Pengalaman tak terlupakan.', images: [require('../../assets/villas/Honeymoon-Paradise-Suite.jpg')], pricePerNight: 4000000, maxGuests: 2, bedrooms: 1, bathrooms: 1, amenities: ['Petal Bath','Private Cinema','Candle Dinner','Butler Service','Champagne'], rating: 5.0, available: true, category: 'suite' },
];

// ─── WAHANA (ATTRACTIONS) ──────────────────────────────────
export const WAHANA: Wahana[] = [
  // === WATER (5) ===
  { id: 'w-wa1', name: 'Jet Ski Adventure', description: 'Rasakan sensasi memacu jet ski di perairan Bengkulu yang jernih. Cocok untuk pencari adrenalin!', image: require('../../assets/wahana/Jet-Ski-Adventure.jpg'), price: 350000, duration: '30 menit', capacity: 2, category: 'water', rating: 4.8, available: true, minAge: 16 },
  { id: 'w-wa2', name: 'Flyboard Experience', description: 'Terbang di atas air dengan flyboard! Instruktur profesional akan memandu Anda untuk pengalaman tak terlupakan.', image: require('../../assets/wahana/Flyboard-Experience.jpg'), price: 500000, duration: '20 menit', capacity: 1, category: 'water', rating: 4.9, available: true, minAge: 18 },
  { id: 'w-wa3', name: 'Parasailing', description: 'Terbang tinggi di atas laut dengan parasail. Pemandangan pantai Bengkulu dari ketinggian yang menakjubkan!', image: require('../../assets/wahana/parasailing.jpg'), price: 450000, duration: '15 menit', capacity: 2, category: 'water', rating: 4.7, available: true, minAge: 14 },
  { id: 'w-wa4', name: 'Wakeboard Session', description: 'Tantang keseimbangan Anda dengan wakeboard di perairan tenang laguna MDLAND. Peralatan lengkap tersedia.', image: require('../../assets/wahana/wakeboard-session.jpg'), price: 300000, duration: '30 menit', capacity: 1, category: 'water', rating: 4.6, available: true, minAge: 14 },
  { id: 'w-wa5', name: 'Stand Up Paddle (SUP)', description: 'Berdiri di atas papan paddle dan jelajahi perairan tenang. Olahraga seru yang melatih keseimbangan.', image: require('../../assets/wahana/Stand-Up-Paddle.jpg'), price: 150000, duration: '45 menit', capacity: 1, category: 'water', rating: 4.5, available: true },

  // === ADVENTURE (5) ===
  { id: 'w-ad1', name: 'Banana Boat Ride', description: 'Naik banana boat bersama teman! Bersiap untuk terlempar ke air dan tertawa bersama.', image: require('../../assets/wahana/Banana-Boat-Ride.jpg'), price: 200000, duration: '15 menit', capacity: 6, category: 'adventure', rating: 4.7, available: true },
  { id: 'w-ad2', name: 'Snorkeling Tour', description: 'Jelajahi keindahan bawah laut Bengkulu dengan perlengkapan snorkeling lengkap dan pemandu berpengalaman.', image: require('../../assets/wahana/Snorkeling-Tour.jpg'), price: 250000, duration: '60 menit', capacity: 8, category: 'adventure', rating: 4.8, available: true, minAge: 10 },
  { id: 'w-ad3', name: 'Cliff Jumping', description: 'Lompat dari tebing setinggi 5-10 meter ke laut biru! Dipandu instruktur bersertifikat untuk keamanan.', image: require('../../assets/wahana/Cliff-Jumping.jpg'), price: 200000, duration: '45 menit', capacity: 5, category: 'adventure', rating: 4.9, available: true, minAge: 16 },
  { id: 'w-ad4', name: 'Scuba Diving Intro', description: 'Pengenalan scuba diving untuk pemula. Selam hingga 5 meter dan lihat keindahan terumbu karang.', image: require('../../assets/wahana/Scuba-Diving-Intro.jpg'), price: 600000, duration: '90 menit', capacity: 4, category: 'adventure', rating: 4.9, available: true, minAge: 12 },
  { id: 'w-ad5', name: 'Beach ATV Ride', description: 'Pacu ATV di sepanjang pantai pasir putih. Trek seru melewati hutan mangrove dan bukit pantai.', image: require('../../assets/wahana/Beach-ATV-Ride.jpg'), price: 300000, duration: '30 menit', capacity: 2, category: 'adventure', rating: 4.6, available: true, minAge: 16 },

  // === FAMILY (5) ===
  { id: 'w-fa1', name: 'Bebek Air (Pedal Boat)', description: 'Wahana keluarga favorit! Kayuh bebek air bersama anak-anak di area laguna yang tenang dan aman.', image: require('../../assets/wahana/Bebek-Air-(Pedal-Boat).jpg'), price: 100000, duration: '30 menit', capacity: 4, category: 'family', rating: 4.4, available: true },
  { id: 'w-fa2', name: 'Mini Speed Boat', description: 'Speedboat mini untuk anak-anak di area laguna terkontrol. Aman dan menyenangkan!', image: require('../../assets/wahana/Mini-Speed-Boat.jpg'), price: 80000, duration: '15 menit', capacity: 2, category: 'family', rating: 4.3, available: true },
  { id: 'w-fa3', name: 'Kids Water Playground', description: 'Taman air anak dengan seluncuran, semprotan air, dan ember tumpah. Area aman dengan pengawas.', image: require('../../assets/wahana/Kids-Water-Playground.jpg'), price: 75000, duration: '60 menit', capacity: 20, category: 'family', rating: 4.5, available: true },
  { id: 'w-fa4', name: 'Glass Bottom Boat', description: 'Lihat kehidupan bawah laut tanpa basah! Perahu berlantai kaca cocok untuk semua umur.', image: require('../../assets/wahana/Glass-Bottom-Boat.jpg'), price: 120000, duration: '30 menit', capacity: 10, category: 'family', rating: 4.6, available: true },
  { id: 'w-fa5', name: 'Sand Castle Workshop', description: 'Workshop membuat istana pasir bersama instruktur. Alat dan cetakan premium disediakan.', image: require('../../assets/wahana/Sand-Castle-Workshop.jpg'), price: 50000, duration: '45 menit', capacity: 8, category: 'family', rating: 4.2, available: true },

  // === LEISURE (5) ===
  { id: 'w-le1', name: 'Canoe Trip', description: 'Susuri pantai dengan kano sambil menikmati pemandangan laut dan tebing karang Bengkulu yang indah.', image: require('../../assets/wahana/Canoe-Trip.jpg'), price: 150000, duration: '45 menit', capacity: 2, category: 'leisure', rating: 4.6, available: true },
  { id: 'w-le2', name: 'Sunset Cruise', description: 'Nikmati matahari terbenam dari atas perahu tradisional. Termasuk welcome drink dan snack.', image: require('../../assets/wahana/Sunset-Cruise.jpg'), price: 400000, duration: '90 menit', capacity: 10, category: 'leisure', rating: 4.9, available: true },
  { id: 'w-le3', name: 'Sunrise Fishing', description: 'Memancing di pagi hari bersama nelayan lokal. Hasil tangkapan bisa dimasak langsung di beach grill.', image: require('../../assets/wahana/Sunrise-Fishing.jpg'), price: 250000, duration: '120 menit', capacity: 4, category: 'leisure', rating: 4.7, available: true },
  { id: 'w-le4', name: 'Beach Horseback Riding', description: 'Berkuda di sepanjang pantai saat sunrise atau sunset. Kuda jinak yang ramah untuk semua level.', image: require('../../assets/wahana/Beach-Horseback-Riding.jpg'), price: 350000, duration: '45 menit', capacity: 1, category: 'leisure', rating: 4.8, available: true, minAge: 8 },
  { id: 'w-le5', name: 'Floating Breakfast', description: 'Sarapan mewah terapung di kolam renang privat villa Anda. Menu premium dan dekorasi bunga.', image: require('../../assets/wahana/Floating-Breakfast.jpg'), price: 500000, duration: '60 menit', capacity: 2, category: 'leisure', rating: 5.0, available: true },
];

// ─── EVENTS ────────────────────────────────────────────────
export const EVENTS: Event[] = [
  // === Open Trip (5) ===
  { id: 'e-ot1', title: 'Open Trip Pulau Tikus', description: 'Jelajahi Pulau Tikus, salah satu destinasi eksotis di Bengkulu. Snorkeling, bermain di pasir putih, dan menikmati keindahan bawah laut yang jernih bersama rombongan seru.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', date: '2026-04-18', time: '07:00 - 17:00', location: 'Dermaga MDLAND', genre: 'Open Trip', artist: 'MDLAND Adventure Team', price: 350000, attending: 28 },
  { id: 'e-ot2', title: 'Island Hopping Tour', description: 'Keliling 3 pulau tersembunyi di sekitar Bengkulu dengan kapal speedboat. Berenang di laguna biru, foto di spot Instagram-worthy, dan makan siang di pulau terpencil.', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', date: '2026-04-25', time: '08:00 - 18:00', location: 'Dermaga MDLAND', genre: 'Open Trip', artist: 'MDLAND Sea Explorer', price: 450000, attending: 20 },
  { id: 'e-ot3', title: 'Snorkeling Trip', description: 'Trip snorkeling ke spot terbaik di perairan Bengkulu. Lihat terumbu karang berwarna-warni, ikan nemo, dan biota laut yang memukau dengan guide berpengalaman.', image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800', date: '2026-04-27', time: '09:00 - 14:00', location: 'Dermaga MDLAND', genre: 'Open Trip', price: 275000, attending: 35 },
  { id: 'e-ot4', title: 'Sunset Boat Trip', description: 'Cruise sore hari di atas kapal phinisi sambil menyaksikan matahari terbenam di cakrawala Samudera Hindia. Dilengkapi welcome drink, musik, dan snack premium.', image: 'https://images.unsplash.com/photo-1500514966906-fe245eea9344?w=800', date: '2026-05-02', time: '16:30 - 19:30', location: 'Dermaga MDLAND', genre: 'Open Trip', artist: 'MDLAND Cruise', price: 325000, attending: 40 },
  { id: 'e-ot5', title: 'Fishing Experience', description: 'Memancing di laut lepas bersama nelayan lokal berpengalaman. Tangkapan bisa langsung dimasak oleh chef MDLAND dengan teknik bakar tradisional.', image: 'https://images.unsplash.com/photo-1416169607655-0c2b3ce2e1cc?w=800', date: '2026-05-09', time: '05:30 - 11:00', location: 'Dermaga MDLAND', genre: 'Open Trip', price: 200000, attending: 15 },

  // === Chill & Relax (5) ===
  { id: 'e-cr1', title: 'Sunset Chill Session', description: 'Sore santai di bean bag tepi pantai dengan pilihan musik ambient, jus segar, dan pemandangan matahari terbenam yang menawan. Tidak ada jadwal, tidak ada terburu-buru.', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', date: '2026-04-16', time: '16:30 - 19:00', location: 'MDLAND Sunset Terrace', genre: 'Chill & Relax', price: 75000, attending: 65 },
  { id: 'e-cr2', title: 'Beach Yoga Session', description: 'Sesi yoga pagi di atas pasir putih dipandu instruktur tersertifikasi. Rasakan harmoni tubuh dan pikiran dengan suara ombak dan angin laut sebagai backsound alami.', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800', date: '2026-04-20', time: '07:00 - 08:30', location: 'MDLAND Main Beach', genre: 'Chill & Relax', artist: 'Yoga by the Sea', price: 85000, attending: 42 },
  { id: 'e-cr3', title: 'Morning Meditation by the Sea', description: 'Meditasi pagi dipandu dengan teknik mindfulness dan breathing exercise. Mulai harimu dengan tenang, jernih, dan penuh energi positif di tepi Samudera Hindia.', image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800', date: '2026-04-22', time: '06:00 - 07:30', location: 'MDLAND Wellness Deck', genre: 'Chill & Relax', price: 60000, attending: 30 },
  // { id: 'e-cr4', title: 'Spa & Wellness Retreat', description: 'Paket spa satu hari penuh: pijat tradisional, lulur rempah, flower bath, dan facial premium. Rasakan ketenangan total dan revitalisasi tubuh dengan produk lokal Bengkulu.', image: 'https://images.unsplash.com/photo-1544161515-4ab0eece1ac7?w=800', date: '2026-04-26', time: '10:00 - 17:00', location: 'MDLAND Spa Center', genre: 'Chill & Relax', price: 650000, attending: 18 },
  { id: 'e-cr5', title: 'Bonfire Night', description: 'Malam api unggun di tepi pantai. Panggang marshmallow, cerita seru, live acoustic, hot chocolate, dan langit berbintang. Suasana hangat yang tidak akan terlupakan.', image: 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=800', date: '2026-05-01', time: '19:30 - 22:30', location: 'MDLAND Bonfire Beach', genre: 'Chill & Relax', price: 100000, attending: 78 },

  // === Music & Nightlife (5) ===
  { id: 'e-mn1', title: 'R&B Beach Night', description: 'Malam R&B paling groovy di pantai Bengkulu. Live DJ dengan setlist terbaik old school & contemporary R&B. Cocktail premium, neon lights, dan vibes yang bikin nagih.', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800', date: '2026-04-18', time: '20:00 - 01:00', location: 'MDLAND Beach Club', genre: 'Music & Nightlife', artist: 'DJ Velocity', price: 175000, attending: 310 },
  { id: 'e-mn2', title: 'DJ Sunset Party', description: 'Party spektakuler saat golden hour! DJ internasional mengisi set deep house & melodic techno dari matahari terbenam hingga larut malam. Infinity pool dan cocktail included.', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800', date: '2026-04-25', time: '17:00 - 00:00', location: 'MDLAND Infinity Pool', genre: 'Music & Nightlife', artist: 'DJ Oceanique', price: 200000, attending: 420 },
  { id: 'e-mn3', title: 'Live Acoustic Night', description: 'Penampilan live acoustic oleh musisi berbakat lokal Bengkulu. Pop Indonesia, cover hits internasional, dan original song. Suasana intimate di bawah bintang.', image: 'https://images.unsplash.com/photo-1528495612343-9ca9f4a4de28?w=800', date: '2026-04-30', time: '19:00 - 22:30', location: 'MDLAND Garden Stage', genre: 'Music & Nightlife', artist: 'The Shoreline Band', price: 100000, attending: 185 },
  { id: 'e-mn4', title: 'Beach Club Night Party', description: 'Night party all out di beach club MDLAND! Fire breather, LED dancer, photo booth, glow bar, dan DJ nonstop. Dresscode: all white required.', image: 'https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?w=800', date: '2026-05-08', time: '21:00 - 04:00', location: 'MDLAND Main Beach', genre: 'Music & Nightlife', artist: 'Various Artists', price: 250000, attending: 650 },
  // { id: 'e-mn5', title: 'Silent Disco Beach Party', description: 'Silent disco di tepi pantai! Gunakan headphone wireless dan pilih channel musikmu, dari EDM, R&B, hingga Pop. Fenomena unik yang belum pernah ada di Bengkulu.', image: 'https://images.unsplash.com/photo-1620908657168-94d8b28c88d4?w=800', date: '2026-05-15', time: '20:00 - 23:00', location: 'MDLAND Main Beach', genre: 'Music & Nightlife', price: 150000, attending: 220 },

  // === Food & Beverage (5) ===
  { id: 'e-fb1', title: 'Seafood Night Dinner', description: 'Makan malam gala dengan sajian seafood segar kelas dunia. Lobster, kepiting rajungan, udang jumbo, dan kerang hijau dimasak langsung oleh chef profesional di hadapanmu.', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', date: '2026-04-17', time: '18:30 - 21:30', location: 'MDLAND Ocean Kitchen', genre: 'Food & Beverage', price: 550000, attending: 62 },
  { id: 'e-fb2', title: 'BBQ Beach Party', description: 'BBQ party legendaris di tepi pantai. Daging wagyu, seafood segar, sate satean, corn on the cob, dan berbagai hidangan panggang lainnya. All you can eat dengan musik live!', image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800', date: '2026-04-24', time: '17:00 - 21:00', location: 'MDLAND Beach Bar', genre: 'Food & Beverage', price: 350000, attending: 130 },
  { id: 'e-fb3', title: 'Cocktail Masterclass', description: 'Belajar membuat cocktail premium dari mixologist profesional MDLAND. Pilih 3 resep signature cocktail, coba bahan impor, dan bawa pulang resep eksklusifnya.', image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=800', date: '2026-04-29', time: '15:00 - 17:30', location: 'MDLAND Beach Bar', genre: 'Food & Beverage', artist: 'Mixologist Arya', price: 275000, attending: 24 },
  { id: 'e-fb4', title: 'Wine & Dine Experience', description: 'Makan malam 5-course yang dipasangkan dengan wine pilihan sommelier. Mulai dari white wine segar untuk hidangan laut hingga red wine bold untuk daging premium.', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800', date: '2026-05-07', time: '19:00 - 22:00', location: 'MDLAND Starlight Deck', genre: 'Food & Beverage', price: 450000, attending: 40 },
  { id: 'e-fb5', title: 'Beach Brunch', description: 'Brunch santai di tepi pantai setiap Minggu pagi. Ayam panggang, scrambled egg truffle, pancake fresh berry, avocado toast, fresh juice, dan champagne mimosa.', image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800', date: '2026-04-19', time: '09:00 - 13:00', location: 'MDLAND Poolside', genre: 'Food & Beverage', price: 200000, attending: 88 },

  // === Sport & Activity (5) ===
  { id: 'e-sa1', title: 'Surfing Class', description: 'Belajar surfing dari nol bersama instruktur bersertifikat di pantai MDLAND. Papan surfing dan wetsuit disediakan. Semua level welcome, dari pemula hingga intermediate.', image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800', date: '2026-04-16', time: '08:00 - 11:00', location: 'MDLAND Surf Point', genre: 'Sport & Activity', artist: 'Bengkulu Surf School', price: 250000, attending: 16 },
  { id: 'e-sa2', title: 'Paddle Board Challenge', description: 'Lomba paddle board seru di laguna MDLAND! Kategori umum dan anak-anak. Hadiah menarik untuk 3 pemenang. Perlengkapan disediakan, daftar sebelum kuota habis.', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800', date: '2026-04-23', time: '09:00 - 12:00', location: 'MDLAND Lagoon', genre: 'Sport & Activity', price: 150000, attending: 32 },
  { id: 'e-sa3', title: 'Beach Volleyball Tournament', description: 'Turnamen voli pantai antar tamu MDLAND. Format 4vs4 round robin. Berhadiah paket menginap gratis dan merchandise eksklusif MDLAND untuk tim terbaik.', image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800', date: '2026-04-27', time: '15:00 - 18:00', location: 'MDLAND Beach Court', genre: 'Sport & Activity', price: 100000, attending: 48 },
  { id: 'e-sa4', title: 'Jet Ski Race Experience', description: 'Sesi balap jet ski eksklusif di lintasan khusus MDLAND. Rasakan sensasi ngebut di atas air dan tantang kecepatan maksimalmu. Instruktur mendampingi selama sesi.', image: 'https://images.unsplash.com/photo-1621252179027-94459d278660?w=800', date: '2026-05-03', time: '10:00 - 13:00', location: 'MDLAND Waterfront', genre: 'Sport & Activity', price: 400000, attending: 20 },
  // { id: 'e-sa5', title: 'Banana Boat Party', description: 'Sesi banana boat ramai-ramai! Tahan sekuat mungkin atau sengaja jatuh ke air bersama teman. Dijamin penuh tawa dan basah. Foto dan video dokumentasi tersedia.', image: 'https://images.unsplash.com/photo-1605125950881-05e0a0771e08?w=800', date: '2026-05-10', time: '14:00 - 16:00', location: 'MDLAND Beach', genre: 'Sport & Activity', price: 175000, attending: 55 },

  // === Couple & Private (4) ===
  { id: 'e-cp1', title: 'Romantic Dinner by the Beach', description: 'Private dinner romantis di tepi pantai diterangi lilin dan lampu fairy lights. Menu 4-course disiapkan chef pribadi, lengkap dengan musik live, champagne, dan bunga segar.', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', date: '2026-04-19', time: '19:00 - 22:00', location: 'MDLAND Private Beach', genre: 'Couple & Private', price: 1200000, attending: 12 },
  { id: 'e-cp2', title: 'Private Sunset Picnic', description: 'Picnic romantis eksklusif menghadap matahari terbenam. Setup mewah dengan tikar, bantal, camilan premium, buah-buahan segar, wine, dan dekorasi bunga.', image: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=800', date: '2026-04-26', time: '16:00 - 19:30', location: 'MDLAND Sunset Cliff', genre: 'Couple & Private', price: 800000, attending: 8 },
  { id: 'e-cp3', title: 'Honeymoon Package', description: 'Paket bulan madu lengkap selama 2 hari 1 malam. Villa premium, petal bath, breakfast in bed, sunset cruise, couples spa, dan candlelight dinner. Momen tak terlupakan.', image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800', date: '2026-05-05', time: 'All Day', location: 'MDLAND Resort', genre: 'Couple & Private', price: 3500000, attending: 5 },
  { id: 'e-cp4', title: 'Proposal Setup', description: 'Layanan setup proposal pernikahan profesional di lokasi terbaik MDLAND. Dekorasi bunga, karpet merah, fotografer, videografer, champagne, dan koordinator acara.', image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800', date: '2026-05-12', time: 'Sesuai Request', location: 'MDLAND Sunset Point', genre: 'Couple & Private', price: 2500000, attending: 3 },
];

// ─── F&B / RESTAURANTS ─────────────────────────────────────
const DINING_ITEMS: DiningItem[] = [
  { id: 'd1', name: 'Pempek Palembang', description: 'Pempek kapal selam dengan kuah cuko asli, disajikan hangat', image: require('../../assets/DINING_ITEMS/Pempek-Palembang.jpg'), price: 35000, category: 'appetizer', rating: 4.9, isSignature: true },
  { id: 'd2', name: 'Nasi Goreng Seafood', description: 'Nasi goreng spesial dengan udang, cumi, dan ikan segar Bengkulu', image: require('../../assets/DINING_ITEMS/Nasi-Goreng-Seafood.jpg'), price: 55000, category: 'main', rating: 4.8, isSignature: true },
  { id: 'd3', name: 'Ikan Bakar Bengkulu', description: 'Ikan kakap bakar bumbu khas Bengkulu dengan sambal dan lalapan segar', image: require('../../assets/DINING_ITEMS/Ikan-Bakar-Bengkulu.jpg'), price: 75000, category: 'main', rating: 5.0, isSignature: true },
  { id: 'd4', name: 'Sate Ayam Madura', description: 'Sate ayam dengan bumbu kacang khas, dilengkapi lontong dan acar', image: require('../../assets/DINING_ITEMS/Sate-Ayam-Madura.jpg'), price: 40000, category: 'main', rating: 4.7, isSignature: false },
  { id: 'd5', name: 'Mie Goreng Seafood', description: 'Mie goreng dengan udang dan cumi, bumbu pedas manis', image: require('../../assets/DINING_ITEMS/Mie-Goreng-Seafood.jpg'), price: 45000, category: 'main', rating: 4.6, isSignature: false },
  { id: 'd6', name: 'Es Kelapa Muda', description: 'Kelapa muda segar langsung dari pohon, disajikan dengan es serut', image: require('../../assets/DINING_ITEMS/Es-Kelapa-Muda.jpg'), price: 25000, category: 'beverage', rating: 4.8, isSignature: false },
  { id: 'd7', name: 'Tropical Sunset Cocktail', description: 'Campuran jus mangga, passion fruit, dan soda dengan hiasan bunga', image: require('../../assets/DINING_ITEMS/Tropical-Sunset-Cocktail.jpg'), price: 65000, category: 'cocktail', rating: 4.9, isSignature: true },
  { id: 'd8', name: 'Es Cendol Bengkulu', description: 'Cendol pandan dengan santan, gula merah, dan nangka segar', image: require('../../assets/DINING_ITEMS/Es-Cendol-Bengkulu.jpg'), price: 20000, category: 'dessert', rating: 4.7, isSignature: false },
  { id: 'd9', name: 'Pisang Goreng Crispy', description: 'Pisang goreng dengan tepung crispy dan topping coklat madu', image: require('../../assets/DINING_ITEMS/Pisang-Goreng-Crispy.jpg'), price: 25000, category: 'snack', rating: 4.5, isSignature: false },
  { id: 'd10', name: 'French Fries & Onion Rings', description: 'Kentang goreng dan onion rings renyah dengan saus sambal mayo', image: require('../../assets/DINING_ITEMS/French-Fries-&-Onion-Rings.jpg'), price: 35000, category: 'snack', rating: 4.4, isSignature: false },
  { id: 'd11', name: 'Juice Bar Combo', description: 'Pilihan jus buah segar: jeruk, semangka, melon, atau alpukat', image: require('../../assets/DINING_ITEMS/Juice-Bar-Combo.jpg'), price: 30000, category: 'beverage', rating: 4.6, isSignature: false },
  { id: 'd12', name: 'Wagyu Burger Premium', description: 'Burger wagyu A5 dengan keju cheddar, truffle mayo, dan roti brioche', image: require('../../assets/DINING_ITEMS/Wagyu-Burger-Premium.jpg'), price: 95000, category: 'main', rating: 4.9, isSignature: true },
];

export const RESTAURANTS: Restaurant[] = [
  {
    id: 'rest1',
    name: 'MDLAND Ocean Kitchen',
    description: 'Restoran utama MDLAND Bengkulu. Sajian seafood segar dan masakan Nusantara premium dengan pemandangan laut.',
    image: require('../../assets/restaurants/MDLAND-Ocean-Kitchen.jpg'),
    cuisine: 'Seafood & Indonesian',
    rating: 4.9,
    priceRange: 'Rp 35k - 95k',
    openHours: '10:00 - 22:00',
    items: DINING_ITEMS.filter(i => ['d1', 'd2', 'd3', 'd4', 'd5', 'd7', 'd12'].includes(i.id)),
  },
  {
    id: 'rest2',
    name: 'Beach Grill & Bar',
    description: 'Makan santai langsung di tepi pantai. Grilled food, snack, dan minuman tropis segar.',
    image: require('../../assets/restaurants/Beach-Grill-&-Bar.jpg'),
    cuisine: 'Grill & Snacks',
    rating: 4.7,
    priceRange: 'Rp 20k - 65k',
    openHours: '09:00 - 21:00',
    items: DINING_ITEMS.filter(i => ['d6', 'd8', 'd9', 'd10', 'd11'].includes(i.id)),
  },
];

// ─── BOOKINGS ──────────────────────────────────────────────
export const BOOKINGS: Booking[] = [
  {
    id: 'b1',
    villaId: 'v1',
    villaName: 'Ocean Breeze Villa',
    type: 'villa',
    image: require('../../assets/bookings/Ocean-Breeze-Villa.jpg'),
    checkIn: '2026-05-10',
    checkOut: '2026-05-12',
    guests: 2,
    totalPrice: 5000000,
    status: 'upcoming',
  },
  {
    id: 'b2',
    wahanaId: 'w1',
    wahanaName: 'Jet Ski Adventure',
    type: 'wahana',
    image: require('../../assets/bookings/Jet-Ski-Adventure.jpg'),
    date: '2026-04-20',
    guests: 2,
    totalPrice: 700000,
    status: 'upcoming',
  },
];

// ─── USER ──────────────────────────────────────────────────
export const USER: User = {
  id: 'u1',
  name: 'Iqbal Suryo',
  email: 'iqbal.suryo@email.com',
  avatar: require('../../assets/user/Iqbal-Suryo.jpg'),
  memberSince: '2024-06-15',
  tier: 'platinum',
  bookingsCount: 12,
};

// ─── MAP MARKERS ───────────────────────────────────────────
export const MAP_MARKERS: MapMarker[] = [
  // ── Villas ──
  { id: 'm1', title: 'Oceanfront Suite', description: 'Villa Premium · 3 Kamar', coordinate: { latitude: -3.7838, longitude: 102.2525 }, type: 'villa', image: require('../../assets/map_markers/Oceanfront-Suite.jpg'), rating: 4.9, reviewCount: 245, price: 3500000, category: 'premium', isOpen: true },
  { id: 'm2', title: 'Sunset Villa', description: 'Villa Deluxe · 2 Kamar', coordinate: { latitude: -3.7856504265064865, longitude: 102.25445085755116 }, type: 'villa', image: require('../../assets/map_markers/Sunset-Villa.jpg'), rating: 4.7, reviewCount: 189, price: 2800000, category: 'deluxe', isOpen: true },
  { id: 'm3', title: 'Garden Cottage', description: 'Villa Standard · 1 Kamar', coordinate: { latitude: -3.7855, longitude: 102.2510 }, type: 'villa', image: require('../../assets/map_markers/Garden-Cottage.jpg'), rating: 4.5, reviewCount: 132, price: 1800000, category: 'standard', isOpen: true },

  // ── Restaurants ──
  { id: 'm4', title: 'Ocean Kitchen', description: 'Seafood & Indonesian', coordinate: { latitude: -3.7852134373607798, longitude: 102.25210207571139}, type: 'restaurant', image: require('../../assets/map_markers/Ocean-Kitchen.jpg'), rating: 4.8, reviewCount: 412, price: 150000, category: 'seafood', isOpen: true },
  { id: 'm5', title: 'Bamboo Grill', description: 'BBQ & Steak House', coordinate: { latitude: -3.7849323025161605, longitude: 102.2528435683876 }, type: 'restaurant', image: require('../../assets/map_markers/Bamboo-Grill.jpg'), rating: 4.6, reviewCount: 287, price: 200000, category: 'grill', isOpen: true },

  // ── Wahana ──
  { id: 'm6', title: "Pirate's Revenge", description: 'Thrill Rides', coordinate: { latitude: -3.7847182267230144, longitude: 102.25293050348753 }, type: 'wahana', image: require('../../assets/map_markers/Pirate\'s-Revenge.jpg'), rating: 4.5, reviewCount: 1980, price: 40000, category: 'adventure', waitTime: 25, isOpen: true },
  { id: 'm7', title: 'Sky Wheel', description: 'Family Rides', coordinate: { latitude: -3.7840477872545755, longitude: 102.25204862875809 }, type: 'wahana', image: require('../../assets/map_markers/Sky-Wheel.jpg'), rating: 4.3, reviewCount: 876, price: 30000, category: 'family', waitTime: 15, isOpen: true },
  { id: 'm8', title: 'Wave Pool', description: 'Water Park', coordinate: { latitude: -3.78555246601874, longitude: 102.25171649411975 }, type: 'wahana', image: require('../../assets/map_markers/Wave-Pool.jpg'), rating: 4.8, reviewCount: 2341, price: 50000, category: 'water', waitTime: 10, isOpen: true },

  // ── Events ──
  { id: 'm9', title: 'Beach Club Stage', description: 'Live Music & DJ', coordinate: { latitude: -3.7838592697694686, longitude: 102.2527576552265 }, type: 'event', image: require('../../assets/map_markers/Beach-Club.jpg'), rating: 4.7, reviewCount: 1200, price: 100000, category: 'music', isOpen: true },
  { id: 'm10', title: 'Sunset Lounge', description: 'Acoustic Night', coordinate: { latitude: -3.7854381599241242, longitude: 102.25097768784981}, type: 'event', image: require('../../assets/map_markers/Sunset-Lounge.jpg'), rating: 4.5, reviewCount: 567, price: 75000, category: 'music', isOpen: true },

  // ── Facilities ──
  { id: 'm11', title: 'MDLAND Reception', description: 'Lobby Utama', coordinate: { latitude: -3.784517939126953, longitude: 102.25313460257593 }, type: 'facility', image: require('../../assets/map_markers/MDLAND-Reception.jpg'), rating: 4.8, reviewCount: 890, isOpen: true },
  { id: 'm12', title: 'Spa & Wellness', description: 'Relaksasi & Massage', coordinate: { latitude: -3.7853545941081435, longitude: 102.25231852098672 }, type: 'facility', image: require('../../assets/map_markers/Spa-Wellness.jpg'), rating: 4.9, reviewCount: 345, price: 250000, isOpen: true },
  { id: 'm13', title: 'Kids Zone', description: 'Area Bermain Anak', coordinate: { latitude: -3.7854791236995493, longitude: 102.25203053937747 }, type: 'facility', image: require('../../assets/map_markers/Kids-Zone.jpg'), rating: 4.4, reviewCount: 234, isOpen: true },
  { id: 'm14', title: 'Parking Area', description: 'Parkir Luas & Aman', coordinate: { latitude: -3.7847325403911025, longitude: 102.25335294507066 }, type: 'facility', image: require('../../assets/map_markers/Parking-Area.jpg'), rating: 4.2, reviewCount: 120, isOpen: true },
];

// ─── ONBOARDING ────────────────────────────────────────────
export const ONBOARDING_DATA = [
  {
    id: '1',
    title: 'Welcome to MDLAND',
    subtitle: 'Resort & waterpark terbaik di Bengkulu. Nikmati villa mewah, wahana air seru, dan kuliner lezat.',
    image: require('../../assets/onboarding data/Welcome-to-MDLAND.jpg'),
  },
  {
    id: '2',
    title: 'Serunya Wahana Air',
    subtitle: 'Jet ski, flyboard, canoe trip, dan banyak lagi! Beli tiket langsung dari aplikasi.',
    image: require('../../assets/onboarding data/Serunya-Wahana-Air.jpg'),
  },
  {
    id: '3',
    title: 'Kuliner & Hiburan',
    subtitle: 'Pesan makanan, booking villa, dan nikmati event malam yang tak terlupakan.',
    image: require('../../assets/onboarding data/Kuliner-&-Hiburan.jpg'),
  },
];








