CREATE TABLE "class_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(160) NOT NULL,
	"slug" varchar(180) NOT NULL,
	"image_url" text,
	"status" varchar(64) DEFAULT 'Active' NOT NULL,
	"race" varchar(120),
	"tagline" varchar(220),
	"hobbies" text,
	"goal" text,
	"instagram" varchar(120),
	"instagram_visible" integer DEFAULT 0 NOT NULL,
	"phone" varchar(64),
	"phone_visible" integer DEFAULT 0 NOT NULL,
	"hometown" varchar(160),
	"is_published" integer DEFAULT 1 NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "class_members_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "member_gallery" (
	"id" serial PRIMARY KEY NOT NULL,
	"member_id" integer NOT NULL,
	"image_url" text NOT NULL,
	"media_type" varchar(16) DEFAULT 'image' NOT NULL,
	"alt_text" varchar(220),
	"is_published" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"open_id" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"login_method" varchar(64),
	"role" varchar(16) DEFAULT 'user' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_signed_in" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_open_id_unique" UNIQUE("open_id")
);
