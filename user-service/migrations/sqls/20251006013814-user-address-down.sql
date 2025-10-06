ALTER TABLE IF EXISTS "address" DROP CONSTRAINT IF EXISTS "address_user_id_fkey";

DROP TABLE IF EXISTS "address";
-- DROP INDEX IF EXISTS address_city_idx;
-- DROP INDEX IF EXISTS address_post_code_idx;
-- DROP INDEX IF EXISTS address_country_idx;