erDiagram
    users {
        VARCHAR id PK
        VARCHAR name
        VARCHAR email
        VARCHAR password
        VARCHAR salt
        ENUM role
        VARCHAR phone_number
        TIMESTAMP created_at
        TIMESTAMP updated_at
    } 

    user_sessions {
        VARCHAR id PK
        VARCHAR user_id FK
        VARCHAR refresh_token
        TIMESTAMP refresh_exp_at
        TIMESTAMP access_exp_at
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    products {
        VARCHAR id PK
        VARCHAR category_id FK
        VARCHAR brand_id FK
        VARCHAR name
        JSON contents
        VARCHAR video_url
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    brands { 
        VARCHAR id PK
        VARCHAR name
        VARCHAR image_url
    }

    categories {
        VARCHAR id PK
        VARCHAR name
        VARCHAR image_id FK
    }

    product_variants {
        VARCHAR id PK
        VARCHAR product_id FK
        VARCHAR image_id FK
        VARCHAR color
        VARCHAR size
        DECIMAL price
        VARCHAR sku
        INT quantity
    }

    images {
        VARCHAR id PK
        VARCHAR title
        VARCHAR file_name
        VARCHAR file_url
    }

    product_reviews {
        VARCHAR id PK
        VARCHAR customer_id FK
        VARCHAR product_id FK
        INT rating
        VARCHAR comment
    }

    orders {
        VARCHAR id PK
        VARCHAR customer_id FK
        VARCHAR shipping_address_id FK 
        ENUM status
        DECIMAL total
        VARCHAR discount_id FK
    }

    orders_items {
        VARCHAR id PK
        VARCHAR order_id FK
        VARCHAR variant_id FK
        INT quantity
        DECIMAL price
        DECIMAL sub_total
    }

    addresses {
        VARCHAR id PK
        VARCHAR customer_id FK
        VARCHAR full_name
        VARCHAR phone
        VARCHAR province
    }

    discounts {
        VARCHAR id PK
        VARCHAR code
        ENUM type
        DECIMAL value
        JSON condition
        TIMESTAMP start_date
        TIMESTAMP end_date
        TIMESTAMP created_at
        TIMESTAMP updated_at
    } 

    user_sessions }o--|| users : user_id
    addresses }o--|| users : customer_id         
    orders }o--|| users : customer_id             
    product_reviews }o--|| users : customer_id     

    products }o--|| categories : category_id
    products }o--|| brands : brand_id             
    product_variants }o--|| products : product_id
    product_reviews }o--|| products : product_id

    %% Liên kết đến Orders
    orders }o--|| discounts : discount_id
    orders }o--|| addresses : shipping_address_id   
    orders_items }o--|| orders : order_id
    orders_items }o--|| product_variants : variant_id   

    %% Liên kết đến Images
    categories }o--|| images : image_id
    product_variants }o--|| images : image_id