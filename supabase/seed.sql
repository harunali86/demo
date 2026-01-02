-- Harun Store Database Seed Script
-- Run this in Supabase SQL Editor

-- First, insert categories
INSERT INTO categories (id, name, slug, image_url, is_active, sort_order) VALUES
('cat_001', 'Premium Tech', 'premium_tech', '/categories/tech.png', true, 1),
('cat_002', 'Fashion', 'fashion', '/categories/fashion.png', true, 2),
('cat_003', 'Watches', 'watches', '/categories/watches.png', true, 3),
('cat_004', 'Audio', 'audio', '/categories/audio.png', true, 4),
('cat_005', 'Sneakers', 'sneakers', '/categories/sneakers.png', true, 5),
('cat_006', 'Gaming', 'gaming', '/categories/gaming.png', true, 6),
('cat_007', 'Lifestyle', 'lifestyle', '/categories/lifestyle.png', true, 7),
('cat_008', 'Accessories', 'accessories', '/categories/accessories.png', true, 8)
ON CONFLICT (id) DO NOTHING;

-- Insert products
INSERT INTO products (id, category_id, name, slug, description, base_price, compare_price, is_active, is_featured, metadata) VALUES
-- Premium Tech
('prod_001', 'cat_001', 'MacBook Pro M3', 'macbook-pro-m3', 'Experience the power of M3 chip. 14-inch Liquid Retina XDR display.', 199990, 249990, true, true, '{}'),
('prod_002', 'cat_001', 'iPhone 15 Titanium', 'iphone-15-titanium', 'Forged in titanium. A17 Pro chip for gaming.', 134900, 144900, true, true, '{}'),
('prod_003', 'cat_001', 'iPad Pro 12.9', 'ipad-pro-12.9', 'The ultimate iPad experience with M2 chip.', 119900, 129900, true, true, '{}'),
('prod_004', 'cat_001', 'Samsung S24 Ultra', 'samsung-s24-ultra', 'Galaxy AI is here. 200MP camera.', 129999, 144999, true, true, '{}'),

-- Fashion
('prod_005', 'cat_002', 'Designer Summer Dress', 'designer-summer-dress', 'Elegant summer collection with premium fabric.', 4999, 7999, true, true, '{}'),
('prod_006', 'cat_002', 'Premium Hoodie Black', 'premium-hoodie-black', 'Ultra-soft cotton blend, perfect fit.', 2999, 4999, true, true, '{}'),
('prod_007', 'cat_002', 'Casual Denim Jacket', 'casual-denim-jacket', 'Classic denim with modern twist.', 3499, 5499, true, true, '{}'),
('prod_008', 'cat_002', 'Formal Blazer Grey', 'formal-blazer-grey', 'Sharp tailored blazer for any occasion.', 6999, 9999, true, true, '{}'),

-- Watches
('prod_009', 'cat_003', 'Apple Watch Ultra 2', 'apple-watch-ultra-2', 'The most rugged Apple Watch ever.', 89990, 99990, true, true, '{}'),
('prod_010', 'cat_003', 'Rolex Submariner', 'rolex-submariner', 'The legendary dive watch.', 895000, null, true, true, '{}'),
('prod_011', 'cat_003', 'Tag Heuer Monaco', 'tag-heuer-monaco', 'Iconic square case chronograph.', 495000, null, true, true, '{}'),
('prod_012', 'cat_003', 'Galaxy Watch 6', 'galaxy-watch-6', 'Advanced health monitoring.', 32999, 39999, true, true, '{}'),

-- Audio
('prod_013', 'cat_004', 'AirPods Pro 2', 'airpods-pro-2', 'Adaptive Audio. Active Noise Cancellation.', 24900, 26900, true, true, '{}'),
('prod_014', 'cat_004', 'Sony WH-1000XM5', 'sony-wh-1000xm5', 'Industry-leading noise cancellation.', 29990, 34990, true, true, '{}'),
('prod_015', 'cat_004', 'Bose 700', 'bose-700', 'Premium noise cancelling headphones.', 34990, 39990, true, true, '{}'),
('prod_016', 'cat_004', 'JBL PartyBox 310', 'jbl-partybox-310', 'Powerful party speaker with lights.', 39990, 49990, true, true, '{}'),

-- Sneakers
('prod_017', 'cat_005', 'Nike Air Max 90', 'nike-air-max-90', 'Iconic style, legendary cushioning.', 12995, 14995, true, true, '{}'),
('prod_018', 'cat_005', 'Adidas Ultraboost', 'adidas-ultraboost', 'Energy return with every step.', 15999, 18999, true, true, '{}'),
('prod_019', 'cat_005', 'Jordan 1 Retro', 'jordan-1-retro', 'The shoe that started it all.', 16995, 19995, true, true, '{}'),
('prod_020', 'cat_005', 'New Balance 990v5', 'new-balance-990v5', 'Made in USA premium comfort.', 17999, null, true, true, '{}'),

-- Gaming
('prod_021', 'cat_006', 'PlayStation 5', 'playstation-5', 'Lightning fast SSD. Stunning games.', 49990, 54990, true, true, '{}'),
('prod_022', 'cat_006', 'Xbox Series X', 'xbox-series-x', 'The most powerful Xbox ever.', 49990, 54990, true, true, '{}'),
('prod_023', 'cat_006', 'Nintendo Switch OLED', 'nintendo-switch-oled', 'Enhanced 7-inch OLED screen.', 34999, 39999, true, true, '{}'),
('prod_024', 'cat_006', 'Gaming Chair Pro', 'gaming-chair-pro', 'Ergonomic gaming chair with lumbar support.', 15999, 24999, true, true, '{}'),

-- Lifestyle
('prod_025', 'cat_007', 'Smart Lamp RGB', 'smart-lamp-rgb', '16 million colors. Voice control.', 2999, 4999, true, true, '{}'),
('prod_026', 'cat_007', 'Air Purifier Pro', 'air-purifier-pro', 'HEPA filter. Silent operation.', 12999, 19999, true, true, '{}'),
('prod_027', 'cat_007', 'Robot Vacuum', 'robot-vacuum', 'Smart mapping. Self-cleaning.', 24999, 34999, true, true, '{}'),
('prod_028', 'cat_007', 'Coffee Maker Pro', 'coffee-maker-pro', 'Barista quality at home.', 9999, 14999, true, true, '{}'),

-- Accessories
('prod_029', 'cat_008', 'Leather Wallet Premium', 'leather-wallet-premium', 'Genuine leather. RFID blocking.', 1999, 3499, true, true, '{}'),
('prod_030', 'cat_008', 'Designer Sunglasses', 'designer-sunglasses', 'UV400 protection. Italian design.', 8999, 12999, true, true, '{}'),
('prod_031', 'cat_008', 'Premium Belt Brown', 'premium-belt-brown', 'Full grain leather belt.', 2499, 3999, true, true, '{}'),
('prod_032', 'cat_008', 'Travel Backpack', 'travel-backpack', 'Anti-theft design. USB charging.', 4999, 7999, true, true, '{}')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    base_price = EXCLUDED.base_price,
    compare_price = EXCLUDED.compare_price,
    description = EXCLUDED.description;

-- Insert product images
INSERT INTO product_images (id, product_id, url, is_primary, sort_order) VALUES
('img_001', 'prod_001', '/products/macbook.png', true, 1),
('img_002', 'prod_002', '/products/iphone15.png', true, 1),
('img_003', 'prod_003', '/products/ipad.png', true, 1),
('img_004', 'prod_004', '/products/samsung.png', true, 1),
('img_005', 'prod_005', '/products/dress.jpg', true, 1),
('img_006', 'prod_006', '/products/hoodie.png', true, 1),
('img_007', 'prod_007', '/products/jacket.jpg', true, 1),
('img_008', 'prod_008', '/products/blazer.jpg', true, 1),
('img_009', 'prod_009', '/products/applewatch.png', true, 1),
('img_010', 'prod_010', '/products/rolex.jpg', true, 1),
('img_011', 'prod_011', '/products/tagheuer.jpg', true, 1),
('img_012', 'prod_012', '/products/galaxywatch.jpg', true, 1),
('img_013', 'prod_013', '/products/airpods.png', true, 1),
('img_014', 'prod_014', '/products/sony.png', true, 1),
('img_015', 'prod_015', '/products/bose.jpg', true, 1),
('img_016', 'prod_016', '/products/jbl.jpg', true, 1),
('img_017', 'prod_017', '/products/airmax.png', true, 1),
('img_018', 'prod_018', '/products/ultraboost.jpg', true, 1),
('img_019', 'prod_019', '/products/jordan.png', true, 1),
('img_020', 'prod_020', '/products/newbalance.jpg', true, 1),
('img_021', 'prod_021', '/products/ps5.png', true, 1),
('img_022', 'prod_022', '/products/xbox.png', true, 1),
('img_023', 'prod_023', '/products/switch.jpg', true, 1),
('img_024', 'prod_024', '/products/gamingchair.jpg', true, 1),
('img_025', 'prod_025', '/products/lamp.png', true, 1),
('img_026', 'prod_026', '/products/purifier.jpg', true, 1),
('img_027', 'prod_027', '/products/vacuum.jpg', true, 1),
('img_028', 'prod_028', '/products/coffee.jpg', true, 1),
('img_029', 'prod_029', '/products/wallet.jpg', true, 1),
('img_030', 'prod_030', '/products/sunglasses.jpg', true, 1),
('img_031', 'prod_031', '/products/belt.jpg', true, 1),
('img_032', 'prod_032', '/products/backpack.jpg', true, 1)
ON CONFLICT (id) DO UPDATE SET url = EXCLUDED.url;

-- Create sample coupons
INSERT INTO coupons (id, code, type, value, min_order, max_discount, is_active) VALUES
('coupon_001', 'WELCOME10', 'percentage', 10, 500, 200, true),
('coupon_002', 'FLAT500', 'fixed', 500, 2000, null, true),
('coupon_003', 'NEWYEAR25', 'percentage', 25, 1000, 1000, true)
ON CONFLICT (id) DO NOTHING;

-- Create function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number := 'HS' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for order numbers (if not exists)
DROP TRIGGER IF EXISTS trigger_generate_order_number ON orders;
CREATE TRIGGER trigger_generate_order_number
    BEFORE INSERT ON orders
    FOR EACH ROW
    WHEN (NEW.order_number IS NULL)
    EXECUTE FUNCTION generate_order_number();
