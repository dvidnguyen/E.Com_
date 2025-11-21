# PROJECT RULES & TASKS: E-COMMERCE CLIENT FRONTEND

## 1. CONTEXT & SCOPE
- **Role**: Senior Frontend Engineer.
- **Project**: E-commerce Client App (B2C).
- **Current State**: Database Schema is fixed (SQL provided), Admin Backend is implemented.
- **Goal**: Build the Client-facing application ensuring strict adherence to the Database Schema logic.

## 2. TECH STACK CONSTRAINTS
- **Core**: React 18+, Vite, TypeScript.
- **Styling**: Tailwind CSS, shadcn/ui.
- **State Management**: Redux Toolkit (Global State), React Query (Server State - optional but recommended).
- **Routing**: React Router DOM v6+.
- **Forms**: React Hook Form + Zod (Validation).
- **Icons**: Lucide React.
- **HTTP Client**: Axios (with Interceptors for JWT).

## 3. DATABASE-DRIVEN FRONTEND RULES (CRITICAL)
*Dựa trên cấu trúc SQL đã cung cấp, Frontend phải tuân thủ các logic sau:*

### A. Quy tắc về Định danh & Dữ liệu (IDs & Data Types)
1.  **UUID/CHAR(36)**: Toàn bộ ID (`user_id`, `product_id`, `order_id`...) là chuỗi UUID (CHAR 36). Không được parse sang Number.
2.  **Money**: Tiền tệ (`decimal`) phải được format chuẩn VND (ví dụ: `100.000 ₫`) ở phía hiển thị, nhưng gửi lên API dưới dạng Number hoặc String (tùy Backend yêu cầu).
3.  **Images**: Ảnh nằm trong bảng `images` và liên kết với `product_variant_id`.
    - *Logic*: Khi người dùng chọn Màu/Size (Variant) -> Gallery ảnh phải filter và đổi theo Variant đó.

### B. Quy tắc về Sản phẩm & Biến thể (Product & Variants)
1.  **Strict Variant Selection**: Bảng `cart_items` liên kết với `product_variant_id`, KHÔNG PHẢI `product_id`.
    - *Hệ quả UI*: Nút "Thêm vào giỏ" **phải bị disable** cho đến khi người dùng chọn đầy đủ thuộc tính (Màu/Size) để xác định được một `variant_id` cụ thể.
2.  **Hierarchy Categories**: Bảng `categories` có `category_id` (Self-referencing).
    - *Hệ quả UI*: Menu danh mục phải xử lý đệ quy (Recursive Menu) hoặc Dropdown đa cấp (Parent -> Child).

### C. Quy tắc về Giỏ hàng & Đặt hàng (Cart & Order)
1.  **Cart Merging**: `carts` có `user_id`. Khi Login, phải merge giỏ hàng LocalStorage vào giỏ hàng Database.
2.  **Checkout Logic**:
    - `user_addresses`: Cho phép chọn từ sổ địa chỉ hoặc nhập mới ("Ship to different address").
    - `vouchers`: Input nhập mã phải gọi API check `vouchers` (kiểm tra `code`, `min_order_value`, `usage_limit`).
    - `payment_method`: Nếu chọn 'VietQR', hiển thị QR Code.

### D. Quy tắc về Feedback
1.  **Purchase Verification**: Bảng `feedbacks` yêu cầu `order_id` và `product_variant_id`.
    - *Hệ quả UI*: Người dùng chỉ được đánh giá sản phẩm *trong trang Lịch sử đơn hàng* hoặc *Trang chi tiết sản phẩm* (nhưng phải check xem user đã mua hàng chưa).

---

## 4. TYPESCRIPT INTERFACES (MAPPED FROM DB)

```typescript
// Common Types
type UUID = string;
type ISOString = string; // For TIMESTAMP

// 1. Auth & User
interface User {
  id: UUID;
  email: string;
  user_name: string | null;
  phone: string | null;
  role: 'user' | 'admin';
}

interface UserAddress {
  id: UUID;
  full_name: string;
  phone: string;
  street_address: string;
  ward: string | null;
  district: string;
  city: string;
  is_default: boolean;
}

// 2. Product & Category
interface Category {
  id: UUID;
  category_id: UUID | null; // Parent ID
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  children?: Category[]; // For UI recursive rendering
}

interface Product {
  id: UUID;
  name: string;
  slug: string; // Derived or stored
  content: string;
  sku_prefix: string;
  variants: ProductVariant[]; // Fetched via relation
}

interface ProductVariant {
  id: UUID;
  product_id: UUID;
  sku: string;
  price: number;
  compare_price: number | null;
  color: string | null;
  size: string | null;
  quantity: number;
  images: ProductImage[];
}

interface ProductImage {
  id: UUID;
  img_url: string;
  is_thumbnail?: boolean; // Logic handled by frontend sorting
}

// 3. Cart
interface CartItem {
  id: UUID;
  product_variant_id: UUID;
  quantity: number;
  // Frontend needs to join with Variant info for display
  variant_details?: ProductVariant & { product_name: string };
}

// 4. Order
interface Order {
  id: UUID;
  order_code: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  shipping_address: string;
  items: OrderItem[];
}

interface OrderItem {
  id: UUID;
  product_variant_id: UUID;
  quantity: number;
  price_at_purchase: number;
  product_name: string;
}

5. DETAILED TASK LIST (MODULES)
PHASE 1: CORE & SETUP
[x] Project Init: Vite + React + TS.

[x] Config: Setup axios client (Base URL, Interceptors for Token).

[x] Redux: Setup authSlice, cartSlice, uiSlice.

[x] React Hook Form: Setup form schemas with Zod validation.

[x] UI Lib: Install Tailwind, Shadcn Components (Button, Input, Select, Dialog, Toast).

[ ] Layouts:

MainLayout: Header (Menu, Cart Badge), Footer.

[x] AuthLayout: Center layout for Login/Register.

PHASE 2: AUTHENTICATION (Tables: users, user_addresses)
[x] Register: Form validation (Email, Password match). API: Create User.

[x] Login: Form validation with React Hook Form + Zod. API: Get Token -> Save to LocalStorage + Redux.

[ ] Profile: View/Edit user_name, phone.

[ ] Address Book:

List addresses.

Add/Edit Modal (Validation: Phone number, Required fields).

Set Default Address logic.

PHASE 3: PRODUCT BROWSING (Tables: products, categories, variants, images)
[ ] Home Page: Fetch Featured Products.

[ ] Product List:

Grid layout.

Sidebar Filter: Filter by price range, category_id (recursively).

[ ] Product Detail (COMPLEX):

Fetch Product + Variants + Images.

Selector Logic:

Render list of Colors available.

Render list of Sizes available.

Constraint: When User picks [Color A] + [Size B] -> Find matching variant_id.

Show correct Price/Stock based on selected Variant.

Show Images linked to selected Variant.

Disable "Add to Cart" if Variant is out of stock (quantity: 0).

PHASE 4: CART (Tables: carts, cart_items)
[ ] Add to Cart Action: Post variant_id + quantity to API.

[ ] Cart Drawer/Page:

Display list of items.

Update Quantity (+/-).

Remove Item.

Calculate Subtotal (Frontend calculation for immediate feedback).

PHASE 5: CHECKOUT (Tables: orders, order_items, vouchers)
[ ] Step 1: Address: Select from Address Book OR Form for new address.

[ ] Step 2: Voucher:

Input Code -> API Check (vouchers table).

If valid: Update discount_amount.

[ ] Step 3: Payment:

Option 1: COD.

Option 2: VietQR (Generate QR Image based on total_amount + order_code).

[ ] Step 4: Submit:

Payload: { address, payment_method, voucher_id, items: [...] }.

Redirect to Success Page.

PHASE 6: USER DASHBOARD & FEEDBACK (Tables: orders, feedbacks)
[ ] Order History: List orders with status badges.

[ ] Order Detail: Show items, prices, and shipping info.

[ ] Feedback:

Allow rating (1-5 stars) + comment ONLY if order.status === 'delivered'.

Submit to feedbacks table.