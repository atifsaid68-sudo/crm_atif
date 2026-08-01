# CRM RH — Phase 1

Système de gestion RH multi-clients pour cabinet de conseil RH.

Phase 1 : sociétés clientes, organigramme, classification des emplois, fiches de poste.

## Stack

- Next.js (TypeScript, App Router)
- Prisma ORM — SQLite en local, PostgreSQL (Supabase) en production
- Tailwind CSS + shadcn/ui

## Démarrage en local

```bash
npm install
npx prisma migrate dev
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000). Aucune configuration externe n'est nécessaire : la base de données locale est un simple fichier SQLite (`prisma/dev.db`, créé automatiquement).

## Données de démonstration

```bash
npx tsx prisma/seed.ts
```

Crée 5 sociétés clientes fictives (préfixées `[Démo]`) avec organigrammes, classification des emplois et fiches de poste, pour explorer l'application avec des données réalistes. Pour les supprimer, ouvrez chaque société de démo dans l'interface et cliquez sur "Supprimer la société" (icône corbeille) — la suppression est en cascade.

## Passer en production (Supabase + Vercel, gratuit)

1. Créer un projet gratuit sur [supabase.com](https://supabase.com) et récupérer la chaîne de connexion Postgres.
2. Dans `prisma/schema.prisma`, changer `provider = "sqlite"` en `provider = "postgresql"`.
3. Définir `DATABASE_URL` (variable d'environnement) avec la chaîne de connexion Supabase — voir `.env.example`.
4. Lancer `npx prisma migrate deploy` pour appliquer les migrations sur la base Supabase.
5. Déployer le projet sur [Vercel](https://vercel.com) (plan gratuit) en connectant le repo GitHub, en renseignant `DATABASE_URL` dans les variables d'environnement du projet Vercel.

## Structure

- `prisma/schema.prisma` — modèle de données
- `app/clients/` — liste des sociétés clientes
- `app/clients/[id]/` — fiche société (organigramme, classification des emplois, fiches de poste, employés)
- `lib/db.ts` — client Prisma
