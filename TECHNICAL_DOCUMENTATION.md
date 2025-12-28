# QR Switch Portal - Technical Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [Folder Structure](#folder-structure)
5. [Dependencies and Packages](#dependencies-and-packages)
6. [Features](#features)
7. [Security Implementation](#security-implementation)
8. [Configuration](#configuration)
9. [Build and Deployment](#build-and-deployment)
10. [Development Guide](#development-guide)

---

## Project Overview

**QR Switch Portal** is a comprehensive web-based management portal built with Angular 20. The application provides a multi-tenant platform for managing QR code payments, transactions, merchants, wallets, fees, users, roles, and related services. It includes real-time monitoring, audit logging, and various simulation tools for testing payment scenarios.

### Key Characteristics
- **Framework**: Angular 20.1.0 (Standalone Components Architecture)
- **Language**: TypeScript 5.8.2
- **Styling**: SCSS + Tailwind CSS 3.4.17
- **UI Framework**: Ng-Zorro Ant Design 20.3.1
- **Deployment**: Docker + Nginx

---

## Technology Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Angular** | 20.1.0 | Frontend framework |
| **TypeScript** | 5.8.2 | Programming language |
| **RxJS** | 7.8.0 | Reactive programming |
| **Zone.js** | 0.15.0 | Change detection |

### UI/UX Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| **Ng-Zorro Ant Design** | 20.3.1 | UI component library |
| **Tailwind CSS** | 3.4.17 | Utility-first CSS framework |
| **ECharts** (via ngx-echarts) | 20.0.2 | Data visualization/charts |
| **Angular Animations** | 20.1.0 | Animation support |

### Authentication & Security

| Library | Version | Purpose |
|---------|---------|---------|
| **jwt-decode** | 4.0.0 | JWT token decoding |
| **@microsoft/signalr** | 9.0.6 | Real-time communication |

### Internationalization

| Library | Version | Purpose |
|---------|---------|---------|
| **@ngx-translate/core** | 17.0.0 | i18n framework |
| **@ngx-translate/http-loader** | 17.0.0 | Translation file loader |

### Utilities

| Library | Version | Purpose |
|---------|---------|---------|
| **angularx-qrcode** | 20.0.0 | QR code generation |
| **libphonenumber-js** | 1.12.25 | Phone number validation/formatting |
| **country-flag-icons** | 1.5.21 | Country flag icons |

### Development Tools

| Tool | Version | Purpose |
|------|---------|---------|
| **Angular CLI** | 20.1.0 | Development toolkit |
| **Karma** | 6.4.0 | Test runner |
| **Jasmine** | 5.8.0 | Testing framework |
| **PostCSS** | 8.5.6 | CSS processing |
| **Autoprefixer** | 10.4.21 | CSS vendor prefixing |

---

## Architecture

### Architectural Pattern

The application follows **Feature Module Architecture** with **Standalone Components** (Angular's modern approach). Each feature is organized into self-contained modules with their own:
- Pages (components)
- Services
- Interfaces/Models
- Routing

### Key Architectural Components

#### 1. **Standalone Components Architecture**
- All components are standalone (no NgModules)
- Components use `imports` array for dependencies
- Provides better tree-shaking and smaller bundle sizes

#### 2. **Service Layer Pattern**
- Centralized business logic in services
- HTTP communication abstracted through services
- Global state management via services and RxJS signals

#### 3. **Guard-Based Route Protection**
- **AuthGuard**: Ensures user authentication
- **PermissionGuard**: Enforces role-based access control (RBAC)
- Route-level permission checks via route data

#### 4. **HTTP Interceptor Pattern**
- **authInterceptor**: Handles authentication headers, encryption/decryption, and error handling
- RSA encryption for request/response payloads (when enabled)
- Automatic token injection and refresh handling

#### 5. **Modular Structure**
```
app/
├── modules/          # Feature modules
├── shared/           # Shared components and services
├── utils/            # Utility functions
└── home/             # Main layout component
```

### Data Flow

1. **User Interaction** → Component
2. **Component** → Service (via dependency injection)
3. **Service** → HTTP Client → Interceptor
4. **Interceptor** → Encrypts request → Backend API
5. **Response** → Interceptor decrypts → Service → Component
6. **Component** → Updates UI (signals/observables)

### State Management

- **Signals**: Used for reactive state (Angular 20 feature)
- **BehaviorSubject**: For permission and module state
- **LocalStorage**: Token and user preferences
- **Services**: Centralized state via injectable services

---

## Folder Structure

```
qr-swtich-portal/
│
├── src/                                    # Source code
│   ├── app/                                # Application root
│   │   ├── app.ts                          # Root component
│   │   ├── app.config.ts                   # Application configuration
│   │   ├── app.routes.ts                   # Route definitions
│   │   ├── app.html                        # Root template
│   │   ├── app.scss                        # Root styles
│   │   │
│   │   ├── home/                           # Main layout component
│   │   │   ├── home.ts
│   │   │   ├── home.html
│   │   │   ├── home.scss
│   │   │   └── home.spec.ts
│   │   │
│   │   ├── modules/                        # Feature modules
│   │   │   ├── authentication/             # Authentication module
│   │   │   │   ├── pages/
│   │   │   │   │   ├── login/
│   │   │   │   │   ├── forget-password/
│   │   │   │   │   ├── change-password/
│   │   │   │   │   └── otp-modal/
│   │   │   │   └── services/
│   │   │   │       ├── login-serv.service.ts
│   │   │   │       └── custom-validator.ts
│   │   │   │
│   │   │   ├── dashboard/                  # Dashboard module
│   │   │   │   └── pages/dashboard/
│   │   │   │
│   │   │   ├── tenants/                    # Tenant management
│   │   │   │   ├── interfaces/tenants.ts
│   │   │   │   ├── pages/
│   │   │   │   │   ├── tenant-list/
│   │   │   │   │   └── add-tenant/
│   │   │   │   └── services/tenants.service.ts
│   │   │   │
│   │   │   ├── users/                      # User management
│   │   │   │   ├── interfaces/user.ts
│   │   │   │   ├── pages/
│   │   │   │   │   ├── user-list/
│   │   │   │   │   └── add-user/
│   │   │   │   └── services/
│   │   │   │       ├── users.service.ts
│   │   │   │       └── password-validator.ts
│   │   │   │
│   │   │   ├── roles/                      # Role & permission management
│   │   │   │   ├── interfaces/role.ts
│   │   │   │   ├── pages/
│   │   │   │   │   ├── roles-list/
│   │   │   │   │   └── add-role/
│   │   │   │   └── services/roles.service.ts
│   │   │   │
│   │   │   ├── merchants/                  # Merchant management
│   │   │   │   ├── interfaces/merchant.ts
│   │   │   │   ├── pages/
│   │   │   │   │   ├── merchant-list/
│   │   │   │   │   └── add-merchant/
│   │   │   │   └── services/merchants.service.ts
│   │   │   │
│   │   │   ├── wallets/                    # Wallet management
│   │   │   │   ├── interfaces/wallet.ts
│   │   │   │   ├── pages/
│   │   │   │   │   ├── wallet-list/
│   │   │   │   │   └── add-wallet/
│   │   │   │   └── services/wallets.service.ts
│   │   │   │
│   │   │   ├── fees/                       # Fee management
│   │   │   │   ├── interfaces/fee.ts
│   │   │   │   ├── pages/
│   │   │   │   │   ├── fees-list/
│   │   │   │   │   ├── add-fee/
│   │   │   │   │   └── simulate-fee/
│   │   │   │   └── services/
│   │   │   │       ├── fees.service.ts
│   │   │   │       └── integer-validator.ts
│   │   │   │
│   │   │   ├── transactions/               # Transaction management
│   │   │   │   ├── pages/
│   │   │   │   │   ├── transactions-list/
│   │   │   │   │   └── view-transaction/
│   │   │   │   └── services/transactions.service.ts
│   │   │   │
│   │   │   ├── auditLogs/                  # Audit logs
│   │   │   │   ├── interfaces/audit.ts
│   │   │   │   ├── pages/
│   │   │   │   │   ├── audit-logs-list/
│   │   │   │   │   └── view-audit/
│   │   │   │   └── services/auditlogs.service.ts
│   │   │   │
│   │   │   ├── loginAudits/                # Login audit logs
│   │   │   │   └── pages/login-audits-list/
│   │   │   │
│   │   │   ├── communicationlogs/          # Communication logs
│   │   │   │   ├── pages/communication-logs-list/
│   │   │   │   └── services/commlogs.service.ts
│   │   │   │
│   │   │   └── exceptionlogs/              # Exception logs
│   │   │       ├── pages/exception-logs-list/
│   │   │       └── services/exceplogs.service.ts
│   │   │
│   │   ├── shared/                         # Shared resources
│   │   │   ├── components/                 # Reusable components
│   │   │   │   ├── qr-header/              # Application header
│   │   │   │   ├── qr-sidebar/             # Navigation sidebar
│   │   │   │   ├── qr-modal/               # Modal wrapper
│   │   │   │   ├── qr-table/               # Data table
│   │   │   │   ├── qr-input/               # Input component
│   │   │   │   ├── qr-select/              # Select dropdown
│   │   │   │   ├── qr-password/            # Password input
│   │   │   │   ├── qr-date-picker/         # Date picker
│   │   │   │   ├── qr-spinner/             # Loading spinner
│   │   │   │   ├── qr-tags-input/          # Tags input
│   │   │   │   ├── qr-input-number/        # Number input
│   │   │   │   ├── qr-logs/                # Logs viewer
│   │   │   │   ├── dynamic-filter/         # Dynamic filter component
│   │   │   │   ├── table-filter/           # Table filter
│   │   │   │   ├── line-chart/             # Line chart
│   │   │   │   ├── pie-chart/              # Pie chart
│   │   │   │   ├── phone-input/            # Phone number input
│   │   │   │   ├── otp-input/              # OTP input
│   │   │   │   ├── language-switcher/      # Language switcher
│   │   │   │   ├── entity-header/          # Entity header
│   │   │   │   ├── modal-header/           # Modal header
│   │   │   │   ├── modal-footer/           # Modal footer
│   │   │   │   ├── simulator/              # General simulator
│   │   │   │   ├── p2m-simulator/          # Person-to-merchant simulator
│   │   │   │   ├── m2m-simulator/          # Merchant-to-merchant simulator
│   │   │   │   ├── wallets-simulator/      # Wallet simulator
│   │   │   │   ├── wallet-window/          # Wallet window
│   │   │   │   ├── transaction-success/    # Transaction success page
│   │   │   │   └── un-authorized/          # Unauthorized page
│   │   │   │
│   │   │   ├── services/                   # Shared services
│   │   │   │   ├── auth.service.ts         # Authentication service
│   │   │   │   ├── auth-guard.service.ts   # Route guard (auth)
│   │   │   │   ├── permission-guard.service.ts  # Route guard (permissions)
│   │   │   │   ├── global.service.ts       # Global state/service
│   │   │   │   ├── headers.interceptor.ts  # HTTP interceptor
│   │   │   │   ├── error-messages.service.ts
│   │   │   │   ├── simulator.service.ts
│   │   │   │   └── qrSimulator.service.ts
│   │   │   │
│   │   │   └── core/                       # Core interfaces
│   │   │       └── interfaces.ts
│   │   │
│   │   └── utils/                          # Utility functions
│   │       ├── rsa-crypto.ts               # RSA encryption/decryption
│   │       └── aes-decryptor.ts            # AES decryption
│   │
│   ├── assets/                             # Static assets
│   │   ├── i18n/                           # Translation files
│   │   │   ├── en.json                     # English translations
│   │   │   └── fr.json                     # French translations
│   │   ├── *.svg, *.jpg, *.png             # Images and icons
│   │   └── departments.csv                 # CSV data files
│   │
│   ├── environments/                       # Environment configuration
│   │   ├── environment.ts                  # Development environment
│   │   └── environment.prod.ts             # Production environment
│   │
│   ├── index.html                          # HTML entry point
│   ├── main.ts                             # Application bootstrap
│   └── styles.scss                         # Global styles
│
├── public/                                 # Public assets
│   └── favicon.ico
│
├── dist/                                   # Build output (generated)
│   └── qr-swtich-portal/
│       └── browser/
│
├── node_modules/                           # Dependencies (generated)
│
├── angular.json                            # Angular CLI configuration
├── package.json                            # NPM dependencies
├── package-lock.json                       # Dependency lock file
├── tsconfig.json                           # TypeScript configuration
├── tsconfig.app.json                       # App-specific TS config
├── tsconfig.spec.json                      # Test-specific TS config
├── tailwind.config.js                      # Tailwind CSS configuration
├── postcss.config.js                       # PostCSS configuration
├── Dockerfile                              # Docker build configuration
├── nginx.conf                              # Nginx server configuration
└── README.md                               # Project readme

```

### Module Structure Pattern

Each feature module typically contains:
```
module-name/
├── interfaces/              # TypeScript interfaces/models
├── pages/                   # Page components
│   ├── list-page/          # List view
│   │   ├── *.ts            # Component logic
│   │   ├── *.html          # Template
│   │   ├── *.scss          # Styles
│   │   └── *.spec.ts       # Unit tests
│   └── detail-page/        # Detail/edit view
└── services/                # Module-specific services
```

---

## Dependencies and Packages

### Production Dependencies

#### Angular Core Packages
```json
"@angular/common": "^20.1.0"
"@angular/compiler": "^20.1.0"
"@angular/core": "^20.1.0"
"@angular/forms": "^20.1.0"
"@angular/platform-browser": "^20.1.0"
"@angular/router": "^20.1.0"
```

#### UI Libraries
```json
"ng-zorro-antd": "^20.3.1"              # Ant Design component library
"ngx-echarts": "^20.0.2"                # ECharts wrapper for Angular
"tailwindcss": "^3.4.17"                # Utility CSS framework
```

#### Authentication & Security
```json
"jwt-decode": "^4.0.0"                  # JWT token decoding
"@microsoft/signalr": "^9.0.6"          # SignalR for real-time communication
```

#### Internationalization
```json
"@ngx-translate/core": "^17.0.0"        # Translation core
"@ngx-translate/http-loader": "^17.0.0" # HTTP loader for translations
```

#### Utilities
```json
"angularx-qrcode": "^20.0.0"            # QR code generation
"libphonenumber-js": "^1.12.25"         # Phone number utilities
"country-flag-icons": "^1.5.21"         # Country flag icons
"rxjs": "~7.8.0"                        # Reactive extensions
"zone.js": "~0.15.0"                    # Zone.js for change detection
"tslib": "^2.3.0"                       # TypeScript runtime library
```

### Development Dependencies

```json
"@angular/build": "^20.1.0"
"@angular/cli": "^20.1.0"
"@angular/compiler-cli": "^20.1.0"
"@types/jasmine": "~5.1.0"
"autoprefixer": "^10.4.21"
"jasmine-core": "~5.8.0"
"karma": "~6.4.0"
"karma-chrome-launcher": "~3.2.0"
"karma-coverage": "~2.2.0"
"karma-jasmine": "~5.1.0"
"karma-jasmine-html-reporter": "~2.1.0"
"postcss": "^8.5.6"
"tailwindcss": "^3.4.17"
"typescript": "~5.8.2"
```

### Dependency Management

- **Package Manager**: npm (package-lock.json present)
- **Node Version**: Not specified (Angular 20 typically requires Node 18+)
- **Lock File**: package-lock.json ensures consistent installs

---

## Features

### 1. Authentication & Authorization

#### Authentication Features
- **Login**: Email/username and password authentication
- **OTP Verification**: One-time password verification for secure login
- **Forgot Password**: Password recovery functionality
- **Change Password**: User password change
- **JWT Token Management**: Token storage and automatic injection
- **Session Management**: Automatic session expiration handling

#### Authorization Features
- **Role-Based Access Control (RBAC)**: Permission-based route protection
- **Route Guards**: 
  - `AuthGuard`: Ensures user is authenticated
  - `PermissionGuard`: Checks user permissions before route access
- **Permission Checking**: Component-level permission checks
- **Multi-tenant Support**: Tenant isolation and management

### 2. Tenant Management
- List all tenants
- Create new tenants
- Edit tenant details
- Tenant lookup services
- Tenant-specific configurations

### 3. User Management
- User listing with pagination and filters
- Create/Edit users
- User assignment to tenants and roles
- Password validation and management
- User count statistics

### 4. Role & Permission Management
- Role listing and management
- Permission assignment to roles
- Resource-based permissions
- Permission lookup
- Role-based access control integration

### 5. Merchant Management
- Merchant listing
- Create/Edit merchants
- Merchant lookup
- Merchant-specific configurations
- MCC (Merchant Category Code) management

### 6. Wallet Management
- Wallet listing and management
- Create/Edit wallets
- Wallet lookup
- Active wallet retrieval for simulators
- Wallet balance and transaction history

### 7. Fee Management
- Fee listing and configuration
- Create/Edit fees
- Fee simulation
- Fee lookup services
- Fee calculation and application

### 8. Transaction Management
- Transaction listing with filters
- View transaction details
- Transaction search and filtering
- Transaction status tracking
- Transaction statistics (on dashboard)

### 9. Logging & Auditing

#### Audit Logs
- Comprehensive audit log listing
- View detailed audit log entries
- Filter audit logs by various criteria
- Track all system changes and user actions

#### Login Audits
- Login attempt tracking
- Failed login monitoring
- User session tracking

#### Communication Logs
- API communication logging
- Request/response tracking
- Communication error monitoring

#### Exception Logs
- Exception tracking and monitoring
- Error logging and reporting
- System error visibility

### 10. Dashboard
- Overview statistics (tenants, users, transactions, revenue)
- Chart visualizations (line charts, pie charts)
- Quick access to common actions
- Permission-based dashboard widgets
- Real-time data updates

### 11. QR Code Management
- QR code generation (Scheme A & Scheme B)
- QR code scanning and parsing
- Merchant QR code generation
- QR code payment processing
- QR code simulation tools

### 12. Simulators

#### General Simulator
- General payment scenario simulation

#### P2M Simulator (Person-to-Merchant)
- Simulate person-to-merchant transactions
- Test payment flows
- Validate merchant payment scenarios

#### M2M Simulator (Merchant-to-Merchant)
- Simulate merchant-to-merchant transactions
- Business-to-business payment testing

#### Wallet Simulator
- Wallet operation simulation
- Balance management testing
- Wallet transaction testing

### 13. Internationalization (i18n)
- **Supported Languages**: English (en), French (fr)
- Language switching functionality
- Translation management via JSON files
- Locale-aware date/time formatting
- Language persistence in localStorage

### 14. UI Components Library

#### Form Components
- `qr-input`: Custom input component
- `qr-password`: Password input with visibility toggle
- `qr-select`: Select dropdown component
- `qr-date-picker`: Date picker component
- `qr-input-number`: Number input component
- `qr-tags-input`: Tags/multi-select input
- `phone-input`: Phone number input with country selection
- `otp-input`: OTP verification input

#### Layout Components
- `qr-header`: Application header with navigation
- `qr-sidebar`: Sidebar navigation menu
- `qr-modal`: Modal dialog wrapper
- `modal-header`: Modal header component
- `modal-footer`: Modal footer component
- `entity-header`: Entity detail page header

#### Data Display Components
- `qr-table`: Data table with pagination, sorting, filtering
- `table-filter`: Advanced table filtering
- `dynamic-filter`: Dynamic filter component with multiple filter types
- `line-chart`: Line chart visualization
- `pie-chart`: Pie chart visualization
- `qr-logs`: Log viewer component

#### Utility Components
- `qr-spinner`: Loading spinner/indicator
- `language-switcher`: Language selection component
- `transaction-success`: Transaction success page
- `un-authorized`: Unauthorized access page

### 15. Utility Features
- **Dynamic Filtering**: Advanced filtering with multiple filter types (select, switch, date, date range)
- **Responsive Design**: Mobile-friendly layouts
- **Loading States**: Global and component-level loading indicators
- **Error Handling**: Centralized error handling and display
- **Form Validation**: Custom validators for various inputs
- **Data Export**: CSV and other export capabilities (departments.csv example)

---

## Security Implementation

### 1. Authentication Security

#### JWT Token Management
- Tokens stored in `localStorage`
- Automatic token injection via HTTP interceptor
- Token decoding and permission extraction
- Automatic logout on 401 responses

#### OTP Verification
- One-time password for additional security
- OTP resend functionality
- OTP expiration handling

### 2. Request/Response Encryption

#### RSA Encryption
- **Implementation**: Custom RSA encryption/decryption utilities (`rsa-crypto.ts`)
- **Public Key Encryption**: Request bodies encrypted with RSA public key
- **Private Key Decryption**: Response bodies decrypted with RSA private key
- **Configurable**: Encryption can be enabled/disabled via environment config
- **Selective Encryption**: Certain endpoints can bypass encryption (e.g., identity endpoints)

#### Encryption Flow
```
Request:
  Component → Service → HTTP Client → Interceptor → Encrypt (RSA) → Backend

Response:
  Backend → Encrypted Response → Interceptor → Decrypt (RSA) → Service → Component
```

#### Encryption Configuration
- `hyperText`: Boolean flag to enable/disable encryption
- `rsaPublicKey`: RSA public key for encryption
- `rsaPrivateKey`: RSA private key for decryption
- `X-HyperText` header: Indicates encryption support

### 3. Route Protection

#### Authentication Guard
- Checks for valid JWT token
- Redirects to login if unauthenticated
- Applied to protected routes

#### Permission Guard
- Checks user permissions from JWT token
- Route-level permission requirements via `data.permission`
- Redirects to unauthorized page if permission denied

### 4. HTTP Interceptor Security

#### Headers Interceptor (`headers.interceptor.ts`)
- **Authorization Header**: Automatic Bearer token injection
- **Accept-Language**: Language preference header
- **X-HyperText Header**: Encryption capability indicator
- **Request Encryption**: RSA encryption of request bodies
- **Response Decryption**: RSA decryption of response bodies
- **Error Handling**: 401 handling and automatic logout

### 5. Input Validation

#### Custom Validators
- `custom-validator.ts`: Custom validation rules
- `password-validator.ts`: Password strength validation
- `integer-validator.ts`: Integer input validation
- Phone number validation via `libphonenumber-js`

### 6. Data Protection
- Sensitive data encrypted in transit (RSA)
- Keys stored in environment configuration
- No sensitive data in localStorage (except token)
- Secure token storage

---

## Configuration

### Environment Configuration

#### Development Environment (`src/environments/environment.ts`)
```typescript
{
  production: false,
  baseApiUrl: 'https://gimuat.gimpay.org:6023',
  publicEncryptionKey: 'C0h5IzJdVlVG9rSEAgkqpQRY3slHuDFsLsZD/v7nYF4=',
  rsaPublicKey: '...',
  rsaPrivateKey: '...',
  isSimulatorEnabled: true,
  hyperText: true
}
```

#### Production Environment (`src/environments/environment.prod.ts`)
- Similar structure with production API URLs
- Production encryption keys
- Simulator enabled/disabled flag

### Angular Configuration (`angular.json`)

#### Build Configuration
- **Output**: `dist/qr-swtich-portal/browser`
- **Assets**: `src/assets`
- **Styles**: `src/styles.scss` (SCSS)
- **Polyfills**: `zone.js`

#### Budget Limits
- Initial bundle: 6MB warning, 7MB error
- Component styles: 3MB warning, 5MB error

#### Build Options
- **Production**: Full optimization, output hashing
- **Development**: No optimization, source maps enabled

### TypeScript Configuration (`tsconfig.json`)

#### Strict Mode
- `strict: true`
- `noImplicitOverride: true`
- `noPropertyAccessFromIndexSignature: true`
- `noImplicitReturns: true`
- `noFallthroughCasesInSwitch: true`

#### Compiler Options
- Target: `ES2022`
- Module: `preserve` (for modern Angular)
- Experimental decorators enabled
- Import helpers enabled

#### Angular Compiler Options
- Strict injection parameters
- Strict input access modifiers
- Type-checked host bindings
- Strict templates

### Tailwind CSS Configuration (`tailwind.config.js`)

```javascript
{
  content: ["./src/**/*.{html,ts}"],
  theme: { extend: {} },
  plugins: []
}
```

### Nginx Configuration (`nginx.conf`)

```nginx
server {
  listen 80;
  server_name _;
  root /usr/share/nginx/html;
  index index.html;
  
  location / {
    try_files $uri $uri/ /index.html;  # SPA routing support
  }
}
```

### Docker Configuration (`Dockerfile`)

```dockerfile
FROM nginx:alpine
COPY dist/qr-swtich-portal/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## Build and Deployment

### Development Build

```bash
# Install dependencies
npm install

# Start development server
npm start
# or
ng serve

# Development server runs on http://localhost:4200
```

### Production Build

```bash
# Build for production
npm run build
# or
ng build

# Output: dist/qr-swtich-portal/browser/
```

### Docker Deployment

#### Build Docker Image
```bash
docker build -t qr-switch-portal .
```

#### Run Docker Container
```bash
docker run -d -p 80:80 qr-switch-portal
```

#### Docker Compose (if applicable)
- Nginx serves the built Angular application
- Port 80 exposed
- SPA routing supported via nginx configuration

### Build Artifacts

Production build generates:
- `dist/qr-swtich-portal/browser/` - Deployable application
- Optimized and minified JavaScript bundles
- Optimized CSS
- Assets (images, i18n files, etc.)
- `index.html` - Entry point
- Source maps (if enabled in development)

### Deployment Checklist

1. ✅ Build production bundle: `ng build`
2. ✅ Configure environment variables (API URLs, keys)
3. ✅ Build Docker image (if using Docker)
4. ✅ Configure Nginx (if deploying manually)
5. ✅ Set up SSL/TLS (recommended for production)
6. ✅ Configure CORS on backend if needed
7. ✅ Verify environment configuration
8. ✅ Test authentication flow
9. ✅ Verify encryption keys are correctly set

---

## Development Guide

### Setting Up Development Environment

#### Prerequisites
- Node.js 18+ (recommended: LTS version)
- npm (comes with Node.js)
- Angular CLI (installed globally or via npx)

#### Initial Setup
```bash
# Clone repository
git clone <repository-url>
cd qr-swtich-portal

# Install dependencies
npm install

# Start development server
npm start
```

### Code Structure Guidelines

#### Component Structure
- **Standalone Components**: All components are standalone
- **File Naming**: kebab-case (e.g., `user-list.ts`)
- **Component Class Naming**: PascalCase (e.g., `UserList`)
- **Template Files**: `.html`
- **Style Files**: `.scss`
- **Test Files**: `.spec.ts`

#### Service Structure
- Services are injectable singletons
- Use `providedIn: 'root'` for app-wide services
- Services handle HTTP communication
- Services manage business logic

#### Module Organization
- One feature = One module folder
- Each module contains: pages, services, interfaces
- Shared components in `shared/components`
- Shared services in `shared/services`

### Adding New Features

#### 1. Create Feature Module Structure
```
src/app/modules/new-feature/
├── interfaces/
│   └── new-feature.ts
├── pages/
│   ├── new-feature-list/
│   └── add-new-feature/
└── services/
    └── new-feature.service.ts
```

#### 2. Create Components
```bash
ng generate component modules/new-feature/pages/new-feature-list
```

#### 3. Create Service
```bash
ng generate service modules/new-feature/services/new-feature
```

#### 4. Add Routes
Update `src/app/app.routes.ts`:
```typescript
{
  path: 'new-feature',
  component: NewFeatureList,
  canActivate: [PermissonGuard],
  data: { permission: 'NewFeature.ViewNewFeature' }
}
```

#### 5. Add Translations
Update `src/assets/i18n/en.json` and `fr.json`

### Testing

#### Unit Tests
```bash
npm test
# or
ng test
```

- Tests use Karma + Jasmine
- Test files: `*.spec.ts`
- Coverage reports generated

#### Running Tests
- Tests run in Chrome by default
- Watch mode available for continuous testing
- Coverage reports: `coverage/` directory

### Code Style

#### TypeScript
- Strict mode enabled
- Use interfaces for data models
- Prefer signals for reactive state (Angular 20)
- Use dependency injection for services

#### HTML Templates
- Use Angular template syntax
- Prefer structural directives over ngIf/ngFor
- Use async pipe for observables

#### SCSS
- Component-scoped styles
- Use Tailwind utilities where possible
- Global styles in `styles.scss`

### Common Development Tasks

#### Adding a New Route
1. Create component
2. Add route to `app.routes.ts`
3. Add navigation link in sidebar
4. Add permission guard if needed

#### Adding a New API Endpoint
1. Add method to relevant service
2. Service method returns Observable
3. Component subscribes to Observable
4. Handle loading states and errors

#### Adding Internationalization
1. Add key-value pairs to `en.json` and `fr.json`
2. Use `TranslateModule` in component
3. Use `translate` pipe or service in template/component

#### Adding a Shared Component
1. Create component in `shared/components/`
2. Export component class
3. Import where needed
4. Add to component's `imports` array

### Debugging

#### Development Tools
- Angular DevTools browser extension
- Browser developer tools
- Source maps enabled in development
- Console logging (remove in production)

#### Common Issues
- **CORS Errors**: Configure backend CORS settings
- **401 Errors**: Check token validity, refresh token
- **Encryption Errors**: Verify RSA keys in environment
- **Routing Issues**: Check route guards and permissions

### Best Practices

1. **Dependency Injection**: Always use DI, avoid direct instantiation
2. **Observable Handling**: Always unsubscribe or use async pipe
3. **Error Handling**: Implement try-catch and error handlers
4. **Type Safety**: Use TypeScript strictly, avoid `any`
5. **Code Reusability**: Extract common logic to services/components
6. **Performance**: Use OnPush change detection where possible
7. **Security**: Never commit sensitive keys, use environment variables
8. **Testing**: Write unit tests for services and components
9. **Documentation**: Document complex logic and APIs
10. **Accessibility**: Follow WCAG guidelines for UI components

---

## Additional Resources

### API Integration
- Base API URL: Configured in environment files
- Authentication: JWT Bearer tokens
- Encryption: RSA encryption for request/response bodies
- Language: `Accept-Language` header

### External Services
- QR Code Generation API: `https://gimuat.gimpay.org:6033`
- Scheme A Payments: `/schemeA/pay-from-qr`
- Scheme B QR Generation: `/schemeB/generate-qr`
- QR Parsing: `/schemeB/parse`

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2022 support required
- No IE11 support (Angular 20 requirement)

### Performance Considerations
- Bundle size monitoring via budgets
- Lazy loading opportunities (feature modules could be lazy-loaded)
- Tree-shaking enabled (standalone components)
- Production builds optimized and minified

---

## Version Information

- **Application Name**: QR Switch Portal
- **Angular Version**: 20.1.0
- **Node Version Required**: 18+ (recommended: LTS)
- **TypeScript Version**: 5.8.2
- **Build Tool**: Angular CLI 20.1.0

---

## License

[Add license information if applicable]

---

## Contact & Support

[Add contact information if applicable]

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]  
**Maintained By**: Development Team

