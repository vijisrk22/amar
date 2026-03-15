const { getDb } = require('./database');

function seed() {
  const db = getDb();

  // Clear existing data
  db.exec(`
    DELETE FROM order_items;
    DELETE FROM orders;
    DELETE FROM wishlist;
    DELETE FROM cart_items;
    DELETE FROM books;
    DELETE FROM categories;
    DELETE FROM hero_slides;
    DELETE FROM about_sections;
    DELETE FROM site_settings;
  `);

  // Categories
  const insertCat = db.prepare('INSERT INTO categories (name, slug, sort_order) VALUES (?, ?, ?)');
  const categories = [
    ['Heritage', 'heritage', 1],
    ['Architecture', 'architecture', 2],
    ['Art', 'art', 3],
    ['Photography', 'photography', 4],
    ['Music & Culture', 'music-culture', 5],
    ['Coffee Table', 'coffee-table', 6],
  ];
  const catIds = {};
  for (const [name, slug, order] of categories) {
    const result = insertCat.run(name, slug, order);
    catIds[slug] = result.lastInsertRowid;
  }

  // Books
  const insertBook = db.prepare(`
    INSERT INTO books (title, subtitle, slug, price, currency, description, short_description, cover_image, detail_images, category_id, series, status, edition_type, featured, is_new, sort_order)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const books = [
    {
      title: 'Pudhu Mandapam',
      subtitle: 'Echoes of Madurai\'s Forgotten Monoliths',
      slug: 'pudhu-mandapam',
      price: 3840,
      currency: 'INR',
      description: 'A stunning visual documentation of the Pudhu Mandapam, Madurai\'s magnificent 17th-century pillared hall. This coffee table book captures the intricate Dravidian sculptures and architectural grandeur of one of Tamil Nadu\'s most remarkable heritage structures. Each page reveals the stories carved in stone — mythological narratives, royal portraits, and celestial beings that have stood witness to centuries of history.',
      short_description: 'A visual journey through Madurai\'s magnificent 17th-century pillared hall.',
      cover_image: '/assets/images/books/pudhu-mandapam-cover.jpg',
      detail_images: JSON.stringify(['/assets/images/books/pudhu-mandapam-1.jpg', '/assets/images/books/pudhu-mandapam-2.jpg', '/assets/images/books/pudhu-mandapam-3.jpg']),
      category_id: catIds['heritage'],
      series: 'Signature Edition',
      status: 'available',
      edition_type: 'standard',
      featured: 1,
      is_new: 0,
      sort_order: 1,
    },
    {
      title: 'MOGAPPU',
      subtitle: 'The Portals of Chettinad',
      slug: 'mogappu',
      price: 2800,
      currency: 'INR',
      description: 'MOGAPPU documents the stunning facades and ornate doorways of Chettinad — the palatial mansions built by the Nattukottai Chettiars in the 19th and early 20th centuries. This photographic masterpiece captures the unique blend of East-meets-West architecture: Italian marble floors, Burmese teak pillars, Belgian chandeliers, and hand-painted Athangudi tiles. Each portal tells the story of a trading community whose wealth and taste created one of India\'s most extraordinary architectural legacies.',
      short_description: 'Documenting the stunning facades and ornate doorways of Chettinad mansions.',
      cover_image: '/assets/images/books/mogappu-cover.jpg',
      detail_images: JSON.stringify(['/assets/images/books/mogappu-1.jpg', '/assets/images/books/mogappu-2.jpg', '/assets/images/books/mogappu-3.jpg']),
      category_id: catIds['architecture'],
      series: 'Signature Edition',
      status: 'available',
      edition_type: 'standard',
      featured: 1,
      is_new: 0,
      sort_order: 2,
    },
    {
      title: 'Madras Margazhi',
      subtitle: 'Chennai\'s Season of Music & Dance',
      slug: 'madras-margazhi',
      price: 1000,
      currency: 'INR',
      description: 'Discover Chennai\'s soul through its maestros, where music meets landmarks and creativity finds its voice. Madras Margazhi captures the essence of the December music season — the world\'s largest cultural festival. From the hallowed halls of the Music Academy to intimate sabha stages, this book weaves together photographs of legendary performers, iconic venues, and the vibrant energy that transforms Chennai every December into the cultural capital of the world.',
      short_description: 'Discover Chennai\'s soul through its maestros and the December music season.',
      cover_image: '/assets/images/books/madras-margazhi-cover.jpg',
      detail_images: JSON.stringify(['/assets/images/books/madras-margazhi-1.jpg', '/assets/images/books/madras-margazhi-2.jpg']),
      category_id: catIds['music-culture'],
      series: 'Standard Edition',
      status: 'available',
      edition_type: 'standard',
      featured: 0,
      is_new: 0,
      sort_order: 3,
    },
    {
      title: 'Stones & Stories',
      subtitle: 'Ancient Temple Tales of South India',
      slug: 'stones-and-stories',
      price: 2200,
      currency: 'INR',
      description: 'Stones & Stories takes you on a breathtaking journey through South India\'s ancient temple architecture. From the towering gopurams of Meenakshi Amman to the rock-cut caves of Mahabalipuram, this book reveals the mythology, engineering marvels, and artistic mastery embedded in every carved stone. A testament to the civilizations that built monuments meant to last for eternity.',
      short_description: 'A journey through South India\'s ancient temple architecture and mythology.',
      cover_image: '/assets/images/books/stones-stories-cover.jpg',
      detail_images: JSON.stringify(['/assets/images/books/stones-stories-1.jpg', '/assets/images/books/stones-stories-2.jpg']),
      category_id: catIds['heritage'],
      series: 'Collector\'s Edition',
      status: 'out_of_stock',
      edition_type: 'limited',
      featured: 0,
      is_new: 0,
      sort_order: 4,
    },
    {
      title: 'Kolli Kannu',
      subtitle: 'Drishti Paintings of Tamil Nadu',
      slug: 'kolli-kannu',
      price: 2400,
      currency: 'INR',
      description: '"The photos within these pages capture an essence that may never be seen again, not in this lifetime, and perhaps not for the next 200 years." Kolli Kannu is a definitive visual archive of Tamil Nadu\'s vanishing Drishti paintings — the bold, hypnotic eye motifs painted on walls and thresholds to ward off evil. This book documents a folk art tradition that is rapidly disappearing, preserving its vivid colors, geometric patterns, and spiritual significance for future generations.',
      short_description: 'A visual archive of Tamil Nadu\'s vanishing Drishti folk art tradition.',
      cover_image: '/assets/images/books/kolli-kannu-cover.jpg',
      detail_images: JSON.stringify(['/assets/images/books/kolli-kannu-1.jpg', '/assets/images/books/kolli-kannu-2.jpg', '/assets/images/books/kolli-kannu-3.jpg']),
      category_id: catIds['art'],
      series: 'Signature Edition',
      status: 'available',
      edition_type: 'standard',
      featured: 1,
      is_new: 1,
      sort_order: 5,
    },
    {
      title: 'ARANGA',
      subtitle: 'Beyond The Stage',
      slug: 'aranga',
      price: 3200,
      currency: 'INR',
      description: 'ARANGA goes beyond the stage to reveal the unseen world of South Indian performing arts. From the intense backstage preparations of Kathakali artists to the meditative rituals of Bharatanatyam dancers, this book captures the raw emotion, discipline, and devotion that define India\'s classical art forms. A visual symphony of movement, color, and tradition.',
      short_description: 'Revealing the unseen world of South Indian performing arts.',
      cover_image: '/assets/images/books/aranga-cover.jpg',
      detail_images: JSON.stringify(['/assets/images/books/aranga-1.jpg', '/assets/images/books/aranga-2.jpg']),
      category_id: catIds['photography'],
      series: 'Collector\'s Edition',
      status: 'pre_order',
      edition_type: 'limited',
      featured: 1,
      is_new: 1,
      sort_order: 6,
    },
  ];

  for (const book of books) {
    insertBook.run(
      book.title, book.subtitle, book.slug, book.price, book.currency,
      book.description, book.short_description, book.cover_image, book.detail_images,
      book.category_id, book.series, book.status, book.edition_type,
      book.featured, book.is_new, book.sort_order
    );
  }

  // Hero slides
  const insertHero = db.prepare('INSERT INTO hero_slides (title, subtitle, image, cta_text, cta_link, sort_order) VALUES (?, ?, ?, ?, ?, ?)');
  const heroSlides = [
    ['Kolli Kannu', 'Drishti Paintings of Tamil Nadu', '/assets/images/hero/hero-kolli-kannu.jpg', 'Shop Now', '/book/kolli-kannu', 1],
    ['MOGAPPU', 'The Portals of Chettinad', '/assets/images/hero/hero-mogappu.jpg', 'Discover', '/book/mogappu', 2],
    ['Pudhu Mandapam', 'Echoes of Madurai\'s Forgotten Monoliths', '/assets/images/hero/hero-pudhu-mandapam.jpg', 'Explore', '/book/pudhu-mandapam', 3],
    ['ARANGA', 'Beyond The Stage — Pre-Order Now', '/assets/images/hero/hero-aranga.jpg', 'Pre-Order', '/book/aranga', 4],
  ];
  for (const slide of heroSlides) {
    insertHero.run(...slide);
  }

  // About sections
  const insertAbout = db.prepare('INSERT INTO about_sections (section_key, title, content, image, sort_order) VALUES (?, ?, ?, ?, ?)');
  const aboutSections = [
    ['mission', 'Mission', 'Mara Labs was born from a passion—Amar Ramesh\'s drive to celebrate and preserve South Indian heritage in a completely new way. What started with the photographic success of Mogappu, documenting the stunning facades of Chettinad houses, grew into a desire to create high-end coffee table books that go beyond just being reading materials. Our mission is to redefine how books are experienced in India, blending rich cultural narratives with modern design, and making each book an immersive journey into the heart of South India.', '/assets/images/about/mission.jpg', 1],
    ['design', 'Design', 'At Mara Labs, design isn\'t just about aesthetics—it\'s about creating experiential books. Our approach is to treat each book as a unique project, experimenting with materials, typography, and layouts to bring the subject matter to life. We want our books to feel like artifacts—timeless, yet contemporary. Each book is an opportunity to showcase the beauty of South Indian heritage through a modern lens. Whether it\'s the use of bold typography, experimental structures, or carefully chosen materials, we aim to create books that surprise and engage the reader on every level, leaving a lasting impression that goes beyond the content.', '/assets/images/about/design.jpg', 2],
    ['giving-back', 'Giving Back', 'While our focus is on modern design, we also aim to give back to the communities that inspire our work. We celebrate artisans, craftspeople, and the traditions of South India, ensuring that our books highlight the richness of this culture. We believe that design can be a tool for preserving heritage and fostering appreciation for the craftsmanship that has shaped it. Each book we release is an effort not only to create something beautiful but to support the continuation of the culture it represents, ensuring that the stories we share continue to resonate with readers and future generations.', '/assets/images/about/giving-back.jpg', 3],
  ];
  for (const section of aboutSections) {
    insertAbout.run(...section);
  }

  // Site settings
  const insertSetting = db.prepare('INSERT INTO site_settings (key, value) VALUES (?, ?)');
  const settings = [
    ['brand_name', 'MARA LABS'],
    ['tagline', 'Premium Coffee Table Books on Indian Heritage'],
    ['email', 'officialmaralabs@gmail.com'],
    ['phone', '+91-7299910076'],
    ['address', '69, IOA Complex 2nd Floor, Royapettah, Chennai - 600014'],
    ['instagram', 'https://www.instagram.com/maralabs.in/'],
    ['shipping_cost', '100'],
    ['free_shipping_threshold', '3000'],
    ['tax_rate', '0.05'],
  ];
  for (const setting of settings) {
    insertSetting.run(...setting);
  }

  console.log('✅ Database seeded successfully!');
  console.log(`   - ${categories.length} categories`);
  console.log(`   - ${books.length} books`);
  console.log(`   - ${heroSlides.length} hero slides`);
  console.log(`   - ${aboutSections.length} about sections`);
  console.log(`   - ${settings.length} site settings`);
}

seed();
