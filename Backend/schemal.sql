-- ----------------------------
-- Tạo các bảng không phụ thuộc (hoặc ít phụ thuộc) trước
-- ----------------------------

CREATE TABLE IF NOT EXISTS `users` (
                                       `id` CHAR(36) NOT NULL,
    `user_name` VARCHAR(100) NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(15) NULL,
    `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    `salt` VARCHAR(50) NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `idx_email` (`email`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===== CẬP NHẬT BẢNG 'CATEGORIES' =====
CREATE TABLE IF NOT EXISTS `categories` (
                                            `id` CHAR(36) NOT NULL, -- CẬP NHẬT: Đổi sang CHAR(36)
    `category_id` CHAR(36) NULL, -- CẬP NHẬT: Đổi sang CHAR(36) (tự tham chiếu)
    `name` VARCHAR(150) NOT NULL,
    `slug` VARCHAR(150) NOT NULL,
    `description` TEXT NULL, -- THÊM MỚI
    `image_url` VARCHAR(255) NULL, -- THÊM MỚI
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE, -- THÊM MỚI
    `sort_order` INT NOT NULL DEFAULT 0, -- THÊM MỚI
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `idx_slug` (`slug`),
    FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- =======================================

CREATE TABLE IF NOT EXISTS `promotions` (
                                            `id` CHAR(36) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `start_date` TIMESTAMP NULL,
    `end_date` TIMESTAMP NULL,
    `status` ENUM('active', 'inactive', 'scheduled', 'expired') NOT NULL DEFAULT 'scheduled',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `analytics_daily_revenue` (
                                                         `report_date` DATE NOT NULL,
                                                         `total_revenue` DECIMAL(15,2) NULL,
    `total_order` INT NULL,
    `item_sold` INT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`report_date`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Tạo các bảng phụ thuộc cấp 1
-- ----------------------------

CREATE TABLE IF NOT EXISTS `user_sessions` (
                                               `id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `refresh_token` VARCHAR(50) NULL,
    `refresh_exp_at` TIMESTAMP NULL,
    `access_exp_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `user_addresses` (
                                                `id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `address_name` VARCHAR(100) NULL, -- Tên gợi nhớ (ví dụ: "Nhà", "Công ty")
    `full_name` VARCHAR(100) NOT NULL, -- Tên người nhận
    `phone` VARCHAR(15) NOT NULL,
    `street_address` VARCHAR(255) NOT NULL, -- Địa chỉ cụ thể (số nhà, tên đường)
    `ward` VARCHAR(100) NULL, -- Phường / Xã
    `district` VARCHAR(100) NOT NULL, -- Quận / Huyện
    `city` VARCHAR(100) NOT NULL, -- Tỉnh / Thành phố
    `is_default` BOOLEAN NOT NULL DEFAULT FALSE, -- Đánh dấu địa chỉ mặc định
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `products` (
                                          `id` CHAR(36) NOT NULL,
    `category_id` CHAR(36) NULL,
    `name` VARCHAR(150) NOT NULL,
    `content` TEXT NULL,
    `sku_prefix` VARCHAR(20) NOT NULL,
    `publish_status` ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
    `activity_status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `vouchers` (
                                          `id` CHAR(36) NOT NULL,
    `promotion_id` CHAR(36) NULL,
    `code` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `type` VARCHAR(50) NULL,
    `value` DECIMAL(15,2) NULL,
    `max_discount_amount` DECIMAL(15,2) NULL,
    `min_order_value` DECIMAL(15,2) NULL,
    `usage_limit_total` INT NULL,
    `usage_limit_per_user` INT NULL,
    `start_date` TIMESTAMP NULL,
    `end_date` TIMESTAMP NULL,
    `status` ENUM('active', 'inactive', 'expired', 'used_up') NOT NULL DEFAULT 'active',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `idx_code` (`code`),
    FOREIGN KEY (`promotion_id`) REFERENCES `promotions` (`id`) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Tạo các bảng phụ thuộc cấp 2
-- ----------------------------

CREATE TABLE IF NOT EXISTS `product_variants` (
                                                  `id` CHAR(36) NOT NULL,
    `product_id` CHAR(36) NOT NULL,
    `sku` VARCHAR(20) NOT NULL,
    `price` DECIMAL(15,2) NOT NULL,
    `compare_price` DECIMAL(15,2) NULL COMMENT 'Original price for discount comparison',
    `color` VARCHAR(50) NULL,
    `size` VARCHAR(50) NULL,
    `quantity` INT NOT NULL DEFAULT 0,
    `activity_status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `idx_sku` (`sku`),
    FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===== CẬP NHẬT BẢNG 'ORDERS' =====
CREATE TABLE IF NOT EXISTS `orders` (
                                        `id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `voucher_id` CHAR(36) NULL,
    `order_code` VARCHAR(250) NULL,
    `status` ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded') NOT NULL DEFAULT 'pending',
    `subtotal_amount` DECIMAL(15,2) NULL,
    `discount_amount` DECIMAL(15,2) NULL,
    `shipping_fee` DECIMAL(15, 2) NULL,
    `total_amount` DECIMAL(15,2) NOT NULL,
    `payment_method` VARCHAR(50) NULL,
    `shipping_full_name` VARCHAR(100) NULL, -- THÊM MỚI: Tên người nhận
    `shipping_address` VARCHAR(250) NULL,
    `phone` VARCHAR(15) NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`voucher_id`) REFERENCES `vouchers` (`id`) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- ===================================

-- ----------------------------
-- Bảng Carts và Cart Items
-- ----------------------------

CREATE TABLE IF NOT EXISTS `carts` (
                                       `id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `idx_user_id` (`user_id`), -- Mỗi user chỉ có 1 giỏ hàng
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `cart_items` (
                                            `id` CHAR(36) NOT NULL,
    `cart_id` CHAR(36) NOT NULL,
    `product_variant_id` CHAR(36) NOT NULL, -- Đây là link tới SKU
    `quantity` INT NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE,
    UNIQUE KEY `idx_cart_variant` (`cart_id`, `product_variant_id`) -- Đảm bảo 1 sản phẩm chỉ có 1 dòng trong giỏ
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ----------------------------
-- Tạo các bảng phụ thuộc cấp 3
-- ----------------------------

CREATE TABLE IF NOT EXISTS `images` (
                                        `id` CHAR(36) NOT NULL,
    `product_variant_id` CHAR(36) NOT NULL,
    `img_name` VARCHAR(250) NULL,
    `img_url` VARCHAR(250) NULL,
    `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    `file_name` VARCHAR(150) NULL,
    `file_size` INT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `orders_items` (
                                              `id` CHAR(36) NOT NULL,
    `order_id` CHAR(36) NOT NULL,
    `product_variant_id` CHAR(36) NOT NULL,
    `quantity` INT NOT NULL,
    `price_at_purchase` DECIMAL(15,2) NOT NULL, -- Lưu lại giá tại thời điểm mua
    `product_name` VARCHAR(150) NULL, -- (Tùy chọn) Lưu lại tên
    `product_sku` VARCHAR(20) NULL, -- (Tùy chọn) Lưu lại SKU
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL -- SET NULL để nếu sản phẩm bị xóa thì vẫn giữ lại lịch sử đơn hàng
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `feedbacks` (
                                           `id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `product_variant_id` CHAR(36) NOT NULL,
    `order_id` CHAR(36) NOT NULL,
    `comment` TEXT NULL,
    `rating` TINYINT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `voucher_usages` (
                                                `id` CHAR(36) NOT NULL,
    `voucher_id` CHAR(36) NOT NULL,
    `user_id` CHAR(36) NOT NULL,
    `order_id` CHAR(36) NOT NULL,
    `used_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`voucher_id`) REFERENCES `vouchers` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;