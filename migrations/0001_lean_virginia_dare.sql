CREATE TABLE "eventos" (
	"id" serial PRIMARY KEY NOT NULL,
	"titulo" varchar(200) NOT NULL,
	"descricao" text NOT NULL,
	"dia" date NOT NULL,
	"horario_inicio" time NOT NULL,
	"horario_fim" time NOT NULL,
	"local" varchar(150) NOT NULL,
	"imagem_url" text,
	"order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
