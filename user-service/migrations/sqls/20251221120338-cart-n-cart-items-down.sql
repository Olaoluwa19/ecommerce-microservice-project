ALTER TABLE IF EXISTS "cart_items" DROP CONSTRAINT IF EXISTS "cart_items_cart_id_fkey";
ALTER TABLE IF EXISTS "shopping_carts" DROP CONSTRAINT IF EXISTS "shopping_carts_user_id_fkey";

DROP TABLE IF EXISTS "cart_items";
DROP TABLE IF EXISTS "shopping_carts";