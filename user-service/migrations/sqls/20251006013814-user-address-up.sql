CREATE TABLE IF NOT EXISTS "address" (
    "id" bigserial PRIMARY KEY,
    "user_id" bigint NOT NULL,
    "address_line1" text,
    "address_line2" text,
    "city" varchar,
    "post_code" integer,
    "country" varchar,
    "created_at" timestamp NOT NULL DEFAULT (now())
);

CREATE INDEX IF NOT EXISTS address_city_idx ON "address" ("city");
CREATE INDEX IF NOT EXISTS address_post_code_idx ON "address" ("post_code");
CREATE INDEX IF NOT EXISTS address_country_idx ON "address" ("country");

-- add Relation
ALTER TABLE "address" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("user_id");