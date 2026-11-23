-- ========================================================
-- KANJOO V3 Migration: Insurance, Pro Features, Stocks, Investors, Business Network
-- ========================================================

-- 1. Upgrade Users Table for Pro Membership
ALTER TABLE users ADD COLUMN is_pro_member BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN pro_expires_at TIMESTAMP;
ALTER TABLE users ADD COLUMN paypal_subscription_id VARCHAR(100);

-- 2. Insurance Policies Table
CREATE TABLE user_insurance_policies (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    policy_type VARCHAR(50) NOT NULL, -- HEALTH, LIFE_TERM, VEHICLE, HOME, ACCIDENTAL
    provider_name VARCHAR(100) NOT NULL,
    policy_number VARCHAR(100),
    sum_insured NUMERIC(18, 4) NOT NULL,
    annual_premium NUMERIC(18, 4) NOT NULL,
    currency_code VARCHAR(3) NOT NULL REFERENCES currencies(code),
    renewal_date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_insurance_user ON user_insurance_policies(user_id);

-- 3. Stocks & Equity Holdings Table
CREATE TABLE user_stocks (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    ticker_symbol VARCHAR(20) NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    quantity NUMERIC(18, 4) NOT NULL,
    buy_price NUMERIC(18, 4) NOT NULL,
    current_price NUMERIC(18, 4) NOT NULL,
    currency_code VARCHAR(3) NOT NULL REFERENCES currencies(code),
    purchase_date DATE NOT NULL,
    sector VARCHAR(50) DEFAULT 'General',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_stocks_user ON user_stocks(user_id);

-- 4. Startup Investor Catalog
CREATE TABLE investors_catalog (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    firm_name VARCHAR(100) NOT NULL,
    stage VARCHAR(50) NOT NULL, -- PRE_SEED, SEED, SERIES_A, GROWTH
    sectors VARCHAR(255) NOT NULL,
    ticket_size VARCHAR(50) NOT NULL,
    country_code VARCHAR(2) NOT NULL REFERENCES countries(code),
    linkedin_url VARCHAR(255),
    website_url VARCHAR(255),
    pitch_email VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Business Network & Founders Directory
CREATE TABLE business_network (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    title VARCHAR(100) NOT NULL,
    company VARCHAR(100) NOT NULL,
    industry VARCHAR(100) NOT NULL,
    country_code VARCHAR(2) NOT NULL REFERENCES countries(code),
    linkedin_url VARCHAR(255) NOT NULL,
    bio TEXT,
    is_verified BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- Seed Initial Data for Insurance, Investors & Business Network
-- ========================================================

-- Seed Demo User as PRO Member
UPDATE users SET is_pro_member = TRUE, pro_expires_at = '2030-12-31 23:59:59' WHERE email = 'demo@kanjoo.ai';

-- Seed Dedicated Pro Account: pro@kanjoo.ai / Password@123
INSERT INTO users (email, password_hash, full_name, role, is_active, is_pro_member, pro_expires_at) VALUES
('pro@kanjoo.ai', '$2a$10$wT8mQ3L3p0l4pY7e12fCReK9b9N1q7f.x7wY8s6t5u4v3w2x1y0za', 'Sarah Jenkins (Pro)', 'ROLE_USER', TRUE, TRUE, '2030-12-31 23:59:59');

-- Pre-seed demo insurance policies for demo user (id 1)
INSERT INTO user_insurance_policies (user_id, policy_type, provider_name, policy_number, sum_insured, annual_premium, currency_code, renewal_date, is_active) VALUES
(1, 'HEALTH', 'HDFC ERGO Optima Secure', 'POL-HE-89211', 1000000.0000, 14500.0000, 'INR', '2027-05-15', TRUE),
(1, 'LIFE_TERM', 'Tata AIA Sampoorna Raksha', 'POL-LT-44910', 15000000.0000, 12000.0000, 'INR', '2027-08-20', TRUE);

-- Pre-seed demo stocks for demo user (id 1)
INSERT INTO user_stocks (user_id, ticker_symbol, company_name, quantity, buy_price, current_price, currency_code, purchase_date, sector) VALUES
(1, 'INFY', 'Infosys Ltd', 50.0000, 1420.0000, 1850.0000, 'INR', '2025-03-10', 'Information Technology'),
(1, 'TCS', 'Tata Consultancy Services', 20.0000, 3600.0000, 4120.0000, 'INR', '2025-04-15', 'Information Technology'),
(1, 'HDFCBANK', 'HDFC Bank Ltd', 40.0000, 1680.0000, 1530.0000, 'INR', '2025-08-20', 'Banking & Finance'),
(1, 'RELIANCE', 'Reliance Industries', 25.0000, 2450.0000, 2890.0000, 'INR', '2025-01-12', 'Energy & Retail');

-- Pre-seed Global Investors Catalog
INSERT INTO investors_catalog (name, firm_name, stage, sectors, ticket_size, country_code, linkedin_url, website_url, pitch_email) VALUES
('Rajan Anandan', 'Peak XV Partners (Sequoia India)', 'SEED', 'Fintech, AI, B2B SaaS', '$250k - $2M', 'IN', 'https://www.linkedin.com/in/rajananandan/', 'https://www.peakxv.com', 'pitches@peakxv.com'),
('Sanjay Mehta', '100X.VC', 'PRE_SEED', 'Fintech, Consumer Tech, DeepTech', '$125k - $500k', 'IN', 'https://www.linkedin.com/in/sanjaymehta/', 'https://www.100x.vc', 'pitch@100x.vc'),
('Karthik Reddy', 'Blume Ventures', 'SEED', 'Fintech, Edtech, Mobility, Logistics', '$500k - $3M', 'IN', 'https://www.linkedin.com/in/karthikreddy/', 'https://blume.vc', 'ideas@blume.vc'),
('Garry Tan', 'Y Combinator', 'PRE_SEED', 'Software, AI, Global Fintech, Web3', '$500k Standard Deal', 'US', 'https://www.linkedin.com/in/garrytan/', 'https://www.ycombinator.com', 'apply@ycombinator.com'),
('Roelof Botha', 'Sequoia Capital US', 'SERIES_A', 'Enterprise Software, Financial Services', '$2M - $15M', 'US', 'https://www.linkedin.com/in/roelofbotha/', 'https://www.sequoiacap.com', 'partners@sequoiacap.com'),
('Eileen Burbidge', 'Passion Capital', 'SEED', 'Digital Banking, Payments, Insurtech', '£250k - £1M', 'GB', 'https://www.linkedin.com/in/eileenburbidge/', 'https://passioncapital.com', 'hello@passioncapital.com'),
('Hiroshi Mikitani', 'Rakuten Capital', 'GROWTH', 'E-commerce, Fintech, Telecom', '¥50M - ¥500M', 'JP', 'https://www.linkedin.com/in/mikitani/', 'https://capital.rakuten.com', 'invest@rakuten.com');

-- Pre-seed Business & Founders Networking Directory
INSERT INTO business_network (name, title, company, industry, country_code, linkedin_url, bio, is_verified) VALUES
('Kunal Shah', 'Founder & CEO', 'CRED', 'Fintech & Rewards', 'IN', 'https://www.linkedin.com/in/kunalshah1/', 'Second-time founder building high-trust financial networks for prime credit individuals.', TRUE),
('Nithin Kamath', 'Co-Founder & CEO', 'Zerodha', 'Fintech & WealthTech', 'IN', 'https://www.linkedin.com/in/nithinkamath/', 'Pioneered discount broking in India. Advocate for bootstrapped, sustainable financial technology.', TRUE),
('Naveen Tewari', 'Founder & CEO', 'InMobi Group', 'AdTech & AI Platforms', 'IN', 'https://www.linkedin.com/in/naveentewari/', 'India first unicorn founder. Championing consumer AI and micro-transactions globally.', TRUE),
('Brian Chesky', 'Co-Founder & CEO', 'Airbnb', 'Marketplaces & Travel Tech', 'US', 'https://www.linkedin.com/in/brianchesky/', 'Design-driven tech entrepreneur. Scaling community-first global platforms.', TRUE),
('Nik Storonsky', 'Founder & CEO', 'Revolut', 'Global Neo-Banking', 'GB', 'https://www.linkedin.com/in/nikolay-storonsky/', 'Building the world first truly borderless financial super-app.', TRUE),
('Taavet Hinrikus', 'Co-Founder', 'Wise (formerly TransferWise)', 'International Remittances', 'GB', 'https://www.linkedin.com/in/taavethinrikus/', 'First Skype employee turned fintech pioneer. Solving cross-border money transfer friction.', TRUE),
('Shuntaro Furukawa', 'President & CEO', 'Nintendo', 'Entertainment & Digital Goods', 'JP', 'https://www.linkedin.com/company/nintendo/', 'Pioneering global digital IP licensing and cross-border digital subscription models.', TRUE);
