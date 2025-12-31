-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. MATCHES TABLE (Stores V4 Signal Data)
create table matches (
  id uuid primary key default uuid_generate_v4(),
  external_id text unique, -- e.g. "v4_real_12345"
  league text,
  home_team text,
  away_team text,
  match_time timestamptz,
  status text default 'SCHEDULED', -- SCHEDULED, FINISHED
  odds_data jsonb, -- Storing raw odds snapshot
  quant_analysis jsonb, -- The AI Reports (Consensus, etc.)
  models_data jsonb, -- Individual model predictions
  created_at timestamptz default now()
);

-- 2. PARLAY TICKETS TABLE (Official System Picks)
create table parlay_tickets (
  id uuid primary key default uuid_generate_v4(),
  ticket_id text unique, -- e.g. "tx_4F_12345"
  date date,
  type text, -- "Safe 2-Fold", "Degen 4-Fold"
  legs jsonb, -- Array of legs selected
  total_odds numeric,
  stake numeric default 100,
  status text default 'PENDING',
  pnl numeric default 0,
  roi text,
  verified_on text,
  created_at timestamptz default now()
);

-- 3. USER PROFILES (Wallet & Auth)
create table profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  balance numeric default 1000, -- Virtual Coins
  is_pro boolean default false,
  created_at timestamptz default now()
);

-- 4. USER BETS (Individual User Action)
create table user_bets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  ticket_id uuid references parlay_tickets(id), -- Optional link to system ticket
  selection_details jsonb, -- If custom bet
  stake numeric,
  status text default 'PENDING',
  pnl numeric,
  created_at timestamptz default now()
);

-- Row Level Security (RLS)
alter table matches enable row level security;
alter table parlay_tickets enable row level security;
alter table profiles enable row level security;
alter table user_bets enable row level security;

-- Policies (Public Read for Matches/Parlays)
create policy "Public matches are viewable by everyone" on matches for select using (true);
create policy "Public parlays are viewable by everyone" on parlay_tickets for select using (true);

-- User Policies
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
