const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Product = require('./models/Product');
const User = require('./models/User');
require('dotenv').config();

const sampleProducts = [
  {
    name: "Professional Cricket Bat - English Willow",
    description: "Premium Grade 1 English willow cricket bat with perfect balance and sweet spot. Ideal for professional players seeking superior performance.",
    price: 18500,
    originalPrice: 22000,
    category: "cricket",
    brand: "Gray-Nicolls",
    stock: 12,
    features: ["Grade 1 English Willow", "Perfect Balance", "Large Sweet Spot", "Shock Guard", "Professional Grade"],
    tags: ["cricket", "bat", "premium", "english-willow", "professional"],
    images: ["bat.jpg"],
    isActive: true,
    rating: 4.8,
    reviewCount: 23
  },
  {
    name: "Nike Mercurial Superfly Football Boots",
    description: "Elite football boots with Flyknit construction and ACC technology for maximum speed and control on the field.",
    price: 25500,
    originalPrice: 30000,
    category: "football",
    brand: "Nike",
    stock: 8,
    features: ["Flyknit Construction", "ACC Technology", "Speed Control", "Lightweight", "Dynamic Fit Collar"],
    tags: ["football", "boots", "nike", "mercurial", "elite"],
    images: ["bat.jpg"],
    isActive: true,
    rating: 4.7,
    reviewCount: 15
  },
  {
    name: "Professional Tennis Racket - Carbon Fiber",
    description: "Advanced carbon fiber tennis racket designed for professional players with superior control and power.",
    price: 21500,
    originalPrice: 25000,
    category: "tennis",
    brand: "Wilson",
    stock: 6,
    features: ["Carbon Fiber Construction", "Vibration Control", "Power Frame", "Professional Grip", "Aero Design"],
    tags: ["tennis", "racket", "carbon-fiber", "wilson", "professional"],
    images: ["bat.jpg"],
    isActive: true,
    rating: 4.6,
    reviewCount: 18
  },
  {
    name: "Premium Yoga Mat - Extra Thick",
    description: "6mm thick non-slip yoga mat with carrying strap, perfect for all types of yoga and fitness exercises.",
    price: 4500,
    originalPrice: 6000,
    category: "fitness",
    brand: "Adidas",
    stock: 25,
    features: ["6mm Thickness", "Non-Slip Surface", "Eco-Friendly Material", "Carrying Strap", "Extra Cushioning"],
    tags: ["fitness", "yoga", "mat", "premium", "exercise"],
    images: ["bat.jpg"],
    isActive: true,
    rating: 4.5,
    reviewCount: 32
  },
  {
    name: "Cricket Helmet with Face Guard",
    description: "Professional cricket helmet with steel face guard and advanced ventilation system for maximum safety.",
    price: 8500,
    originalPrice: 10000,
    category: "cricket",
    brand: "SG",
    stock: 15,
    features: ["Steel Face Guard", "Ventilation System", "Adjustable Chin Strap", "Lightweight", "CE Certified"],
    tags: ["cricket", "helmet", "safety", "sg", "protection"],
    images: ["bat.jpg"],
    isActive: true,
    rating: 4.4,
    reviewCount: 12
  },
  {
    name: "Adidas Predator Football",
    description: "Official match football with textured surface for better control and accurate passing.",
    price: 6500,
    originalPrice: 8000,
    category: "football",
    brand: "Adidas",
    stock: 20,
    features: ["Official Match Ball", "Textured Surface", "Machine Stitched", "Water Resistant", "FIFA Approved"],
    tags: ["football", "ball", "adidas", "predator", "match"],
    images: ["bat.jpg"],
    isActive: true,
    rating: 4.6,
    reviewCount: 28
  },
  {
    name: "Badminton Racket - Carbon Nanotube",
    description: "Lightweight badminton racket with carbon nanotube technology for superior speed and control.",
    price: 12500,
    originalPrice: 15000,
    category: "badminton",
    brand: "Yonex",
    stock: 10,
    features: ["Carbon Nanotube", "Lightweight Design", "Aero Frame", "Control Grip", "Isometric Head"],
    tags: ["badminton", "racket", "yonex", "carbon", "professional"],
    images: ["bat.jpg"],
    isActive: true,
    rating: 4.7,
    reviewCount: 21
  },
  {
    name: "Adjustable Dumbbell Set 40kg",
    description: "Professional adjustable dumbbell set with quick-change mechanism and included stand.",
    price: 35000,
    originalPrice: 42000,
    category: "fitness",
    brand: "Pro-Fitness",
    stock: 5,
    features: ["Adjustable Weight", "Quick Change System", "Includes Stand", "Rust Proof", "Space Saving"],
    tags: ["fitness", "dumbbell", "weights", "gym", "home-workout"],
    images: ["bat.jpg"],
    isActive: true,
    rating: 4.8,
    reviewCount: 14
  },
  {
    name: "Cricket Leg Pads - Professional",
    description: "High-density foam leg pads with reinforced protection for maximum safety during batting.",
    price: 7500,
    originalPrice: 9000,
    category: "cricket",
    brand: "Kookaburra",
    stock: 18,
    features: ["High-Density Foam", "Reinforced Protection", "Lightweight", "Moisture Wicking", "Ankle Protection"],
    tags: ["cricket", "pads", "protection", "kookaburra", "batting"],
    images: ["bat.jpg"],
    isActive: true,
    rating: 4.5,
    reviewCount: 16
  },
  {
    name: "Goalkeeper Gloves - Professional",
    description: "Professional goalkeeper gloves with latex palm and advanced finger protection system.",
    price: 8500,
    originalPrice: 11000,
    category: "football",
    brand: "Reusch",
    stock: 12,
    features: ["Latex Palm", "Finger Protection", "Secure Wrist Strap", "Durable", "Washable"],
    tags: ["football", "gloves", "goalkeeper", "reusch", "professional"],
    images: ["bat.jpg"],
    isActive: true,
    rating: 4.6,
    reviewCount: 19
  },
  {
    name: "Tennis Balls - Professional Grade",
    description: "Professional grade tennis balls in pressurized can for consistent bounce and performance.",
    price: 1200,
    originalPrice: 1500,
    category: "tennis",
    brand: "Wilson",
    stock: 50,
    features: ["Professional Grade", "Pressurized Can", "Consistent Bounce", "Durable Felt", "ITF Approved"],
    tags: ["tennis", "balls", "wilson", "professional", "championship"],
    images: ["bat.jpg"],
    isActive: true,
    rating: 4.4,
    reviewCount: 45
  },
  {
    name: "Resistance Band Set - 5 Levels",
    description: "Complete resistance band set with 5 different tension levels for full-body workouts.",
    price: 3500,
    originalPrice: 4500,
    category: "fitness",
    brand: "FitLife",
    stock: 30,
    features: ["5 Tension Levels", "Includes Accessories", "Latex Free", "Portable", "Versatile"],
    tags: ["fitness", "resistance-bands", "home-workout", "portable", "strength-training"],
    images: ["bat.jpg"],
    isActive: true,
    rating: 4.3,
    reviewCount: 38
  },
  {
    name: "Cricket Gloves - Batting",
    description: "Premium batting gloves with enhanced protection and superior grip for better bat control.",
    price: 5500,
    originalPrice: 7000,
    category: "cricket",
    brand: "GM",
    stock: 20,
    features: ["Enhanced Protection", "Superior Grip", "Breathable Material", "Flexible", "Shock Absorbent"],
    tags: ["cricket", "gloves", "batting", "gm", "premium"],
    images: ["bat.jpg"],
    isActive: true,
    rating: 4.5,
    reviewCount: 22
  },
  {
    name: "Football Jersey - Professional",
    description: "Professional football jersey with moisture wicking technology and official team design.",
    price: 4500,
    originalPrice: 6000,
    category: "football",
    brand: "Nike",
    stock: 25,
    features: ["Moisture Wicking", "Breathable Fabric", "Official Design", "Lightweight", "Dri-FIT Technology"],
    tags: ["football", "jersey", "nike", "kit", "professional"],
    images: ["bat.jpg"],
    isActive: true,
    rating: 4.6,
    reviewCount: 31
  },
  {
    name: "Table Tennis Racket - Professional",
    description: "Professional table tennis racket with advanced rubber coating and carbon blade.",
    price: 6500,
    originalPrice: 8000,
    category: "other",
    brand: "Butterfly",
    stock: 15,
    features: ["Professional Rubber", "Carbon Blade", "Comfortable Grip", "High Speed", "Control Spin"],
    tags: ["table-tennis", "racket", "butterfly", "professional", "competition"],
    images: ["bat.jpg"],
    isActive: true,
    rating: 4.7,
    reviewCount: 17
  },
  {
    name: "Yoga Block Set - 2 Pieces",
    description: "High-density foam yoga blocks for support and alignment in various yoga poses.",
    price: 2500,
    originalPrice: 3500,
    category: "fitness",
    brand: "Gaiam",
    stock: 40,
    features: ["High-Density Foam", "Lightweight", "Non-Slip Surface", "Eco-Friendly", "2-Piece Set"],
    tags: ["fitness", "yoga", "blocks", "support", "alignment"],
    images: ["bat.jpg"],
    isActive: true,
    rating: 4.4,
    reviewCount: 26
  },
  {
    name: "Cricket Shoes - Spiked",
    description: "Professional cricket shoes with metal spikes for better grip and ankle support.",
    price: 9500,
    originalPrice: 12000,
    category: "cricket",
    brand: "New Balance",
    stock: 10,
    features: ["Metal Spikes", "Ankle Support", "Breathable", "Durable Sole", "Lightweight"],
    tags: ["cricket", "shoes", "spikes", "new-balance", "professional"],
    images: ["bat.jpg"],
    isActive: true,
    rating: 4.6,
    reviewCount: 13
  },
  {
    name: "Basketball - Professional",
    description: "Official size professional basketball with composite leather for superior grip.",
    price: 5500,
    originalPrice: 7000,
    category: "other",
    brand: "Spalding",
    stock: 18,
    features: ["Composite Leather", "Official Size", "Good Grip", "Durable", "Indoor/Outdoor"],
    tags: ["basketball", "ball", "spalding", "professional", "nba"],
    images: ["bat.jpg"],
    isActive: true,
    rating: 4.5,
    reviewCount: 29
  },
  {
    name: "Jump Rope - Speed",
    description: "Professional speed jump rope with ball bearings for smooth and fast rotations.",
    price: 1500,
    originalPrice: 2000,
    category: "fitness",
    brand: "CrossFit",
    stock: 35,
    features: ["Ball Bearings", "Adjustable Length", "Lightweight", "Durable Cable", "Speed Training"],
    tags: ["fitness", "jump-rope", "cardio", "speed", "crossfit"],
    images: ["bat.jpg"],
    isActive: true,
    rating: 4.3,
    reviewCount: 41
  },
  {
    name: "Cricket Kit Bag - Large",
    description: "Large cricket kit bag with multiple compartments for organized storage.",
    price: 6500,
    originalPrice: 8000,
    category: "cricket",
    brand: "SS",
    stock: 12,
    features: ["Multiple Compartments", "Water Resistant", "Shoulder Strap", "Durable Material", "Ventilated"],
    tags: ["cricket", "bag", "kit-bag", "ss", "storage"],
    images: ["bat.jpg"],
    isActive: true,
    rating: 4.4,
    reviewCount: 11
  }
];

const adminUsers = [
  {
    name: "Super Admin",
    email: "admin@elevatesport.com",
    password: "admin123",
    phone: "+923001234567",
    role: "admin",
    isAdmin: true
  },
  {
    name: "Sports Manager",
    email: "manager@elevatesport.com",
    password: "manager123",
    phone: "+923001234568",
    role: "admin",
    isAdmin: true
  }
];

const regularUsers = [
  {
    name: "John Doe",
    email: "john@example.com",
    password: "user123",
    phone: "+923001234569",
    role: "user",
    isAdmin: false
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "user123",
    phone: "+923001234570",
    role: "user",
    isAdmin: false
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sports-store', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create admin users
    console.log('👥 Creating admin users...');
    for (const userData of adminUsers) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      await user.save();
      console.log(`✅ Admin user created: ${user.email}`);
    }

    // Create regular users
    console.log('👥 Creating regular users...');
    for (const userData of regularUsers) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      await user.save();
      console.log(`✅ Regular user created: ${user.email}`);
    }

    // Insert products
    console.log('📦 Adding products...');
    await Product.insertMany(sampleProducts);
    console.log('✅ Sample products added successfully!');

    // Show summary
    const productCount = await Product.countDocuments();
    const userCount = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    
    console.log('\n📊 SEEDING COMPLETED SUCCESSFULLY!');
    console.log('='.repeat(50));
    console.log(`📦 Products: ${productCount}`);
    console.log(`👥 Total Users: ${userCount}`);
    console.log(`👑 Admin Users: ${adminCount}`);
    console.log(`👤 Regular Users: ${userCount - adminCount}`);
    
    console.log('\n🔑 ADMIN LOGIN CREDENTIALS:');
    console.log('='.repeat(50));
    adminUsers.forEach(admin => {
      console.log(`📧 Email: ${admin.email}`);
      console.log(`🔐 Password: ${admin.password}`);
      console.log('---');
    });

    console.log('\n👤 USER LOGIN CREDENTIALS:');
    console.log('='.repeat(50));
    regularUsers.forEach(user => {
      console.log(`📧 Email: ${user.email}`);
      console.log(`🔐 Password: ${user.password}`);
      console.log('---');
    });

    console.log('\n🚀 Your application is ready to use!');
    console.log('📍 Access the admin dashboard at: http://localhost:3000/admin/login');
    console.log('📍 Access the main site at: http://localhost:3000');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle SIGINT (Ctrl+C)
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT. Closing database connection...');
  await mongoose.connection.close();
  process.exit(0);
});

seed();