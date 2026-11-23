# KANJOO – GLOBAL AI PERSONAL FINANCE INTELLIGENCE SYSTEM
> **Tagline:** *"Your Money. Your Needs. Your Smarter Decisions."*

---

## 1. Executive Summary & Vision

Traditional personal expense trackers merely record historical cash outflows. **KANJOO** is a global fintech platform and autonomous financial intelligence system that understands:
- Where money originates and where it flows.
- What users genuinely need versus what they are unnecessarily paying for.
- Telecom tariffs, multi-SIM validity nuances, and Wi-Fi data wastage.
- Verified student discounts, developer perks, and educational grants.
- Pre-purchase affordability decisions via the **"Before You Spend"** cooling-off engine.
- Direct cash leakage via the **"Money Leak Detector"**.

### Core Guiding Principle
> *"Never recommend a financial product, subscription or service simply because it is available. Recommend it only when it matches the user's actual needs and financial situation."*

---

## 2. Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, Lucide Icons, Recharts, Responsive Modern Luxury Fintech UI (Deep Navy `#0B0F19`, Cyan `#38BDF8`, Indigo `#6366F1`, Emerald `#10B981`).
- **Backend**: Java 21/25, Spring Boot 3.3.5, Spring Security 6, Spring Data JPA, Hibernate, JWT (JJWT 0.12.5), Bean Validation, SpringDoc OpenAPI / Swagger UI.
- **Database**: PostgreSQL 16 relational database with Flyway schema migrations (`V1__init_schema.sql`, `V2__seed_global_data.sql`). Seamless out-of-the-box local execution using in-memory PostgreSQL compatibility mode.
- **AI Layer**: Configurable Google Gemini LLM API client + high-intelligence deterministic financial reasoning engine (ensuring 100% reliability with zero hallucinations and accurate primary currency conversions).
- **Architecture**: Strict decoupling between client presentation, REST gateway, deterministic calculation engines, and persistence.

---

## 3. Global Country & Currency System (ISO 4217)

- **One-time Onboarding**: User selects country of residence once during registration or guided onboarding.
- **Auto Currency Detection**: Automatically identifies official ISO 4217 currency code, symbol, name, and decimal precision.
- **Precise Decimal Arithmetic**: Zero floating-point rounding errors. All calculations use `java.math.BigDecimal` with explicit scale:
  - 0 Decimals: Japanese Yen (JPY - ¥)
  - 2 Decimals: US Dollar (USD - $), Indian Rupee (INR - ₹), Euro (EUR - €), British Pound (GBP - £), UAE Dirham (AED), CAD, AUD, SGD.
  - 3 Decimals: Kuwaiti Dinar (KWD - KD), BHD, OMR.
- **Historical Rate Integrity**: Multi-currency transactions record the original amount, transaction currency, and historical exchange rate at entry time.

---

## 4. Key Functional Modules

| Module | Purpose |
|---|---|
| **Executive Dashboard** | Real-time cash flow overview, verified income, expenses, disposable surplus, Financial Health Score gauge (0-100), and quick action portals. |
| **Expense Intelligence** | Multi-currency transaction logging, automatic primary currency conversion, category filtering, and one-click CSV export. |
| **Smart Recharge Optimizer** | Telecom comparison engine across India (Jio, Airtel, Vi, BSNL), USA (T-Mobile, Verizon, AT&T), UK (EE, O2, Vodafone), and Japan (Docomo, povo, LINEMO). Calculates daily cost ($Price / ValidityDays$), monthly and annual equivalents, cost per GB, and detects secondary incoming-saver plans for Wi-Fi users. |
| **Offers & Subscriptions** | AI need-based valuation. Detects inactive subscriptions, duplicate platforms, and matches users against verified student discounts (Spotify Student, Prime Student, GitHub Student Pack, YouTube Student). |
| **Scholarship Finder** | Country-specific educational assistance matcher (PMSSS, NSP, Tata Trusts in India; Fulbright, Gates in US; Chevening in UK; MEXT in Japan) with deadline tracking and bookmarking. |
| **Investment & SIP Engine** | Wealth portfolio tracking and interactive compound growth simulator based on $M \times \frac{(1+i)^n - 1}{i} \times (1+i)$. |
| **KANJOO AI Assistant** | Grounded conversational chatbot using authorized profile context and deterministic calculations. |
| **Money Leak Detector** | Signature feature detecting inactive subscriptions, overpaid telecom tariffs, and dining leakages with monthly/annual savings and one-click plan integration. |
| **Before You Spend** | Signature pre-purchase simulator evaluating planned purchases against cash surplus and emergency cushions with anti-impulse cooling rules. |
| **What-If Simulator** | Simulates dining expense cuts, subscription cancellations, or savings boosts with 5-year wealth compounding projections. |
| **My KANJOO Plan** | Central personal financial plan aggregating chosen recommendations with interactive implementation tracking. |
| **Reports & Analytics** | Daily, weekly, monthly, and annual reports with Recharts category distributions, trend bars, and CSV export. |

---

## 5. Getting Started & Local Execution

### Prerequisites
- JDK 21 or JDK 25
- Apache Maven 3.8+
- Node.js 18+ and npm

### 1. Launch Spring Boot Backend
```bash
cd kanjoo-backend
mvn clean compile
mvn test
mvn spring-boot:run
```
- The backend starts on `http://localhost:8080`.
- Swagger API Docs: `http://localhost:8080/swagger-ui.html`
- OpenAPI Specification: `http://localhost:8080/api-docs`
- In-memory Database Console: `http://localhost:8080/h2-console`

### 2. Launch Next.js Frontend
```bash
cd kanjoo-frontend
npm install
npm run dev
```
- Open `http://localhost:3000` in your browser.

### 3. Demo Test Account
- **Email:** `demo@kanjoo.ai`
- **Password:** `Password@123`
- Pre-seeded with authentic multi-SIM data, subscriptions, and investments. Or register a new user in any country (USA, UK, Japan, Germany, UAE, India) to experience country-specific currency adaptations!

---

## 6. Docker Containerized Deployment

To launch the full production stack with PostgreSQL 16:
```bash
docker-compose up --build
```
- PostgreSQL: `localhost:5432`
- Spring Boot Backend: `localhost:8080`
- Next.js Frontend: `localhost:3000`
