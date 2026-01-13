CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phone" text,
	"email" text,
	"name" text,
	"avatar" text,
	"date_of_birth" timestamp,
	"is_kyc_verified" boolean DEFAULT false NOT NULL,
	"is_age_verified" boolean DEFAULT false NOT NULL,
	"preferred_language" text DEFAULT 'en' NOT NULL,
	"cuisine_preferences" text[] DEFAULT '{}' NOT NULL,
	"grocery_brands" text[] DEFAULT '{}' NOT NULL,
	"alcohol_preferences" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_phone_unique" UNIQUE("phone"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"label" text NOT NULL,
	"full_address" text NOT NULL,
	"landmark" text,
	"latitude" real NOT NULL,
	"longitude" real NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vendors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"logo" text,
	"cover_image" text,
	"type" text NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"rating" real DEFAULT 0 NOT NULL,
	"total_ratings" integer DEFAULT 0 NOT NULL,
	"email" text,
	"phone" text,
	"password" text,
	"address" text NOT NULL,
	"latitude" real NOT NULL,
	"longitude" real NOT NULL,
	"delivery_radius" real DEFAULT 5 NOT NULL,
	"opening_time" text NOT NULL,
	"closing_time" text NOT NULL,
	"minimum_order" real DEFAULT 0 NOT NULL,
	"avg_delivery_time" integer DEFAULT 30 NOT NULL,
	"commission_rate" real DEFAULT 15 NOT NULL,
	"license_number" text,
	"license_expiry" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "vendors_email_unique" UNIQUE("email"),
	CONSTRAINT "vendors_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"icon" text,
	"image" text,
	"vendor_id" uuid,
	"parent_id" uuid,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" uuid NOT NULL,
	"category_id" uuid,
	"name" text NOT NULL,
	"description" text,
	"images" text[] DEFAULT '{}' NOT NULL,
	"price" real NOT NULL,
	"discount_price" real,
	"in_stock" boolean DEFAULT true NOT NULL,
	"stock_quantity" integer,
	"is_veg" boolean DEFAULT true NOT NULL,
	"is_vegan" boolean DEFAULT false NOT NULL,
	"calories" integer,
	"allergens" text[] DEFAULT '{}' NOT NULL,
	"pack_size" text,
	"brand" text,
	"diet_type" text,
	"abv_percent" real,
	"taste_profile" text,
	"country_of_origin" text,
	"year" integer,
	"grape_type" text,
	"pairings" text[] DEFAULT '{}' NOT NULL,
	"customizations" jsonb,
	"rating" real DEFAULT 0 NOT NULL,
	"total_ratings" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "riders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phone" text NOT NULL,
	"email" text,
	"name" text NOT NULL,
	"avatar" text,
	"document_verified" boolean DEFAULT false NOT NULL,
	"police_verified" boolean DEFAULT false NOT NULL,
	"alcohol_authorized" boolean DEFAULT false NOT NULL,
	"vehicle_type" text NOT NULL,
	"vehicle_number" text,
	"is_online" boolean DEFAULT false NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	"current_lat" real,
	"current_lng" real,
	"rating" real DEFAULT 5 NOT NULL,
	"total_deliveries" integer DEFAULT 0 NOT NULL,
	"total_earnings" real DEFAULT 0 NOT NULL,
	"assigned_zone" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "riders_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE "rider_earnings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rider_id" uuid NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"base_earning" real NOT NULL,
	"tip" real DEFAULT 0 NOT NULL,
	"incentive" real DEFAULT 0 NOT NULL,
	"penalty" real DEFAULT 0 NOT NULL,
	"total" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rider_shifts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rider_id" uuid NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp,
	"zone" text
);
--> statement-breakpoint
CREATE TABLE "payment_methods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" text NOT NULL,
	"details" jsonb NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wallets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"balance" real DEFAULT 0 NOT NULL,
	CONSTRAINT "wallets_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "wallet_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wallet_id" uuid NOT NULL,
	"amount" real NOT NULL,
	"type" text NOT NULL,
	"description" text,
	"order_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "loyalty_points" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	"lifetime_points" integer DEFAULT 0 NOT NULL,
	"tier" text DEFAULT 'BRONZE' NOT NULL,
	CONSTRAINT "loyalty_points_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "points_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"loyalty_points_id" uuid NOT NULL,
	"points" integer NOT NULL,
	"type" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"plan" text NOT NULL,
	"start_date" timestamp DEFAULT now() NOT NULL,
	"end_date" timestamp NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "subscriptions_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_number" text NOT NULL,
	"user_id" uuid NOT NULL,
	"vendor_id" uuid NOT NULL,
	"address_id" uuid,
	"rider_id" uuid,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"type" text DEFAULT 'DELIVERY' NOT NULL,
	"subtotal" real NOT NULL,
	"delivery_fee" real DEFAULT 0 NOT NULL,
	"platform_fee" real DEFAULT 0 NOT NULL,
	"discount" real DEFAULT 0 NOT NULL,
	"tip" real DEFAULT 0 NOT NULL,
	"total" real NOT NULL,
	"scheduled_for" timestamp,
	"estimated_delivery" timestamp,
	"delivered_at" timestamp,
	"delivery_instructions" text,
	"payment_method" text NOT NULL,
	"payment_status" text DEFAULT 'PENDING' NOT NULL,
	"party_event_id" text,
	"current_lat" real,
	"current_lng" real,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"price" real NOT NULL,
	"customizations" jsonb,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "cart_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"customizations" jsonb,
	"notes" text,
	"party_event_id" text,
	"added_by_user_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_status_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"status" text NOT NULL,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "genie_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_number" text NOT NULL,
	"user_id" text NOT NULL,
	"rider_id" uuid,
	"type" text NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"estimated_price" real NOT NULL,
	"final_price" real,
	"distance" real NOT NULL,
	"weight" real,
	"payment_method" text NOT NULL,
	"payment_status" text DEFAULT 'PENDING' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "genie_orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE "genie_stops" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"genie_order_id" uuid NOT NULL,
	"stop_number" integer NOT NULL,
	"address" text NOT NULL,
	"latitude" real NOT NULL,
	"longitude" real NOT NULL,
	"contact_name" text,
	"contact_phone" text,
	"instructions" text,
	"type" text NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "party_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"host_user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"scheduled_for" timestamp NOT NULL,
	"status" text DEFAULT 'PLANNING' NOT NULL,
	"split_type" text DEFAULT 'EQUAL' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "party_participants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"party_event_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"share_amount" real,
	"has_paid" boolean DEFAULT false NOT NULL,
	CONSTRAINT "party_participants_party_event_id_user_id_unique" UNIQUE("party_event_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"vendor_id" uuid,
	"product_id" uuid,
	"rating" integer NOT NULL,
	"comment" text,
	"images" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "promotions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" uuid,
	"code" text NOT NULL,
	"description" text NOT NULL,
	"discount_type" text NOT NULL,
	"discount_value" real NOT NULL,
	"min_order_value" real DEFAULT 0 NOT NULL,
	"max_discount" real,
	"usage_limit" integer,
	"used_count" integer DEFAULT 0 NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "promotions_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "sponsored_listings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" uuid NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"budget" real NOT NULL,
	"spent" real DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "support_tickets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"order_id" uuid,
	"type" text NOT NULL,
	"subject" text NOT NULL,
	"description" text NOT NULL,
	"status" text DEFAULT 'OPEN' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ticket_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ticket_id" uuid NOT NULL,
	"message" text NOT NULL,
	"is_from_user" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"type" text NOT NULL,
	"data" jsonb,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "search_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"query" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "referrals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"referrer_id" uuid NOT NULL,
	"referred_id" uuid NOT NULL,
	"referral_code" text NOT NULL,
	"reward_given" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "referrals_referred_id_unique" UNIQUE("referred_id")
);
--> statement-breakpoint
CREATE TABLE "admins" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"name" text NOT NULL,
	"role" text DEFAULT 'SUPPORT' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admins_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_id" uuid NOT NULL,
	"action" text NOT NULL,
	"entity" text NOT NULL,
	"entity_id" text,
	"details" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "system_configs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "system_configs_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "zones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"polygon" jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"surge_pricing" real DEFAULT 1 NOT NULL,
	"delivery_fee" real DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "outlets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" uuid NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"address" text NOT NULL,
	"latitude" real NOT NULL,
	"longitude" real NOT NULL,
	"phone" text,
	"email" text,
	"timezone" text DEFAULT 'Asia/Kolkata' NOT NULL,
	"currency" text DEFAULT 'INR' NOT NULL,
	"opening_time" text NOT NULL,
	"closing_time" text NOT NULL,
	"is_open" boolean DEFAULT true NOT NULL,
	"tax_rate" real DEFAULT 5 NOT NULL,
	"service_charge_rate" real DEFAULT 0 NOT NULL,
	"settings" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "outlets_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "floors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"outlet_id" uuid NOT NULL,
	"name" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "table_zones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"floor_id" uuid NOT NULL,
	"name" text NOT NULL,
	"color" text DEFAULT '#f97316' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tables" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"outlet_id" uuid NOT NULL,
	"floor_id" uuid,
	"zone_id" uuid,
	"table_number" text NOT NULL,
	"capacity" integer DEFAULT 4 NOT NULL,
	"min_capacity" integer DEFAULT 1 NOT NULL,
	"shape" text DEFAULT 'RECTANGLE' NOT NULL,
	"position_x" real DEFAULT 0 NOT NULL,
	"position_y" real DEFAULT 0 NOT NULL,
	"width" real DEFAULT 100 NOT NULL,
	"height" real DEFAULT 100 NOT NULL,
	"rotation" real DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'AVAILABLE' NOT NULL,
	"current_order_id" text,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "tables_outlet_id_table_number_unique" UNIQUE("outlet_id","table_number")
);
--> statement-breakpoint
CREATE TABLE "table_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"table_id" uuid NOT NULL,
	"start_time" timestamp DEFAULT now() NOT NULL,
	"end_time" timestamp,
	"guest_count" integer NOT NULL,
	"server_employee_id" text
);
--> statement-breakpoint
CREATE TABLE "reservations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"outlet_id" uuid NOT NULL,
	"table_id" uuid,
	"customer_id" text,
	"guest_name" text NOT NULL,
	"guest_phone" text NOT NULL,
	"guest_email" text,
	"guest_count" integer NOT NULL,
	"date" timestamp NOT NULL,
	"time_slot" text NOT NULL,
	"duration" integer DEFAULT 90 NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"special_requests" text,
	"occasion" text,
	"deposit_amount" real,
	"deposit_paid" boolean DEFAULT false NOT NULL,
	"minimum_spend" real,
	"confirmation_code" text NOT NULL,
	"confirmed_at" timestamp,
	"cancelled_at" timestamp,
	"cancel_reason" text,
	"source" text DEFAULT 'PHONE' NOT NULL,
	"external_ref" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "reservations_confirmation_code_unique" UNIQUE("confirmation_code")
);
--> statement-breakpoint
CREATE TABLE "waitlists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"outlet_id" text NOT NULL,
	"guest_name" text NOT NULL,
	"guest_phone" text NOT NULL,
	"guest_count" integer NOT NULL,
	"estimated_wait" integer NOT NULL,
	"quoted_wait" integer,
	"status" text DEFAULT 'WAITING' NOT NULL,
	"notes" text,
	"notified_at" timestamp,
	"seated_at" timestamp,
	"left_at" timestamp,
	"table_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dine_in_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_number" text NOT NULL,
	"outlet_id" uuid NOT NULL,
	"table_id" uuid NOT NULL,
	"table_session_id" uuid,
	"server_employee_id" text,
	"created_by_employee_id" text NOT NULL,
	"guest_count" integer DEFAULT 1 NOT NULL,
	"guest_profile_id" text,
	"order_type" text DEFAULT 'DINE_IN' NOT NULL,
	"status" text DEFAULT 'OPEN' NOT NULL,
	"subtotal" real DEFAULT 0 NOT NULL,
	"tax_amount" real DEFAULT 0 NOT NULL,
	"service_charge" real DEFAULT 0 NOT NULL,
	"discount" real DEFAULT 0 NOT NULL,
	"tip" real DEFAULT 0 NOT NULL,
	"total" real DEFAULT 0 NOT NULL,
	"payment_status" text DEFAULT 'PENDING' NOT NULL,
	"opened_at" timestamp DEFAULT now() NOT NULL,
	"closed_at" timestamp,
	"printed_at" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "dine_in_orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE "dine_in_order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"menu_item_id" text NOT NULL,
	"name" text NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"unit_price" real NOT NULL,
	"total_price" real NOT NULL,
	"seat_number" integer,
	"course_number" integer DEFAULT 1 NOT NULL,
	"course_type" text DEFAULT 'MAIN' NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"sent_to_kitchen_at" timestamp,
	"prepared_at" timestamp,
	"served_at" timestamp,
	"modifiers" jsonb,
	"special_instructions" text,
	"is_void" boolean DEFAULT false NOT NULL,
	"void_reason" text,
	"void_by_employee_id" text,
	"is_comp" boolean DEFAULT false NOT NULL,
	"comp_reason" text,
	"comp_by_employee_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "course_fires" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"course_number" integer NOT NULL,
	"fired_at" timestamp DEFAULT now() NOT NULL,
	"fired_by_employee_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "split_bills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"split_number" integer NOT NULL,
	"split_type" text DEFAULT 'EQUAL' NOT NULL,
	"subtotal" real DEFAULT 0 NOT NULL,
	"tax_amount" real DEFAULT 0 NOT NULL,
	"service_charge" real DEFAULT 0 NOT NULL,
	"tip" real DEFAULT 0 NOT NULL,
	"total" real DEFAULT 0 NOT NULL,
	"is_paid" boolean DEFAULT false NOT NULL,
	"paid_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "split_bill_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"split_bill_id" uuid NOT NULL,
	"order_item_id" text NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"amount" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dine_in_payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"split_bill_id" uuid,
	"method" text NOT NULL,
	"amount" real NOT NULL,
	"tip_amount" real DEFAULT 0 NOT NULL,
	"card_last_four" text,
	"card_type" text,
	"transaction_id" text,
	"auth_code" text,
	"status" text DEFAULT 'COMPLETED' NOT NULL,
	"processed_by_employee_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "applied_discounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"discount_id" text,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"value" real NOT NULL,
	"amount" real NOT NULL,
	"requires_approval" boolean DEFAULT false NOT NULL,
	"approved_by_employee_id" text,
	"approval_pin" text,
	"reason" text,
	"applied_by_employee_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pos_terminals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"outlet_id" uuid NOT NULL,
	"name" text NOT NULL,
	"device_id" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_active_at" timestamp,
	CONSTRAINT "pos_terminals_device_id_unique" UNIQUE("device_id")
);
--> statement-breakpoint
CREATE TABLE "shifts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"outlet_id" uuid NOT NULL,
	"terminal_id" uuid,
	"employee_id" text NOT NULL,
	"start_time" timestamp DEFAULT now() NOT NULL,
	"end_time" timestamp,
	"opening_float" real DEFAULT 0 NOT NULL,
	"closing_float" real,
	"expected_cash" real,
	"actual_cash" real,
	"variance" real,
	"total_sales" real DEFAULT 0 NOT NULL,
	"total_tax" real DEFAULT 0 NOT NULL,
	"total_discount" real DEFAULT 0 NOT NULL,
	"total_tips" real DEFAULT 0 NOT NULL,
	"cash_sales" real DEFAULT 0 NOT NULL,
	"card_sales" real DEFAULT 0 NOT NULL,
	"other_sales" real DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'OPEN' NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "cash_drops" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shift_id" uuid NOT NULL,
	"amount" real NOT NULL,
	"reason" text,
	"dropped_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kds_stations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"outlet_id" uuid NOT NULL,
	"name" text NOT NULL,
	"station_type" text NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"default_prep_time" integer DEFAULT 15 NOT NULL,
	"alert_threshold" integer DEFAULT 10 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kds_routing_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"station_id" uuid NOT NULL,
	"category_id" text,
	"menu_item_id" text
);
--> statement-breakpoint
CREATE TABLE "kds_tickets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"station_id" uuid NOT NULL,
	"order_number" text NOT NULL,
	"table_number" text,
	"order_type" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"acknowledged_at" timestamp,
	"started_at" timestamp,
	"completed_at" timestamp,
	"status" text DEFAULT 'NEW' NOT NULL,
	"priority" integer DEFAULT 0 NOT NULL,
	"is_rush" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kds_ticket_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ticket_id" uuid NOT NULL,
	"order_item_id" text,
	"name" text NOT NULL,
	"quantity" integer NOT NULL,
	"modifiers" text,
	"special_instructions" text,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "menu_sets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"start_time" text,
	"end_time" text,
	"days_of_week" integer[],
	"valid_from" timestamp,
	"valid_to" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "outlet_menu_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"outlet_id" uuid NOT NULL,
	"menu_set_id" uuid NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "outlet_menu_assignments_outlet_id_menu_set_id_unique" UNIQUE("outlet_id","menu_set_id")
);
--> statement-breakpoint
CREATE TABLE "menu_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"menu_set_id" uuid NOT NULL,
	"parent_id" uuid,
	"name" text NOT NULL,
	"description" text,
	"image" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "menu_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid NOT NULL,
	"sku" text,
	"name" text NOT NULL,
	"description" text,
	"short_name" text,
	"image" text,
	"price" real NOT NULL,
	"cost" real,
	"recipe_id" text,
	"is_veg" boolean DEFAULT true NOT NULL,
	"is_vegan" boolean DEFAULT false NOT NULL,
	"is_gluten_free" boolean DEFAULT false NOT NULL,
	"spice_level" integer,
	"calories" integer,
	"prep_time" integer,
	"allergens" text[] DEFAULT '{}' NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "modifier_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" text NOT NULL,
	"name" text NOT NULL,
	"min_selections" integer DEFAULT 0 NOT NULL,
	"max_selections" integer DEFAULT 1 NOT NULL,
	"is_required" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "modifiers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"group_id" uuid NOT NULL,
	"name" text NOT NULL,
	"price" real DEFAULT 0 NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "menu_item_modifier_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"menu_item_id" uuid NOT NULL,
	"modifier_group_id" uuid NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "menu_item_modifier_groups_menu_item_id_modifier_group_id_unique" UNIQUE("menu_item_id","modifier_group_id")
);
--> statement-breakpoint
CREATE TABLE "recipes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"yield_quantity" real DEFAULT 1 NOT NULL,
	"yield_unit" text DEFAULT 'portion' NOT NULL,
	"prep_time" integer,
	"cook_time" integer,
	"instructions" jsonb,
	"calories" integer,
	"protein" real,
	"carbs" real,
	"fat" real,
	"total_cost" real,
	"cost_per_serving" real,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipe_ingredients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recipe_id" uuid NOT NULL,
	"inventory_item_id" text NOT NULL,
	"quantity" real NOT NULL,
	"unit" text NOT NULL,
	"wastage_percent" real DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipe_sub_recipes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_recipe_id" uuid NOT NULL,
	"sub_recipe_id" uuid NOT NULL,
	"quantity" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" text NOT NULL,
	"outlet_id" uuid,
	"sku" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"barcode" text,
	"category_id" uuid,
	"unit_of_measure" text NOT NULL,
	"conversion_factor" real DEFAULT 1 NOT NULL,
	"current_stock" real DEFAULT 0 NOT NULL,
	"par_level" real,
	"reorder_point" real,
	"reorder_quantity" real,
	"safety_stock" real,
	"average_cost" real DEFAULT 0 NOT NULL,
	"last_cost" real,
	"storage_location" text,
	"storage_temp" text,
	"track_batch" boolean DEFAULT false NOT NULL,
	"track_expiry" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "inventory_items_vendor_id_sku_unique" UNIQUE("vendor_id","sku")
);
--> statement-breakpoint
CREATE TABLE "inventory_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" text NOT NULL,
	"name" text NOT NULL,
	"parent_id" uuid
);
--> statement-breakpoint
CREATE TABLE "stock_batches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"inventory_item_id" uuid NOT NULL,
	"batch_number" text NOT NULL,
	"quantity" real NOT NULL,
	"received_date" timestamp DEFAULT now() NOT NULL,
	"expiry_date" timestamp,
	"unit_cost" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stock_movements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"inventory_item_id" uuid NOT NULL,
	"type" text NOT NULL,
	"quantity" real NOT NULL,
	"reference_type" text,
	"reference_id" text,
	"unit_cost" real,
	"total_cost" real,
	"performed_by_employee_id" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "suppliers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" text NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"contact_name" text,
	"email" text,
	"phone" text,
	"address" text,
	"payment_terms" integer,
	"lead_time" integer,
	"minimum_order" real,
	"rating" real DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "suppliers_vendor_id_code_unique" UNIQUE("vendor_id","code")
);
--> statement-breakpoint
CREATE TABLE "supplier_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"supplier_id" uuid NOT NULL,
	"inventory_item_id" text NOT NULL,
	"supplier_sku" text,
	"unit_price" real NOT NULL,
	"min_order_qty" real DEFAULT 1 NOT NULL,
	"lead_time" integer,
	"is_preferred" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "purchase_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"po_number" text NOT NULL,
	"vendor_id" text NOT NULL,
	"outlet_id" uuid NOT NULL,
	"supplier_id" uuid NOT NULL,
	"status" text DEFAULT 'DRAFT' NOT NULL,
	"order_date" timestamp DEFAULT now() NOT NULL,
	"expected_date" timestamp,
	"received_date" timestamp,
	"subtotal" real DEFAULT 0 NOT NULL,
	"tax_amount" real DEFAULT 0 NOT NULL,
	"total" real DEFAULT 0 NOT NULL,
	"approved_by_employee_id" text,
	"approved_at" timestamp,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "purchase_orders_po_number_unique" UNIQUE("po_number")
);
--> statement-breakpoint
CREATE TABLE "purchase_order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"purchase_order_id" uuid NOT NULL,
	"inventory_item_id" text NOT NULL,
	"quantity" real NOT NULL,
	"unit_price" real NOT NULL,
	"tax_rate" real DEFAULT 0 NOT NULL,
	"total" real NOT NULL,
	"received_qty" real DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "goods_receipts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"grn_number" text NOT NULL,
	"purchase_order_id" uuid NOT NULL,
	"received_date" timestamp DEFAULT now() NOT NULL,
	"received_by_employee_id" text NOT NULL,
	"notes" text,
	CONSTRAINT "goods_receipts_grn_number_unique" UNIQUE("grn_number")
);
--> statement-breakpoint
CREATE TABLE "goods_receipt_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"goods_receipt_id" uuid NOT NULL,
	"purchase_order_item_id" uuid NOT NULL,
	"quantity_received" real NOT NULL,
	"batch_number" text,
	"expiry_date" timestamp
);
--> statement-breakpoint
CREATE TABLE "supplier_invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_number" text NOT NULL,
	"purchase_order_id" uuid NOT NULL,
	"invoice_date" timestamp NOT NULL,
	"due_date" timestamp,
	"subtotal" real NOT NULL,
	"tax_amount" real NOT NULL,
	"total" real NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"paid_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "stock_counts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"outlet_id" uuid NOT NULL,
	"count_number" text NOT NULL,
	"type" text DEFAULT 'FULL' NOT NULL,
	"status" text DEFAULT 'IN_PROGRESS' NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"started_by_employee_id" text NOT NULL,
	"notes" text,
	CONSTRAINT "stock_counts_count_number_unique" UNIQUE("count_number")
);
--> statement-breakpoint
CREATE TABLE "stock_count_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"stock_count_id" uuid NOT NULL,
	"inventory_item_id" text NOT NULL,
	"system_qty" real NOT NULL,
	"counted_qty" real,
	"variance" real,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "stock_transfers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"transfer_number" text NOT NULL,
	"from_outlet_id" text NOT NULL,
	"to_outlet_id" text NOT NULL,
	"status" text DEFAULT 'DRAFT' NOT NULL,
	"requested_at" timestamp DEFAULT now() NOT NULL,
	"shipped_at" timestamp,
	"received_at" timestamp,
	"requested_by_employee_id" text NOT NULL,
	"notes" text,
	CONSTRAINT "stock_transfers_transfer_number_unique" UNIQUE("transfer_number")
);
--> statement-breakpoint
CREATE TABLE "stock_transfer_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"transfer_id" uuid NOT NULL,
	"inventory_item_id" text NOT NULL,
	"requested_qty" real NOT NULL,
	"shipped_qty" real,
	"received_qty" real
);
--> statement-breakpoint
CREATE TABLE "waste_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" text NOT NULL,
	"outlet_id" text NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL,
	"logged_by_employee_id" text NOT NULL,
	"total_value" real DEFAULT 0 NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "waste_log_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"waste_log_id" uuid NOT NULL,
	"inventory_item_id" text,
	"menu_item_id" text,
	"item_name" text NOT NULL,
	"quantity" real NOT NULL,
	"unit" text NOT NULL,
	"reason" text NOT NULL,
	"value" real NOT NULL,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "employees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" text NOT NULL,
	"outlet_id" uuid,
	"employee_code" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text,
	"phone" text NOT NULL,
	"avatar" text,
	"role" text NOT NULL,
	"department" text,
	"hire_date" timestamp DEFAULT now() NOT NULL,
	"termination_date" timestamp,
	"pin" text,
	"password_hash" text,
	"permissions" text[] DEFAULT '{}' NOT NULL,
	"hourly_rate" real,
	"salary" real,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "employees_vendor_id_employee_code_unique" UNIQUE("vendor_id","employee_code")
);
--> statement-breakpoint
CREATE TABLE "employee_schedules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employee_id" uuid NOT NULL,
	"outlet_id" text NOT NULL,
	"date" timestamp NOT NULL,
	"start_time" text NOT NULL,
	"end_time" text NOT NULL,
	"role" text,
	"notes" text,
	"status" text DEFAULT 'SCHEDULED' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "time_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"employee_id" uuid NOT NULL,
	"outlet_id" text NOT NULL,
	"clock_in" timestamp NOT NULL,
	"clock_out" timestamp,
	"break_start" timestamp,
	"break_end" timestamp,
	"regular_hours" real,
	"overtime_hours" real,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"approved_by_employee_id" text,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "tip_pools" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" text NOT NULL,
	"outlet_id" text NOT NULL,
	"date" timestamp NOT NULL,
	"shift_type" text,
	"total_tips" real NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"distributed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "tip_allocations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tip_pool_id" uuid NOT NULL,
	"employee_id" text NOT NULL,
	"share_percent" real,
	"amount" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guest_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text,
	"email" text,
	"phone" text,
	"dietary_restrictions" text[] DEFAULT '{}' NOT NULL,
	"allergies" text[] DEFAULT '{}' NOT NULL,
	"preferences" text,
	"birthday" timestamp,
	"anniversary" timestamp,
	"total_visits" integer DEFAULT 0 NOT NULL,
	"total_spend" real DEFAULT 0 NOT NULL,
	"average_spend" real DEFAULT 0 NOT NULL,
	"last_visit" timestamp,
	"loyalty_tier" text,
	"loyalty_points" integer DEFAULT 0 NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"vip_status" boolean DEFAULT false NOT NULL,
	"notes" text,
	"marketing_consent" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guest_feedbacks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guest_profile_id" uuid,
	"outlet_id" text NOT NULL,
	"order_id" text,
	"overall_rating" integer NOT NULL,
	"food_rating" integer,
	"service_rating" integer,
	"ambience_rating" integer,
	"comments" text,
	"responded_at" timestamp,
	"response" text,
	"responded_by_employee_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "loyalty_programs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" text NOT NULL,
	"name" text NOT NULL,
	"points_per_currency" real DEFAULT 1 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "loyalty_program_tiers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"program_id" uuid NOT NULL,
	"name" text NOT NULL,
	"min_points" integer NOT NULL,
	"multiplier" real DEFAULT 1 NOT NULL,
	"benefits" text[] DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "loyalty_rewards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"program_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"points_cost" integer NOT NULL,
	"reward_type" text NOT NULL,
	"reward_value" real NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gift_cards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" text NOT NULL,
	"card_number" text NOT NULL,
	"pin" text,
	"initial_value" real NOT NULL,
	"current_balance" real NOT NULL,
	"purchased_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp,
	"purchaser_name" text,
	"purchaser_email" text,
	"recipient_name" text,
	"recipient_email" text,
	"message" text,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "gift_cards_card_number_unique" UNIQUE("card_number")
);
--> statement-breakpoint
CREATE TABLE "gift_card_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"gift_card_id" uuid NOT NULL,
	"type" text NOT NULL,
	"amount" real NOT NULL,
	"balance" real NOT NULL,
	"order_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "campaigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"type" text NOT NULL,
	"channel" text NOT NULL,
	"subject" text,
	"content" text NOT NULL,
	"segment_rules" jsonb,
	"scheduled_at" timestamp,
	"sent_at" timestamp,
	"total_sent" integer DEFAULT 0 NOT NULL,
	"total_opened" integer DEFAULT 0 NOT NULL,
	"total_clicked" integer DEFAULT 0 NOT NULL,
	"total_converted" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'DRAFT' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "printers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"outlet_id" uuid NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"connection_type" text NOT NULL,
	"ip_address" text,
	"port" integer,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daily_sales_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"outlet_id" text NOT NULL,
	"date" timestamp NOT NULL,
	"total_sales" real NOT NULL,
	"total_orders" integer NOT NULL,
	"total_covers" integer NOT NULL,
	"average_check" real NOT NULL,
	"cash_sales" real DEFAULT 0 NOT NULL,
	"card_sales" real DEFAULT 0 NOT NULL,
	"other_sales" real DEFAULT 0 NOT NULL,
	"food_sales" real DEFAULT 0 NOT NULL,
	"beverage_sales" real DEFAULT 0 NOT NULL,
	"alcohol_sales" real DEFAULT 0 NOT NULL,
	"tax_collected" real DEFAULT 0 NOT NULL,
	"discounts_given" real DEFAULT 0 NOT NULL,
	"tips_collected" real DEFAULT 0 NOT NULL,
	"labor_cost" real DEFAULT 0 NOT NULL,
	"food_cost" real DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "daily_sales_reports_outlet_id_date_unique" UNIQUE("outlet_id","date")
);
--> statement-breakpoint
CREATE TABLE "iot_sensors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"outlet_id" text NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"location" text,
	"min_threshold" real,
	"max_threshold" real,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sensor_readings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sensor_id" uuid NOT NULL,
	"value" real NOT NULL,
	"is_alert" boolean DEFAULT false NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rider_earnings" ADD CONSTRAINT "rider_earnings_rider_id_riders_id_fk" FOREIGN KEY ("rider_id") REFERENCES "public"."riders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rider_shifts" ADD CONSTRAINT "rider_shifts_rider_id_riders_id_fk" FOREIGN KEY ("rider_id") REFERENCES "public"."riders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_methods" ADD CONSTRAINT "payment_methods_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wallet_transactions" ADD CONSTRAINT "wallet_transactions_wallet_id_wallets_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."wallets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loyalty_points" ADD CONSTRAINT "loyalty_points_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "points_history" ADD CONSTRAINT "points_history_loyalty_points_id_loyalty_points_id_fk" FOREIGN KEY ("loyalty_points_id") REFERENCES "public"."loyalty_points"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_address_id_addresses_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_rider_id_riders_id_fk" FOREIGN KEY ("rider_id") REFERENCES "public"."riders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_status_history" ADD CONSTRAINT "order_status_history_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "genie_orders" ADD CONSTRAINT "genie_orders_rider_id_riders_id_fk" FOREIGN KEY ("rider_id") REFERENCES "public"."riders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "genie_stops" ADD CONSTRAINT "genie_stops_genie_order_id_genie_orders_id_fk" FOREIGN KEY ("genie_order_id") REFERENCES "public"."genie_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "party_events" ADD CONSTRAINT "party_events_host_user_id_users_id_fk" FOREIGN KEY ("host_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "party_participants" ADD CONSTRAINT "party_participants_party_event_id_party_events_id_fk" FOREIGN KEY ("party_event_id") REFERENCES "public"."party_events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "party_participants" ADD CONSTRAINT "party_participants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promotions" ADD CONSTRAINT "promotions_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsored_listings" ADD CONSTRAINT "sponsored_listings_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_messages" ADD CONSTRAINT "ticket_messages_ticket_id_support_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."support_tickets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "search_history" ADD CONSTRAINT "search_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referrer_id_users_id_fk" FOREIGN KEY ("referrer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referred_id_users_id_fk" FOREIGN KEY ("referred_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_admin_id_admins_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."admins"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outlets" ADD CONSTRAINT "outlets_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "floors" ADD CONSTRAINT "floors_outlet_id_outlets_id_fk" FOREIGN KEY ("outlet_id") REFERENCES "public"."outlets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "table_zones" ADD CONSTRAINT "table_zones_floor_id_floors_id_fk" FOREIGN KEY ("floor_id") REFERENCES "public"."floors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tables" ADD CONSTRAINT "tables_outlet_id_outlets_id_fk" FOREIGN KEY ("outlet_id") REFERENCES "public"."outlets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tables" ADD CONSTRAINT "tables_floor_id_floors_id_fk" FOREIGN KEY ("floor_id") REFERENCES "public"."floors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tables" ADD CONSTRAINT "tables_zone_id_table_zones_id_fk" FOREIGN KEY ("zone_id") REFERENCES "public"."table_zones"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "table_sessions" ADD CONSTRAINT "table_sessions_table_id_tables_id_fk" FOREIGN KEY ("table_id") REFERENCES "public"."tables"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_outlet_id_outlets_id_fk" FOREIGN KEY ("outlet_id") REFERENCES "public"."outlets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_table_id_tables_id_fk" FOREIGN KEY ("table_id") REFERENCES "public"."tables"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dine_in_orders" ADD CONSTRAINT "dine_in_orders_outlet_id_outlets_id_fk" FOREIGN KEY ("outlet_id") REFERENCES "public"."outlets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dine_in_orders" ADD CONSTRAINT "dine_in_orders_table_id_tables_id_fk" FOREIGN KEY ("table_id") REFERENCES "public"."tables"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dine_in_orders" ADD CONSTRAINT "dine_in_orders_table_session_id_table_sessions_id_fk" FOREIGN KEY ("table_session_id") REFERENCES "public"."table_sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dine_in_order_items" ADD CONSTRAINT "dine_in_order_items_order_id_dine_in_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."dine_in_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_fires" ADD CONSTRAINT "course_fires_order_id_dine_in_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."dine_in_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "split_bills" ADD CONSTRAINT "split_bills_order_id_dine_in_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."dine_in_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "split_bill_items" ADD CONSTRAINT "split_bill_items_split_bill_id_split_bills_id_fk" FOREIGN KEY ("split_bill_id") REFERENCES "public"."split_bills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dine_in_payments" ADD CONSTRAINT "dine_in_payments_order_id_dine_in_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."dine_in_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dine_in_payments" ADD CONSTRAINT "dine_in_payments_split_bill_id_split_bills_id_fk" FOREIGN KEY ("split_bill_id") REFERENCES "public"."split_bills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applied_discounts" ADD CONSTRAINT "applied_discounts_order_id_dine_in_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."dine_in_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pos_terminals" ADD CONSTRAINT "pos_terminals_outlet_id_outlets_id_fk" FOREIGN KEY ("outlet_id") REFERENCES "public"."outlets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_outlet_id_outlets_id_fk" FOREIGN KEY ("outlet_id") REFERENCES "public"."outlets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_terminal_id_pos_terminals_id_fk" FOREIGN KEY ("terminal_id") REFERENCES "public"."pos_terminals"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cash_drops" ADD CONSTRAINT "cash_drops_shift_id_shifts_id_fk" FOREIGN KEY ("shift_id") REFERENCES "public"."shifts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kds_stations" ADD CONSTRAINT "kds_stations_outlet_id_outlets_id_fk" FOREIGN KEY ("outlet_id") REFERENCES "public"."outlets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kds_routing_rules" ADD CONSTRAINT "kds_routing_rules_station_id_kds_stations_id_fk" FOREIGN KEY ("station_id") REFERENCES "public"."kds_stations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kds_tickets" ADD CONSTRAINT "kds_tickets_station_id_kds_stations_id_fk" FOREIGN KEY ("station_id") REFERENCES "public"."kds_stations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kds_ticket_items" ADD CONSTRAINT "kds_ticket_items_ticket_id_kds_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."kds_tickets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outlet_menu_assignments" ADD CONSTRAINT "outlet_menu_assignments_outlet_id_outlets_id_fk" FOREIGN KEY ("outlet_id") REFERENCES "public"."outlets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outlet_menu_assignments" ADD CONSTRAINT "outlet_menu_assignments_menu_set_id_menu_sets_id_fk" FOREIGN KEY ("menu_set_id") REFERENCES "public"."menu_sets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "menu_categories" ADD CONSTRAINT "menu_categories_menu_set_id_menu_sets_id_fk" FOREIGN KEY ("menu_set_id") REFERENCES "public"."menu_sets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_category_id_menu_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."menu_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "modifiers" ADD CONSTRAINT "modifiers_group_id_modifier_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."modifier_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "menu_item_modifier_groups" ADD CONSTRAINT "menu_item_modifier_groups_menu_item_id_menu_items_id_fk" FOREIGN KEY ("menu_item_id") REFERENCES "public"."menu_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "menu_item_modifier_groups" ADD CONSTRAINT "menu_item_modifier_groups_modifier_group_id_modifier_groups_id_fk" FOREIGN KEY ("modifier_group_id") REFERENCES "public"."modifier_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_ingredients" ADD CONSTRAINT "recipe_ingredients_recipe_id_recipes_id_fk" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_sub_recipes" ADD CONSTRAINT "recipe_sub_recipes_parent_recipe_id_recipes_id_fk" FOREIGN KEY ("parent_recipe_id") REFERENCES "public"."recipes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_sub_recipes" ADD CONSTRAINT "recipe_sub_recipes_sub_recipe_id_recipes_id_fk" FOREIGN KEY ("sub_recipe_id") REFERENCES "public"."recipes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_outlet_id_outlets_id_fk" FOREIGN KEY ("outlet_id") REFERENCES "public"."outlets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_category_id_inventory_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."inventory_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_batches" ADD CONSTRAINT "stock_batches_inventory_item_id_inventory_items_id_fk" FOREIGN KEY ("inventory_item_id") REFERENCES "public"."inventory_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_inventory_item_id_inventory_items_id_fk" FOREIGN KEY ("inventory_item_id") REFERENCES "public"."inventory_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_items" ADD CONSTRAINT "supplier_items_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_outlet_id_outlets_id_fk" FOREIGN KEY ("outlet_id") REFERENCES "public"."outlets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_supplier_id_suppliers_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "public"."suppliers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_purchase_order_id_purchase_orders_id_fk" FOREIGN KEY ("purchase_order_id") REFERENCES "public"."purchase_orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goods_receipts" ADD CONSTRAINT "goods_receipts_purchase_order_id_purchase_orders_id_fk" FOREIGN KEY ("purchase_order_id") REFERENCES "public"."purchase_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goods_receipt_items" ADD CONSTRAINT "goods_receipt_items_goods_receipt_id_goods_receipts_id_fk" FOREIGN KEY ("goods_receipt_id") REFERENCES "public"."goods_receipts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goods_receipt_items" ADD CONSTRAINT "goods_receipt_items_purchase_order_item_id_purchase_order_items_id_fk" FOREIGN KEY ("purchase_order_item_id") REFERENCES "public"."purchase_order_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "supplier_invoices" ADD CONSTRAINT "supplier_invoices_purchase_order_id_purchase_orders_id_fk" FOREIGN KEY ("purchase_order_id") REFERENCES "public"."purchase_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_counts" ADD CONSTRAINT "stock_counts_outlet_id_outlets_id_fk" FOREIGN KEY ("outlet_id") REFERENCES "public"."outlets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_count_items" ADD CONSTRAINT "stock_count_items_stock_count_id_stock_counts_id_fk" FOREIGN KEY ("stock_count_id") REFERENCES "public"."stock_counts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_transfer_items" ADD CONSTRAINT "stock_transfer_items_transfer_id_stock_transfers_id_fk" FOREIGN KEY ("transfer_id") REFERENCES "public"."stock_transfers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waste_log_items" ADD CONSTRAINT "waste_log_items_waste_log_id_waste_logs_id_fk" FOREIGN KEY ("waste_log_id") REFERENCES "public"."waste_logs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employees" ADD CONSTRAINT "employees_outlet_id_outlets_id_fk" FOREIGN KEY ("outlet_id") REFERENCES "public"."outlets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employee_schedules" ADD CONSTRAINT "employee_schedules_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "time_entries" ADD CONSTRAINT "time_entries_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tip_allocations" ADD CONSTRAINT "tip_allocations_tip_pool_id_tip_pools_id_fk" FOREIGN KEY ("tip_pool_id") REFERENCES "public"."tip_pools"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guest_feedbacks" ADD CONSTRAINT "guest_feedbacks_guest_profile_id_guest_profiles_id_fk" FOREIGN KEY ("guest_profile_id") REFERENCES "public"."guest_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loyalty_program_tiers" ADD CONSTRAINT "loyalty_program_tiers_program_id_loyalty_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."loyalty_programs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "loyalty_rewards" ADD CONSTRAINT "loyalty_rewards_program_id_loyalty_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."loyalty_programs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gift_card_transactions" ADD CONSTRAINT "gift_card_transactions_gift_card_id_gift_cards_id_fk" FOREIGN KEY ("gift_card_id") REFERENCES "public"."gift_cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "printers" ADD CONSTRAINT "printers_outlet_id_outlets_id_fk" FOREIGN KEY ("outlet_id") REFERENCES "public"."outlets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sensor_readings" ADD CONSTRAINT "sensor_readings_sensor_id_iot_sensors_id_fk" FOREIGN KEY ("sensor_id") REFERENCES "public"."iot_sensors"("id") ON DELETE cascade ON UPDATE no action;