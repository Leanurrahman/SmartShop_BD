import { setDoc, doc, collection, getDocs, serverTimestamp, getDoc } from 'firebase/firestore';
import { db, auth } from './firebaseConfig';
import { handleFirestoreError, OperationType } from './dbService';

export const INITIAL_PRODUCTS = [
  // --- ELECTRONICS ---
  {
    id: "p1",
    name: "MacBook Pro M3 Max",
    description: "The most advanced Mac laptop ever built. Features the M3 Max chip for extreme performance and incredible battery life.",
    price: 350000,
    discountPrice: 320000,
    category: "Electronics",
    stock: 15,
    rating: 5,
    featured: true,
    popularity: 98,
    images: ["https://m.media-amazon.com/images/I/618m4v5xJ-L._AC_SL1500_.jpg", "https://m.media-amazon.com/images/I/61fS4L-A4SL._AC_SL1500_.jpg"],
    brand: "Apple"
  },
  {
    id: "p2",
    name: "Sony WH-1000XM5",
    description: "Industry-leading noise cancelling headphones with dual processors and 8 microphones for unprecedented sound quality.",
    price: 45000,
    discountPrice: 42000,
    category: "Electronics",
    stock: 25,
    rating: 5,
    featured: true,
    popularity: 95,
    images: ["https://m.media-amazon.com/images/I/51SKmu2G9FL._AC_SL1500_.jpg"],
    brand: "Sony"
  },
  {
    id: "p4",
    name: "Smart Watch Ultra",
    description: "The rugged and capable smartwatch that pushes boundaries. Titanium case, long-lasting battery, and precision GPS.",
    price: 25000,
    discountPrice: 22000,
    category: "Electronics",
    stock: 20,
    rating: 4,
    featured: true,
    popularity: 90,
    images: ["https://m.media-amazon.com/images/I/718fNoXWfmL._AC_SL1500_.jpg"],
    brand: "Generic"
  },
  {
    id: "p7",
    name: "iPhone 15 Pro Max",
    description: "Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.",
    price: 185000,
    discountPrice: 175000,
    category: "Electronics",
    stock: 12,
    rating: 5,
    featured: true,
    popularity: 99,
    images: ["https://m.media-amazon.com/images/I/81+GI79yi-L._AC_SL1500_.jpg"],
    brand: "Apple"
  },
  {
    id: "p8",
    name: "Samsung Galaxy S24 Ultra",
    description: "Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, you can unleash whole new levels of creativity, productivity, and possibility.",
    price: 165000,
    discountPrice: 155000,
    category: "Electronics",
    stock: 18,
    rating: 5,
    featured: false,
    popularity: 94,
    images: ["https://m.media-amazon.com/images/I/71RVuS3q9QL._AC_SL1500_.jpg"],
    brand: "Samsung"
  },

  // --- FASHION ---
  {
    id: "p3",
    name: "Premium Leather Jacket",
    description: "Classic black leather jacket made from 100% genuine lambskin. Soft, durable and stylish for all-season wear.",
    price: 12000,
    discountPrice: 9500,
    category: "Fashion",
    stock: 50,
    rating: 4,
    featured: false,
    popularity: 80,
    images: ["https://m.media-amazon.com/images/I/61Nl5zRls3L._AC_SL1200_.jpg"],
    brand: "UrbanStyle"
  },
  {
    id: "p9",
    name: "Men's Slim Fit Denim Jeans",
    description: "Classic five-pocket styling jeans with premium stretch material for ultimate warmth and comfort.",
    price: 3500,
    discountPrice: 2800,
    category: "Fashion",
    stock: 45,
    rating: 4,
    featured: true,
    popularity: 85,
    images: ["https://m.media-amazon.com/images/I/61Nl-VbEwUL._AC_SL1500_.jpg"],
    brand: "DenimCo"
  },
  {
    id: "p10",
    name: "Elegant Evening Gown",
    description: "Beautiful A-line chiffon floor-length evening dress spectacular for parties, weddings, or formal events.",
    price: 15000,
    discountPrice: 13500,
    category: "Fashion",
    stock: 10,
    rating: 5,
    featured: true,
    popularity: 89,
    images: ["https://m.media-amazon.com/images/I/61F1WkE9z-L._AC_SL1500_.jpg"],
    brand: "VogueLine"
  },
  {
    id: "p11",
    name: "Minimalist Canvas Sneakers",
    description: "Comfortable, versatile daily wear sneakers with breathable mesh cotton structure and non-slip rubber soles.",
    price: 4200,
    discountPrice: 3200,
    category: "Fashion",
    stock: 35,
    rating: 4,
    featured: false,
    popularity: 78,
    images: ["https://m.media-amazon.com/images/I/713-3z7UuML._AC_SL1500_.jpg"],
    brand: "PaceFeet"
  },

  // --- HOME & LIVING ---
  {
    id: "p5",
    name: "Nordic Coffee Table",
    description: "Minimalist Scandinavian design coffee table with solid oak legs and a white matte finish. Perfect for modern living rooms.",
    price: 8000,
    discountPrice: 7200,
    category: "Home & Living",
    stock: 12,
    rating: 5,
    featured: false,
    popularity: 65,
    images: ["https://m.media-amazon.com/images/I/61H4hT3O7ML._AC_SL1500_.jpg"],
    brand: "Ikea Style"
  },
  {
    id: "p12",
    name: "Ergonomic Office Chair",
    description: "High-back mesh workspace desk chair featuring adjustable lumbar support, armrests, and dynamic tension tilt controller.",
    price: 18500,
    discountPrice: 16500,
    category: "Home & Living",
    stock: 15,
    rating: 5,
    featured: true,
    popularity: 92,
    images: ["https://m.media-amazon.com/images/I/61y8yCg17gL._AC_SL1500_.jpg"],
    brand: "ErgoSeat"
  },
  {
    id: "p13",
    name: "Ceramic Minimalist Vase Set",
    description: "Pack of 3 neutral off-white textured ceramic vases. Handcrafted to add a modern organic touch to fireplaces, shelves, or console tables.",
    price: 4500,
    discountPrice: 3900,
    category: "Home & Living",
    stock: 22,
    rating: 4,
    featured: false,
    popularity: 70,
    images: ["https://m.media-amazon.com/images/I/71z78wH40-L._AC_SL1500_.jpg"],
    brand: "ArtisanHome"
  },
  {
    id: "p14",
    name: "Warm Sunset Projection Lamp",
    description: "Ambient LED sunset light. Rotate the head to expand the size and layout of our warm lighting projection.",
    price: 2200,
    discountPrice: 1500,
    category: "Home & Living",
    stock: 50,
    rating: 4,
    featured: true,
    popularity: 87,
    images: ["https://m.media-amazon.com/images/I/61qS+RjXfOL._AC_SL1500_.jpg"],
    brand: "Lumina"
  },

  // --- BEAUTY & PERSONAL CARE ---
  {
    id: "p15",
    name: "Organic Aloe Vera Gel",
    description: "100% Pure, cold-pressed aloe vera moisturizer gel. Perfect for hair, skin, face, and soothing sunburn relief.",
    price: 850,
    discountPrice: 650,
    category: "Beauty & Personal Care",
    stock: 90,
    rating: 5,
    featured: false,
    popularity: 81,
    images: ["https://m.media-amazon.com/images/I/71-0p2YAt1L._AC_SL1500_.jpg"],
    brand: "BioGlow"
  },
  {
    id: "p16",
    name: "Vitamin C Face Serum",
    description: "Highly concentrated professional anti-aging face serum. Combines pure Vitamin C and Hyaluronic Acid.",
    price: 1800,
    discountPrice: 1450,
    category: "Beauty & Personal Care",
    stock: 40,
    rating: 5,
    featured: true,
    popularity: 91,
    images: ["https://m.media-amazon.com/images/I/61H+V-i2sBL._AC_SL1500_.jpg"],
    brand: "Luminous"
  },
  {
    id: "p17",
    name: "Matte Velvet Lipstick Trio",
    description: "Fabulous pack of three long-lasting, smudge-resistant velvet matte lipsticks in iconic berry and reddish shades.",
    price: 2500,
    discountPrice: 1950,
    category: "Beauty & Personal Care",
    stock: 30,
    rating: 4,
    featured: false,
    popularity: 76,
    images: ["https://m.media-amazon.com/images/I/61Xq0D6t94L._AC_SL1500_.jpg"],
    brand: "GlamUp"
  },
  {
    id: "p18",
    name: "Charcoal Face Scrub",
    description: "Deep cleansing exfoliating scrub featuring active activated charcoal. Removes blackheads, dead skin, and details pores.",
    price: 1100,
    discountPrice: 890,
    category: "Beauty & Personal Care",
    stock: 65,
    rating: 4,
    featured: false,
    popularity: 84,
    images: ["https://m.media-amazon.com/images/I/61+Y6o-rYVL._AC_SL1500_.jpg"],
    brand: "SkinShield"
  },

  // --- SPORTS & OUTDOORS ---
  {
    id: "p19",
    name: "Professional Yoga Mat",
    description: "Extra thick, eco-friendly alignment sports yoga mat. Dual-sided non-slip surface provides ultimate cushioning and joint support.",
    price: 3200,
    discountPrice: 2600,
    category: "Sports & Outdoors",
    stock: 45,
    rating: 5,
    featured: false,
    popularity: 74,
    images: ["https://m.media-amazon.com/images/I/815ZptFOn4L._AC_SL1550_.jpg"],
    brand: "ZenCore"
  },
  {
    id: "p20",
    name: "High-Performance Running Shoes",
    description: "Engineered mesh breathable jogging shoes with premium shock-absorption responsive foam soles for speed and stamina.",
    price: 9500,
    discountPrice: 8500,
    category: "Sports & Outdoors",
    stock: 25,
    rating: 5,
    featured: true,
    popularity: 93,
    images: ["https://m.media-amazon.com/images/I/71Edf3DguXL._AC_SL1500_.jpg"],
    brand: "Aerotrack"
  },
  {
    id: "p21",
    name: "Insulated Water Bottle 1L",
    description: "Double-wall vacuum insulated stainless steel water bottle. Keeps liquids ice cold for 24 hours or piping hot for 12 hours.",
    price: 2400,
    discountPrice: 1900,
    category: "Sports & Outdoors",
    stock: 80,
    rating: 4,
    featured: false,
    popularity: 88,
    images: ["https://m.media-amazon.com/images/I/51wY4GvO3cL._AC_SL1500_.jpg"],
    brand: "HydroPeak"
  },
  {
    id: "p22",
    name: "Waterproof Camping Tent",
    description: "Quick setup 3-4 person family dome tent. Removable rainfly, durable fiberglass poles, and breathable inner mesh window screens.",
    price: 14500,
    discountPrice: 12500,
    category: "Sports & Outdoors",
    stock: 15,
    rating: 4,
    featured: true,
    popularity: 86,
    images: ["https://m.media-amazon.com/images/I/71A9W1eM+fL._AC_SL1500_.jpg"],
    brand: "WildCountry"
  },

  // --- GROCERIES ---
  {
    id: "p6",
    name: "Organic Honey 500g",
    description: "Pure, unprocessed organic honey collected from deep forests. Rich in antioxidants and natural sweetness.",
    price: 1200,
    discountPrice: 950,
    category: "Groceries",
    stock: 100,
    rating: 5,
    featured: false,
    popularity: 88,
    images: ["https://m.media-amazon.com/images/I/71wE8pXjJdL._AC_SL1500_.jpg"],
    brand: "NatureFresh"
  },
  {
    id: "p23",
    name: "Roasted Almonds 250g",
    description: "Crispy, unsalted California whole almonds. Slow-roasted to perfection for a heart-healthy fiber-packed organic daily snack.",
    price: 850,
    discountPrice: 700,
    category: "Groceries",
    stock: 120,
    rating: 5,
    featured: true,
    popularity: 90,
    images: ["https://m.media-amazon.com/images/I/71rI9k3ZToL._AC_SL1500_.jpg"],
    brand: "NutriCrunch"
  },
  {
    id: "p24",
    name: "Premium Assam Loose Tea Leaves",
    description: "Pure black loose leaf tea directly imported from the rich gardens of Assam. Rich amber color, ultra malt flavor, robust brew.",
    price: 650,
    discountPrice: 500,
    category: "Groceries",
    stock: 150,
    rating: 5,
    featured: false,
    popularity: 82,
    images: ["https://m.media-amazon.com/images/I/71T1Kj8x9TL._AC_SL1500_.jpg"],
    brand: "Tealand"
  },
  {
    id: "p25",
    name: "Extra Virgin Olive Oil 500ml",
    description: "Cold-pressed extra virgin olive oil of superior category obtained directly from selected handpicked mediterranean olives.",
    price: 1800,
    discountPrice: 1550,
    category: "Groceries",
    stock: 60,
    rating: 5,
    featured: true,
    popularity: 91,
    images: ["https://m.media-amazon.com/images/I/71I6rX2-4BL._AC_SL1500_.jpg"],
    brand: "SolOro"
  },
  // --- MEN'S FASHION ---
  {
    id: "p26",
    name: "Premium Linen Cotton Panjabi",
    description: "Elegant semi-formal linen-cotton mix Panjabi with detailed hand-embroidery on the collar. Double stitching for superior lifetime.",
    price: 2850,
    discountPrice: 2450,
    category: "Fashion",
    subcategory: "Men",
    categories: ["Fashion", "Men"],
    stock: 25,
    rating: 5,
    featured: true,
    popularity: 96,
    images: ["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600&auto=format&fit=crop"],
    brand: "Aarong Style"
  },
  {
    id: "p27",
    name: "Men's Slim Fit Polo Shirt",
    description: "High-grade mercerized cotton polo shirt in deep navy blue. Breathable knit design, resistant to color fade and stretching.",
    price: 1500,
    discountPrice: 1200,
    category: "Fashion",
    subcategory: "Men",
    categories: ["Fashion", "Men"],
    stock: 45,
    rating: 4,
    featured: false,
    popularity: 88,
    images: ["https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=600&auto=format&fit=crop"],
    brand: "Club Aura"
  },
  // --- WOMEN'S FASHION ---
  {
    id: "p28",
    name: "Georgette Embroidered Salwar Kameez",
    description: "Beautiful 3-piece designer salwar suit featuring intricate sequin and embroidery work with a matching chiffon dupatta. Extremely soft and premium clothing feel.",
    price: 4500,
    discountPrice: 3800,
    category: "Fashion",
    subcategory: "Women",
    categories: ["Fashion", "Women"],
    stock: 15,
    rating: 5,
    featured: true,
    popularity: 92,
    images: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600&auto=format&fit=crop"],
    brand: "Anjan's"
  },
  {
    id: "p29",
    name: "Handicrafted Block Print Cotton Saree",
    description: "Pure Tangail cotton saree printed with premium eco-friendly block dyes. Lightweight, comfortable, and perfect for elegant regular or festive wears.",
    price: 3500,
    discountPrice: 2900,
    category: "Fashion",
    subcategory: "Women",
    categories: ["Fashion", "Women"],
    stock: 20,
    rating: 5,
    featured: false,
    popularity: 89,
    images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop"],
    brand: "Katha"
  },
  // --- KIDS' FASHION ---
  {
    id: "p30",
    name: "Junior Boys Denim dungaree Set",
    description: "Cute and playful two-piece play clothing set containing micro-stretch denim dungarees and a soft cotton striped tee.",
    price: 1800,
    discountPrice: 1450,
    category: "Fashion",
    subcategory: "Kids",
    categories: ["Fashion", "Kids"],
    stock: 30,
    rating: 4,
    featured: false,
    popularity: 79,
    images: ["https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=600&auto=format&fit=crop"],
    brand: "Apex Kids"
  },
  {
    id: "p31",
    name: "Floral Princess Layered Tulle Dress",
    description: "Fluffy multi-layered tulle dress with breathable cotton lining, detailed golden floral embroidery, and comfortable waistband.",
    price: 2200,
    discountPrice: 1750,
    category: "Fashion",
    subcategory: "Kids",
    categories: ["Fashion", "Kids"],
    stock: 18,
    rating: 5,
    featured: true,
    popularity: 84,
    images: ["https://images.unsplash.com/photo-1622324228586-e34fc15fe44d?q=80&w=600&auto=format&fit=crop"],
    brand: "Pink Bloom"
  },
  // --- BOOKS & STATIONERY ---
  {
    id: "p32",
    name: "The Alchemist (Hardcover Special Edition)",
    description: "Paulo Coelho's classic motivational masterpiece on pursuing your lifelong dreams. High-quality paper, golden foil hardcover lettering, and beautiful ribbon marker.",
    price: 650,
    discountPrice: 450,
    category: "Books & Stationery",
    categories: ["Books & Stationery", "Books"],
    stock: 50,
    rating: 5,
    featured: true,
    popularity: 97,
    images: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop"],
    brand: "HarperCollins"
  },
  {
    id: "p33",
    name: "Paradoxical Sajid (Complete Set)",
    description: "A highly acclaimed collection of thought-provoking dialogues addressing modern spiritual inquiries. Excellent printing, premium binding, and clear text flow.",
    price: 520,
    discountPrice: 390,
    category: "Books & Stationery",
    categories: ["Books & Stationery", "Books"],
    stock: 65,
    rating: 5,
    featured: false,
    popularity: 93,
    images: ["https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600&auto=format&fit=crop"],
    brand: "Guardian Publications"
  },
  // --- TOYS & GAMES ---
  {
    id: "p34",
    name: "Educational 12-in-1 Solar Powered Robot Kit",
    description: "Build-your-own solar mechanical robot kit. Teach kids basic alignment, physics, and gear mechanics with 12 distinct configurations. Fully runs on dynamic solar energy.",
    price: 2400,
    discountPrice: 1850,
    category: "Toys & Games",
    categories: ["Toys & Games", "Toys"],
    stock: 35,
    rating: 4,
    featured: true,
    popularity: 90,
    images: ["https://images.unsplash.com/photo-1530641042-49195b067d7a?q=80&w=600&auto=format&fit=crop"],
    brand: "STEMtech"
  },
  {
    id: "p35",
    name: "Magnetic Geometric Building 3D Tiles 100pcs",
    description: "High-strength 3D magnetic geometric tiles. Stimulates visual-spatial awareness, motor skills, and creative intelligence. Non-toxic, BPA-free organic plastic.",
    price: 3200,
    discountPrice: 2600,
    category: "Toys & Games",
    categories: ["Toys & Games", "Toys"],
    stock: 22,
    rating: 5,
    featured: false,
    popularity: 87,
    images: ["https://images.unsplash.com/photo-1587654780291-39c9404d746b?q=80&w=600&auto=format&fit=crop"],
    brand: "MagnaPlay"
  },
  // --- BABY & KIDS ---
  {
    id: "p36",
    name: "Mimi & Co Ergonomic Infant Carrier Sling",
    description: "Multi-functional infant hip-seat carrier. Reduces shoulder and back stress with breathable 3D mesh fabric, adjustable straps, and anti-slip safety locks.",
    price: 3500,
    discountPrice: 2850,
    category: "Baby & Kids",
    categories: ["Baby & Kids", "Baby"],
    stock: 12,
    rating: 5,
    featured: true,
    popularity: 91,
    images: ["https://images.unsplash.com/photo-1594913785162-e6785b49eed9?q=80&w=600&auto=format&fit=crop"],
    brand: "Mimi & Co"
  },
  {
    id: "p37",
    name: "Large 6-Layer Organic Cotton Swaddle Towel",
    description: "Large 6-layer organic cotton hooded baby bath blanket. Amazingly absorbent, gentle on hypoallergenic newborn or infant skin.",
    price: 1200,
    discountPrice: 950,
    category: "Baby & Kids",
    categories: ["Baby & Kids", "Baby"],
    stock: 40,
    rating: 4,
    featured: false,
    popularity: 86,
    images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=600&auto=format&fit=crop"],
    brand: "ComfortNest"
  },
  // --- BIKE ---
  {
    id: "p38",
    name: "Veloce Legion 30 Sports Bicycle",
    description: "Lightweight aluminum alloy frameset, responsive Zoom suspension fork, and precision Shimano 24-speed shifting system. Ideal for city streets or heavy commuter trails.",
    price: 22500,
    discountPrice: 19999,
    category: "Bike",
    categories: ["Bike"],
    stock: 8,
    rating: 5,
    featured: true,
    popularity: 95,
    images: ["https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=600&auto=format&fit=crop"],
    brand: "Veloce"
  },
  {
    id: "p39",
    name: "Core Project Legend MTB",
    description: "Professional core mountain bike featuring dual hydraulic disc brakes, high-damping frame design, and customized extra-durable steel frame construction.",
    price: 16500,
    discountPrice: 14500,
    category: "Bike",
    categories: ["Bike"],
    stock: 10,
    rating: 4,
    featured: false,
    popularity: 91,
    images: ["https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?q=80&w=600&auto=format&fit=crop"],
    brand: "Core"
  }
];

export const seedDatabase = async () => {
  try {
    const productsRef = collection(db, "products");
    const snapshot = await getDocs(productsRef);
    
    // Check if user is authenticated (can be checked to log correctly)
    if (!auth.currentUser) {
      console.warn("Seeding checker delay: User is not authenticated.");
    }

    const existingIds = new Set(snapshot.docs.map(doc => doc.id));
    let seededCount = 0;

    // Seed any missing standard initial products
    for (const product of INITIAL_PRODUCTS) {
      if (!existingIds.has(product.id)) {
        await setDoc(doc(db, "products", product.id), {
          ...product,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        seededCount++;
      }
    }

    if (seededCount > 0) {
      console.log(`Successfully seeded ${seededCount} missing default products into the database.`);
    }

    // Seed default coupon SMART20 if it doesn't exist
    const couponSnap = await getDocs(collection(db, "coupons"));
    const existingCoupons = new Set(couponSnap.docs.map(doc => doc.id));
    if (!existingCoupons.has("SMART20")) {
      await setDoc(doc(db, "coupons", "SMART20"), {
        code: "SMART20",
        discountType: "percentage",
        discountValue: 20,
        minOrderAmount: 1000,
        expiryDate: new Date("2026-12-31"),
        active: true
      });
      console.log("Seeded default code coupon SMART20.");
    }

  } catch (error) {
    console.error("Error during incremental seeding check:", error);
    if (error.code === 'permission-denied') {
       console.warn("Permission denied during seeding. This matches typical custom Firestore rules if user is not authorized to write directly.");
    }
  }
};
