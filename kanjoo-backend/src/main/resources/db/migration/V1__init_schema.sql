-- ========================================================
-- KANJOO Global AI Personal Finance Intelligence System
-- V1 Database Schema Migration
-- Compatible with PostgreSQL and H2 (PostgreSQL mode)
-- ========================================================

-- Currencies (ISO 4217)
CREATE TABLE currencies (
    code VARCHAR(3) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    symbol VARCHAR(10) NOT NULL,
    decimal_digits INT NOT NULL DEFAULT 2
);

-- Countries
CREATE TABLE countries (
    code VARCHAR(2) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    currency_code VARCHAR(3) NOT NULL REFERENCES currencies(code),
    phone_code VARCHAR(10) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Exchange Rates (Relative to Base USD)
CREATE TABLE exchange_rates (
    id BIGSERIAL PRIMARY KEY,
    base_currency VARCHAR(3) NOT NULL REFERENCES currencies(code),
    target_currency VARCHAR(3) NOT NULL REFERENCES currencies(code),
    rate NUMERIC(18, 6) NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_currency_pair UNIQUE (base_currency, target_currency)
);

-- Users
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- User Financial & Demographic Profiles
CREATE TABLE user_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    country_code VARCHAR(2) NOT NULL REFERENCES countries(code),
    primary_currency_code VARCHAR(3) NOT NULL REFERENCES currencies(code),
    age INT,
    state_region VARCHAR(100),
    city VARCHAR(100),
    occupation VARCHAR(100),
    student_or_professional VARCHAR(30) DEFAULT 'PROFESSIONAL',
    education_level VARCHAR(50),
    preferred_language VARCHAR(20) DEFAULT 'en',
    monthly_income NUMERIC(16, 4) DEFAULT 0.0000,
    pocket_money NUMERIC(16, 4) DEFAULT 0.0000,
    other_income NUMERIC(16, 4) DEFAULT 0.0000,
    monthly_savings_target NUMERIC(16, 4) DEFAULT 0.0000,
    existing_investments NUMERIC(16, 4) DEFAULT 0.0000,
    emergency_savings NUMERIC(16, 4) DEFAULT 0.0000,
    housing_type VARCHAR(50) DEFAULT 'RENTED',
    risk_tolerance VARCHAR(20) DEFAULT 'MODERATE',
    onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
    financial_health_score INT DEFAULT 65,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Expense Categories
CREATE TABLE expense_categories (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50) NOT NULL DEFAULT 'Tag',
    is_essential BOOLEAN NOT NULL DEFAULT FALSE
);

-- Expenses
CREATE TABLE expenses (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id BIGINT NOT NULL REFERENCES expense_categories(id),
    amount NUMERIC(16, 4) NOT NULL,
    original_currency VARCHAR(3) NOT NULL REFERENCES currencies(code),
    exchange_rate NUMERIC(18, 6) NOT NULL DEFAULT 1.000000,
    primary_amount NUMERIC(16, 4) NOT NULL,
    expense_date DATE NOT NULL,
    description VARCHAR(255),
    payment_method VARCHAR(50) DEFAULT 'CARD',
    is_recurring BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Income Sources
CREATE TABLE income_sources (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    amount NUMERIC(16, 4) NOT NULL,
    original_currency VARCHAR(3) NOT NULL REFERENCES currencies(code),
    exchange_rate NUMERIC(18, 6) NOT NULL DEFAULT 1.000000,
    primary_amount NUMERIC(16, 4) NOT NULL,
    frequency VARCHAR(30) NOT NULL DEFAULT 'MONTHLY',
    is_primary BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Budgets
CREATE TABLE budgets (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    month_year VARCHAR(7) NOT NULL, -- YYYY-MM
    total_income NUMERIC(16, 4) NOT NULL DEFAULT 0.0000,
    total_budget NUMERIC(16, 4) NOT NULL DEFAULT 0.0000,
    savings_target NUMERIC(16, 4) NOT NULL DEFAULT 0.0000,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_month_budget UNIQUE (user_id, month_year)
);

-- Budget Category Allocations
CREATE TABLE budget_categories (
    id BIGSERIAL PRIMARY KEY,
    budget_id BIGINT NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
    category_id BIGINT NOT NULL REFERENCES expense_categories(id),
    allocated_amount NUMERIC(16, 4) NOT NULL,
    CONSTRAINT uq_budget_cat UNIQUE (budget_id, category_id)
);

-- Telecom Operators
CREATE TABLE telecom_operators (
    id BIGSERIAL PRIMARY KEY,
    country_code VARCHAR(2) NOT NULL REFERENCES countries(code),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    official_website VARCHAR(255),
    logo_color VARCHAR(20) DEFAULT '#3B82F6'
);

-- Recharge Plans
CREATE TABLE recharge_plans (
    id BIGSERIAL PRIMARY KEY,
    operator_id BIGINT NOT NULL REFERENCES telecom_operators(id) ON DELETE CASCADE,
    country_code VARCHAR(2) NOT NULL REFERENCES countries(code),
    plan_name VARCHAR(150) NOT NULL,
    price NUMERIC(16, 4) NOT NULL,
    currency_code VARCHAR(3) NOT NULL REFERENCES currencies(code),
    validity_days INT NOT NULL,
    daily_data_gb NUMERIC(6, 2) DEFAULT 0.00,
    total_data_gb NUMERIC(6, 2) DEFAULT 0.00,
    is_unlimited_calling BOOLEAN DEFAULT TRUE,
    sms_per_day INT DEFAULT 100,
    plan_type VARCHAR(30) DEFAULT 'PREPAID', -- PREPAID, POSTPAID, SECONDARY_INCOMING
    bundled_perks VARCHAR(500),
    official_source_url VARCHAR(255),
    last_verified_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- User SIM Cards
CREATE TABLE user_sim_cards (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    operator_id BIGINT NOT NULL REFERENCES telecom_operators(id),
    phone_number VARCHAR(30),
    sim_slot VARCHAR(20) NOT NULL DEFAULT 'PRIMARY', -- PRIMARY, SECONDARY
    current_plan_id BIGINT REFERENCES recharge_plans(id),
    plan_expiry_date DATE,
    daily_data_used_gb NUMERIC(6, 2) DEFAULT 1.00,
    has_wifi_access BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Offers & Subscriptions Catalog
CREATE TABLE offers_subscriptions (
    id BIGSERIAL PRIMARY KEY,
    country_code VARCHAR(2) NOT NULL REFERENCES countries(code),
    provider_name VARCHAR(100) NOT NULL,
    service_name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL, -- ENTERTAINMENT, EDUCATION, CLOUD, TOOLS, OTHER
    original_price NUMERIC(16, 4) NOT NULL,
    discounted_price NUMERIC(16, 4) NOT NULL,
    currency_code VARCHAR(3) NOT NULL REFERENCES currencies(code),
    billing_period VARCHAR(20) DEFAULT 'MONTHLY',
    student_only BOOLEAN DEFAULT FALSE,
    eligibility_criteria VARCHAR(500),
    benefits_summary VARCHAR(500),
    official_source_url VARCHAR(255),
    last_verified_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- User Subscriptions
CREATE TABLE user_subscriptions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    offer_id BIGINT REFERENCES offers_subscriptions(id),
    service_name VARCHAR(150) NOT NULL,
    price NUMERIC(16, 4) NOT NULL,
    currency_code VARCHAR(3) NOT NULL REFERENCES currencies(code),
    billing_cycle VARCHAR(20) DEFAULT 'MONTHLY',
    next_billing_date DATE,
    is_actively_used BOOLEAN DEFAULT TRUE,
    category VARCHAR(50) DEFAULT 'ENTERTAINMENT',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Scholarships Catalog
CREATE TABLE scholarships (
    id BIGSERIAL PRIMARY KEY,
    country_code VARCHAR(2) NOT NULL REFERENCES countries(code),
    name VARCHAR(200) NOT NULL,
    provider VARCHAR(150) NOT NULL,
    amount NUMERIC(16, 4) NOT NULL,
    currency_code VARCHAR(3) NOT NULL REFERENCES currencies(code),
    education_level VARCHAR(100),
    eligibility_details VARCHAR(1000),
    deadline DATE,
    application_url VARCHAR(255),
    official_source_url VARCHAR(255),
    last_verified_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- User Scholarship Bookmarks
CREATE TABLE user_scholarship_bookmarks (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    scholarship_id BIGINT NOT NULL REFERENCES scholarships(id) ON DELETE CASCADE,
    status VARCHAR(30) DEFAULT 'BOOKMARKED', -- BOOKMARKED, APPLIED, AWARDED, REJECTED
    notes VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_scholarship UNIQUE (user_id, scholarship_id)
);

-- Investments Portfolio
CREATE TABLE investments (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    asset_type VARCHAR(50) NOT NULL, -- SIP, MUTUAL_FUND, ETF, STOCK, NISA, ISA, BONDS
    name VARCHAR(150) NOT NULL,
    invested_amount NUMERIC(16, 4) NOT NULL,
    current_value NUMERIC(16, 4) NOT NULL,
    currency_code VARCHAR(3) NOT NULL REFERENCES currencies(code),
    monthly_contribution NUMERIC(16, 4) DEFAULT 0.0000,
    expected_annual_return NUMERIC(5, 2) DEFAULT 12.00,
    start_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Central KANJOO Plan
CREATE TABLE kanjoo_plans (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(30) DEFAULT 'ACTIVE',
    target_monthly_savings NUMERIC(16, 4) DEFAULT 0.0000,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- KANJOO Plan Items
CREATE TABLE kanjoo_plan_items (
    id BIGSERIAL PRIMARY KEY,
    plan_id BIGINT NOT NULL REFERENCES kanjoo_plans(id) ON DELETE CASCADE,
    item_type VARCHAR(50) NOT NULL, -- RECHARGE_OPTIMIZATION, SUBSCRIPTION_CANCEL, SUBSCRIPTION_SWITCH, EXPENSE_REDUCTION, SCHOLARSHIP, SIP_INCREASE
    title VARCHAR(200) NOT NULL,
    description VARCHAR(500),
    potential_monthly_savings NUMERIC(16, 4) DEFAULT 0.0000,
    potential_annual_savings NUMERIC(16, 4) DEFAULT 0.0000,
    is_implemented BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- BUDGET_ALERT, RENEWAL_WARNING, SCHOLARSHIP_DEADLINE, MONEY_LEAK, SYSTEM
    title VARCHAR(150) NOT NULL,
    message VARCHAR(500) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- AI Conversation History
CREATE TABLE ai_conversations (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message_role VARCHAR(20) NOT NULL, -- USER, ASSISTANT, SYSTEM
    content TEXT NOT NULL,
    context_data TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for high performance
CREATE INDEX idx_expenses_user_date ON expenses(user_id, expense_date);
CREATE INDEX idx_budgets_user_month ON budgets(user_id, month_year);
CREATE INDEX idx_recharge_country ON recharge_plans(country_code);
CREATE INDEX idx_offers_country ON offers_subscriptions(country_code);
CREATE INDEX idx_scholarships_country ON scholarships(country_code);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
