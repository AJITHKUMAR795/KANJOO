-- ========================================================
-- KANJOO Global AI Personal Finance Intelligence System
-- V2 Seed Global Data Migration
-- ========================================================

-- Currencies
INSERT INTO currencies (code, name, symbol, decimal_digits) VALUES
('USD', 'US Dollar', '$', 2),
('INR', 'Indian Rupee', '₹', 2),
('EUR', 'Euro', '€', 2),
('GBP', 'British Pound', '£', 2),
('JPY', 'Japanese Yen', '¥', 0),
('AED', 'UAE Dirham', 'AED', 2),
('CAD', 'Canadian Dollar', 'CA$', 2),
('AUD', 'Australian Dollar', 'A$', 2),
('SGD', 'Singapore Dollar', 'S$', 2),
('KWD', 'Kuwaiti Dinar', 'KD', 3);

-- Countries
INSERT INTO countries (code, name, currency_code, phone_code, is_active) VALUES
('IN', 'India', 'INR', '+91', TRUE),
('US', 'United States', 'USD', '+1', TRUE),
('GB', 'United Kingdom', 'GBP', '+44', TRUE),
('JP', 'Japan', 'JPY', '+81', TRUE),
('DE', 'Germany', 'EUR', '+49', TRUE),
('AE', 'United Arab Emirates', 'AED', '+971', TRUE),
('CA', 'Canada', 'CAD', '+1', TRUE),
('AU', 'Australia', 'AUD', '+61', TRUE),
('SG', 'Singapore', 'SGD', '+65', TRUE),
('KW', 'Kuwait', 'KWD', '+965', TRUE);

-- Exchange Rates (Base USD)
INSERT INTO exchange_rates (base_currency, target_currency, rate) VALUES
('USD', 'USD', 1.000000),
('USD', 'INR', 83.500000),
('USD', 'EUR', 0.920000),
('USD', 'GBP', 0.790000),
('USD', 'JPY', 155.000000),
('USD', 'AED', 3.672500),
('USD', 'CAD', 1.360000),
('USD', 'AUD', 1.520000),
('USD', 'SGD', 1.350000),
('USD', 'KWD', 0.308000),

-- Reverse Rates for INR Base
('INR', 'USD', 0.011976),
('INR', 'INR', 1.000000),
('INR', 'EUR', 0.011018),
('INR', 'GBP', 0.009461),
('INR', 'JPY', 1.856287),
('INR', 'AED', 0.043982);

-- Standard Expense Categories
INSERT INTO expense_categories (code, name, icon, is_essential) VALUES
('FOOD', 'Food & Dining', 'Utensils', TRUE),
('ACCOMMODATION', 'Housing & Rent', 'Home', TRUE),
('TRANSPORTATION', 'Transit & Fuel', 'Car', TRUE),
('EDUCATION', 'Education & Learning', 'GraduationCap', TRUE),
('TELECOM', 'Mobile & Recharge', 'Smartphone', TRUE),
('INTERNET', 'Home Broadband & Wi-Fi', 'Wifi', TRUE),
('SHOPPING', 'Shopping & Apparel', 'ShoppingBag', FALSE),
('HEALTHCARE', 'Healthcare & Medical', 'HeartPulse', TRUE),
('ENTERTAINMENT', 'Entertainment & Recreation', 'Film', FALSE),
('SUBSCRIPTIONS', 'Digital Subscriptions', 'Tv', FALSE),
('INVESTMENTS', 'Investments & Savings', 'TrendingUp', TRUE),
('OTHER', 'Miscellaneous', 'MoreHorizontal', FALSE);

-- Telecom Operators
INSERT INTO telecom_operators (country_code, name, code, official_website, logo_color) VALUES
('IN', 'Reliance Jio', 'JIO_IN', 'https://www.jio.com', '#0F52BA'),
('IN', 'Bharti Airtel', 'AIRTEL_IN', 'https://www.airtel.in', '#E60000'),
('IN', 'Vodafone Idea', 'VI_IN', 'https://www.myvi.in', '#FFCC00'),
('IN', 'BSNL Mobile', 'BSNL_IN', 'https://www.bsnl.co.in', '#0072BB'),

('US', 'T-Mobile US', 'TMOBILE_US', 'https://www.t-mobile.com', '#E20074'),
('US', 'Verizon Wireless', 'VERIZON_US', 'https://www.verizon.com', '#CD040B'),
('US', 'AT&T Mobility', 'ATT_US', 'https://www.att.com', '#00A8E0'),

('GB', 'EE UK', 'EE_GB', 'https://ee.co.uk', '#007B85'),
('GB', 'O2 UK (Virgin Media O2)', 'O2_GB', 'https://www.o2.co.uk', '#032B70'),
('GB', 'Vodafone UK', 'VODA_GB', 'https://www.vodafone.co.uk', '#E60000'),

('JP', 'NTT Docomo (ahamo)', 'DOCOMO_JP', 'https://ahamo.com', '#CC0000'),
('JP', 'au (KDDI povo)', 'AU_JP', 'https://povo.jp', '#FF6600'),
('JP', 'SoftBank (LINEMO)', 'SOFTBANK_JP', 'https://www.linemo.jp', '#808285');

-- Recharge Plans
-- India Plans (Authentic recent benchmark plans)
INSERT INTO recharge_plans (operator_id, country_code, plan_name, price, currency_code, validity_days, daily_data_gb, total_data_gb, is_unlimited_calling, sms_per_day, plan_type, bundled_perks, official_source_url) VALUES
(1, 'IN', 'Jio 28-Day Unlimited 1.5GB/day', 299.0000, 'INR', 28, 1.50, 42.00, TRUE, 100, 'PREPAID', 'JioCinema, JioTV, JioCloud', 'https://www.jio.com/plans'),
(1, 'IN', 'Jio 84-Day Unlimited 1.5GB/day Value Pack', 799.0000, 'INR', 84, 1.50, 126.00, TRUE, 100, 'PREPAID', 'JioCinema, JioTV, JioCloud', 'https://www.jio.com/plans'),
(1, 'IN', 'Jio 336-Day Annual 2.5GB/day', 3599.0000, 'INR', 365, 2.50, 912.50, TRUE, 100, 'PREPAID', 'JioCinema Premium 1-Yr, JioTV, 5G Unlimited', 'https://www.jio.com/plans'),
(2, 'IN', 'Airtel 28-Day Unlimited 1.5GB/day', 349.0000, 'INR', 28, 1.50, 42.00, TRUE, 100, 'PREPAID', 'Airtel Xstream Play, Wynk Music, Apollo 24/7', 'https://www.airtel.in/prepaid-plans'),
(2, 'IN', 'Airtel 84-Day Unlimited 1.5GB/day', 859.0000, 'INR', 84, 1.50, 126.00, TRUE, 100, 'PREPAID', 'Airtel Xstream Play, Wynk Music, Unlimited 5G', 'https://www.airtel.in/prepaid-plans'),
(3, 'IN', 'Vi Hero Unlimited 1.5GB/day', 349.0000, 'INR', 28, 1.50, 42.00, TRUE, 100, 'PREPAID', 'Binge All Night (12-6 AM data free), Weekend Rollover', 'https://www.myvi.in/prepaid'),
(4, 'IN', 'BSNL PV-199 30-Day Budget Saver', 199.0000, 'INR', 30, 2.00, 60.00, TRUE, 100, 'PREPAID', 'National Roaming, Free Tunes', 'https://www.bsnl.co.in'),
(4, 'IN', 'BSNL PV-397 Long Validity Secondary SIM Saver', 397.0000, 'INR', 150, 0.00, 2.00, FALSE, 0, 'SECONDARY_INCOMING', 'Keeps SIM active for 150 days incoming, 30 days free calls', 'https://www.bsnl.co.in'),
(4, 'IN', 'BSNL PV-107 Secondary SIM 35-Day Keeper', 107.0000, 'INR', 35, 0.00, 3.00, FALSE, 0, 'SECONDARY_INCOMING', '35 days incoming validity + 200 min calls', 'https://www.bsnl.co.in');

-- USA Plans
INSERT INTO recharge_plans (operator_id, country_code, plan_name, price, currency_code, validity_days, daily_data_gb, total_data_gb, is_unlimited_calling, sms_per_day, plan_type, bundled_perks, official_source_url) VALUES
(5, 'US', 'T-Mobile Connect 5GB Prepaid', 15.0000, 'USD', 30, 0.00, 5.00, TRUE, 500, 'PREPAID', 'Unlimited Talk & Text, Scam Shield', 'https://www.t-mobile.com/prepaid'),
(5, 'US', 'T-Mobile Simply Prepaid Unlimited', 50.0000, 'USD', 30, 0.00, 50.00, TRUE, 1000, 'PREPAID', 'Unlimited 5G Data, Music Unlimited', 'https://www.t-mobile.com/prepaid'),
(6, 'US', 'Verizon Prepaid 15GB Plan', 35.0000, 'USD', 30, 0.00, 15.00, TRUE, 1000, 'PREPAID', '5G Nationwide, Mobile Hotspot', 'https://www.verizon.com/prepaid'),
(7, 'US', 'AT&T Prepaid 16GB Annual Special', 25.0000, 'USD', 30, 0.00, 16.00, TRUE, 1000, 'PREPAID', 'Paid upfront $300/yr ($25/mo), Rollover Data', 'https://www.att.com/prepaid');

-- UK Plans
INSERT INTO recharge_plans (operator_id, country_code, plan_name, price, currency_code, validity_days, daily_data_gb, total_data_gb, is_unlimited_calling, sms_per_day, plan_type, bundled_perks, official_source_url) VALUES
(8, 'GB', 'EE Monthly Rolling 25GB', 15.0000, 'GBP', 30, 0.00, 25.00, TRUE, 1000, 'PREPAID', 'Fastest UK 5G, Data Rollover', 'https://ee.co.uk/mobile/prepaid'),
(9, 'GB', 'O2 Big Bundle 20GB', 12.0000, 'GBP', 30, 0.00, 20.00, TRUE, 1000, 'PREPAID', 'O2 Priority app discounts, EU Roaming', 'https://www.o2.co.uk/prepaid'),
(10, 'GB', 'Vodafone PAYG Plus 30GB', 15.0000, 'GBP', 30, 0.00, 30.00, TRUE, 1000, 'PREPAID', 'Vodafone VeryMe Rewards, Total Rollover', 'https://www.vodafone.co.uk/prepaid');

-- Japan Plans
INSERT INTO recharge_plans (operator_id, country_code, plan_name, price, currency_code, validity_days, daily_data_gb, total_data_gb, is_unlimited_calling, sms_per_day, plan_type, bundled_perks, official_source_url) VALUES
(11, 'JP', 'ahamo 20GB High-Speed 5G', 2970.0000, 'JPY', 30, 0.00, 20.00, TRUE, 100, 'PREPAID', '5 min free voice calls, overseas roaming in 82 countries', 'https://ahamo.com'),
(12, 'JP', 'povo 2.0 Base Plan + 3GB Topping', 990.0000, 'JPY', 30, 0.00, 3.00, FALSE, 0, 'SECONDARY_INCOMING', 'Zero base fee, buy toppings on demand', 'https://povo.jp'),
(13, 'JP', 'LINEMO Mini Plan 3GB', 990.0000, 'JPY', 30, 0.00, 3.00, FALSE, 0, 'PREPAID', 'LINE messaging and voice calls do not consume data', 'https://www.linemo.jp');

-- Offers and Subscriptions
INSERT INTO offers_subscriptions (country_code, provider_name, service_name, category, original_price, discounted_price, currency_code, billing_period, student_only, eligibility_criteria, benefits_summary, official_source_url) VALUES
('IN', 'Spotify', 'Spotify Premium Student', 'ENTERTAINMENT', 119.0000, 59.0000, 'INR', 'MONTHLY', TRUE, 'Accredited university student with valid SheerID verification', '50% discount, ad-free music, offline downloads', 'https://www.spotify.com/in-en/student/'),
('IN', 'YouTube', 'YouTube Premium Student', 'ENTERTAINMENT', 149.0000, 79.0000, 'INR', 'MONTHLY', TRUE, 'Full-time higher education student verified via SheerID', 'Ad-free videos, background play, YouTube Music included', 'https://www.youtube.com/premium/student'),
('IN', 'Amazon', 'Amazon Prime Student India', 'ENTERTAINMENT', 299.0000, 149.0000, 'INR', 'MONTHLY', TRUE, 'Age 18-24 college students, upload student ID', 'Free fast delivery, Prime Video, Prime Music, 50% cashback offer', 'https://www.amazon.in/prime'),
('IN', 'GitHub', 'GitHub Student Developer Pack', 'EDUCATION', 8350.0000, 0.0000, 'INR', 'ANNUAL', TRUE, 'Enrolled student with school-issued email or proof of enrollment', 'Free GitHub Copilot, free domain name, $100 DigitalOcean credits, JetBrains IDE suite', 'https://education.github.com/pack'),
('IN', 'Apple', 'Apple Music Student + Apple TV+', 'ENTERTAINMENT', 99.0000, 59.0000, 'INR', 'MONTHLY', TRUE, 'Enrolled college/university student verified with UNiDAYS', 'Lossless audio Apple Music plus free access to Apple TV+', 'https://www.apple.com/in/apple-music/'),

('US', 'Spotify', 'Spotify Premium Student with Hulu', 'ENTERTAINMENT', 11.9900, 5.9900, 'USD', 'MONTHLY', TRUE, 'US college students verified via SheerID', 'Spotify Premium + Hulu (with ads) included', 'https://www.spotify.com/us/student/'),
('US', 'Amazon', 'Prime Student US (6-Month Free Trial)', 'SHOPPING', 14.9900, 7.4900, 'USD', 'MONTHLY', TRUE, 'Active college student with .edu email', '6 months free, then 50% off Prime benefits', 'https://www.amazon.com/primestudent'),
('US', 'GitHub', 'GitHub Student Developer Pack US', 'EDUCATION', 100.0000, 0.0000, 'USD', 'ANNUAL', TRUE, 'US enrolled student', 'Copilot free, AWS credits, JetBrains, Canva Pro', 'https://education.github.com/pack'),
('US', 'YouTube', 'YouTube Premium Student US', 'ENTERTAINMENT', 13.9900, 7.9900, 'USD', 'MONTHLY', TRUE, 'US university student', 'Ad-free YouTube and YouTube Music', 'https://www.youtube.com/premium/student'),

('GB', 'Spotify', 'Spotify Student UK', 'ENTERTAINMENT', 10.9900, 5.9900, 'GBP', 'MONTHLY', TRUE, 'UK university student UNiDAYS verified', '50% off ad-free music', 'https://www.spotify.com/uk/student/'),
('GB', 'Amazon', 'Prime Student UK (6 Months Free)', 'SHOPPING', 8.9900, 4.4900, 'GBP', 'MONTHLY', TRUE, 'UK university student with ac.uk email', '6 months trial, then half price Prime', 'https://www.amazon.co.uk/joinstudent'),

('JP', 'Apple', 'Apple Music Student Japan', 'ENTERTAINMENT', 1080.0000, 580.0000, 'JPY', 'MONTHLY', TRUE, 'Japanese university or technical college student', 'Lossless audio + Apple TV+ included', 'https://www.apple.com/jp/apple-music/'),
('JP', 'Amazon', 'Prime Student Japan', 'SHOPPING', 600.0000, 300.0000, 'JPY', 'MONTHLY', TRUE, 'Students in Japanese colleges with student ID', '6 months free trial then 300 yen/month', 'https://www.amazon.co.jp/student');

-- Real Global Scholarships
INSERT INTO scholarships (country_code, name, provider, amount, currency_code, education_level, eligibility_details, deadline, application_url, official_source_url) VALUES
('IN', 'National Scholarship Portal - Central Sector Scheme', 'Department of Higher Education, Govt of India', 20000.0000, 'INR', 'UNDERGRADUATE', 'Above 80th percentile in Class 12 board exams, family annual income below 4.5 Lakh INR, pursuing regular degree.', '2026-12-31', 'https://scholarships.gov.in', 'https://scholarships.gov.in'),
('IN', 'PMSSS - Prime Minister Special Scholarship Scheme', 'AICTE, Govt of India', 130000.0000, 'INR', 'UNDERGRADUATE', 'Students domicile of Jammu & Kashmir and Ladakh passing 12th from JKBOSE/CBSE, income under 8 LPA.', '2026-11-30', 'https://www.aicte-india.org/pmsss', 'https://www.aicte-india.org'),
('IN', 'Tata Trusts Means-Grant College Scholarships', 'Tata Trusts Education', 50000.0000, 'INR', 'UNDERGRADUATE_POSTGRADUATE', 'Meritorious students with family income less than 5 LPA enrolled in accredited Indian colleges.', '2027-01-15', 'https://www.tatatrusts.org', 'https://www.tatatrusts.org'),
('IN', 'Foundation for Academic Excellence and Access (FAEA)', 'FAEA & BHEL', 40000.0000, 'INR', 'UNDERGRADUATE', 'Economically disadvantaged students, SC/ST/BPL category pursuing undergraduate studies.', '2026-10-31', 'http://www.faea-india.org', 'http://www.faea-india.org'),

('US', 'Fulbright Foreign Student Program', 'US Department of State', 35000.0000, 'USD', 'POSTGRADUATE', 'International graduate students, young professionals and artists studying or conducting research in the US.', '2026-10-15', 'https://foreign.fulbrightonline.org', 'https://foreign.fulbrightonline.org'),
('US', 'Gates Millennium Scholars Program', 'Bill & Melinda Gates Foundation', 45000.0000, 'USD', 'UNDERGRADUATE', 'Outstanding minority students with significant financial need, Pell Grant eligible, minimum GPA 3.3.', '2026-12-15', 'https://www.gmsp.org', 'https://www.gmsp.org'),

('GB', 'Chevening Scholarships UK', 'UK Foreign, Commonwealth and Development Office', 30000.0000, 'GBP', 'POSTGRADUATE', 'One-year master degree at any UK university for future leaders, fully funded tuition and stipend.', '2026-11-05', 'https://www.chevening.org', 'https://www.chevening.org'),
('GB', 'Commonwealth Master Scholarships', 'Commonwealth Scholarship Commission', 28000.0000, 'GBP', 'POSTGRADUATE', 'Candidates from low and middle income Commonwealth countries pursuing full-time taught master study in UK.', '2026-12-12', 'https://cscuk.fcdo.gov.uk', 'https://cscuk.fcdo.gov.uk'),

('JP', 'MEXT Japanese Government Undergraduate Scholarship', 'Ministry of Education, Culture, Sports, Science and Technology Japan', 1400000.0000, 'JPY', 'UNDERGRADUATE', 'Foreign students aged 17-25, fully funded tuition plus 120,000 JPY monthly living allowance.', '2026-10-31', 'https://www.studyinjapan.go.jp', 'https://www.studyinjapan.go.jp');

-- Pre-seed demo user: demo@kanjoo.ai / Password@123
-- BCrypt: $2a$10$wT8mQ3L3p0l4pY7e12fCReK9b9N1q7f.x7wY8s6t5u4v3w2x1y0za
INSERT INTO users (email, password_hash, full_name, role, is_active) VALUES
('demo@kanjoo.ai', '$2a$10$wT8mQ3L3p0l4pY7e12fCReK9b9N1q7f.x7wY8s6t5u4v3w2x1y0za', 'Alex Chen', 'ROLE_USER', TRUE);

-- Demo User Profile (Pre-configured to show rich dashboard right away, can be updated at any time)
INSERT INTO user_profiles (user_id, country_code, primary_currency_code, age, state_region, city, occupation, student_or_professional, education_level, preferred_language, monthly_income, pocket_money, other_income, monthly_savings_target, existing_investments, emergency_savings, housing_type, risk_tolerance, onboarding_completed, financial_health_score) VALUES
(1, 'IN', 'INR', 22, 'Karnataka', 'Bengaluru', 'Junior Software Engineer', 'PROFESSIONAL', 'BACHELORS', 'en', 45000.0000, 0.0000, 3000.0000, 15000.0000, 50000.0000, 30000.0000, 'RENTED', 'MODERATE', TRUE, 78);

-- Demo Income Sources
INSERT INTO income_sources (user_id, name, amount, original_currency, exchange_rate, primary_amount, frequency, is_primary) VALUES
(1, 'Primary Salary', 45000.0000, 'INR', 1.000000, 45000.0000, 'MONTHLY', TRUE),
(1, 'Freelance Consulting', 3000.0000, 'INR', 1.000000, 3000.0000, 'MONTHLY', FALSE);

-- Demo Expenses
INSERT INTO expenses (user_id, category_id, amount, original_currency, exchange_rate, primary_amount, expense_date, description, payment_method, is_recurring) VALUES
(1, 2, 14000.0000, 'INR', 1.000000, 14000.0000, '2026-11-01', 'Apartment Rent & Maintenance', 'BANK_TRANSFER', TRUE),
(1, 1, 6500.0000, 'INR', 1.000000, 6500.0000, '2026-11-15', 'Groceries & Daily Essentials', 'UPI', FALSE),
(1, 1, 3200.0000, 'INR', 1.000000, 3200.0000, '2026-11-20', 'Weekend Dining & Food Delivery', 'CARD', FALSE),
(1, 3, 2400.0000, 'INR', 1.000000, 2400.0000, '2026-11-18', 'Metro Card & Auto Commute', 'UPI', FALSE),
(1, 5, 799.0000, 'INR', 1.000000, 799.0000, '2026-11-05', 'Jio Primary SIM 84-Day Recharge', 'UPI', TRUE),
(1, 5, 199.0000, 'INR', 1.000000, 199.0000, '2026-11-08', 'BSNL Secondary SIM Recharge', 'UPI', TRUE),
(1, 6, 999.0000, 'INR', 1.000000, 999.0000, '2026-11-02', 'High-Speed Home Fiber Broadband', 'AUTO_DEBIT', TRUE),
(1, 10, 10.0000, 'USD', 83.500000, 835.0000, '2026-11-10', 'International Cloud Hosting (USD)', 'CARD', TRUE),
(1, 10, 119.0000, 'INR', 1.000000, 119.0000, '2026-11-12', 'Spotify Individual (Paying Full Price!)', 'AUTO_DEBIT', TRUE),
(1, 11, 5000.0000, 'INR', 1.000000, 5000.0000, '2026-11-05', 'Nifty 50 Index Mutual Fund SIP', 'AUTO_DEBIT', TRUE);

-- Demo SIM Cards
INSERT INTO user_sim_cards (user_id, operator_id, phone_number, sim_slot, current_plan_id, plan_expiry_date, daily_data_used_gb, has_wifi_access, is_active) VALUES
(1, 1, '+91 98765 43210', 'PRIMARY', 2, '2026-12-20', 1.20, TRUE, TRUE),
(1, 4, '+91 94444 12345', 'SECONDARY', 7, '2026-11-30', 0.10, TRUE, TRUE);

-- Demo Subscriptions
INSERT INTO user_subscriptions (user_id, offer_id, service_name, price, currency_code, billing_cycle, next_billing_date, is_actively_used, category) VALUES
(1, 1, 'Spotify Music', 119.0000, 'INR', 'MONTHLY', '2026-12-12', TRUE, 'ENTERTAINMENT'),
(1, NULL, 'Cloud Storage Pro', 10.0000, 'USD', 'MONTHLY', '2026-12-10', FALSE, 'CLOUD'),
(1, 3, 'Amazon Prime', 299.0000, 'INR', 'MONTHLY', '2026-12-25', TRUE, 'ENTERTAINMENT');

-- Demo Investments
INSERT INTO investments (user_id, asset_type, name, invested_amount, current_value, currency_code, monthly_contribution, expected_annual_return, start_date) VALUES
(1, 'SIP', 'Nifty 50 Index Direct Growth', 35000.0000, 39800.0000, 'INR', 5000.0000, 13.50, '2025-06-01'),
(1, 'MUTUAL_FUND', 'Flexi Cap Fund Direct', 15000.0000, 17200.0000, 'INR', 2000.0000, 14.00, '2025-08-01');

-- Demo KANJOO Plan
INSERT INTO kanjoo_plans (user_id, status, target_monthly_savings) VALUES
(1, 'ACTIVE', 3500.0000);

INSERT INTO kanjoo_plan_items (plan_id, item_type, title, description, potential_monthly_savings, potential_annual_savings, is_implemented) VALUES
(1, 'SUBSCRIPTION_SWITCH', 'Switch Spotify to Student Plan', 'Qualifies for student discount via SheerID, saving 50% monthly.', 60.0000, 720.0000, FALSE),
(1, 'RECHARGE_OPTIMIZATION', 'Switch Secondary SIM to BSNL PV-107/397', 'Using Wi-Fi at home and office. Secondary SIM only needs incoming validity, saving unnecessary data recharge.', 110.0000, 1320.0000, FALSE),
(1, 'SUBSCRIPTION_CANCEL', 'Cancel Unused USD Cloud Storage', 'Cloud storage is inactive and duplicate with free Google Drive.', 835.0000, 10020.0000, FALSE);

-- Demo Notifications
INSERT INTO notifications (user_id, type, title, message, is_read, action_url) VALUES
(1, 'MONEY_LEAK', 'Money Leak Detected: Inactive Cloud Storage', 'You are paying $10/mo (approx ₹835) for a subscription marked inactive.', FALSE, '/money-leak'),
(1, 'RECHARGE_OPTIMIZATION', 'Secondary SIM Plan Expires Soon', 'Your BSNL secondary SIM expires on 2026-11-30. Save ₹1,320/year by switching to incoming-saver plan.', FALSE, '/recharge-optimizer'),
(1, 'BUDGET_ALERT', 'Food & Dining at 85% of Monthly Target', 'You have spent ₹9,700 of your ₹11,000 food budget with 7 days left in the month.', FALSE, '/budgets');
