# Staxiom Demo - Project Structure

## Overview
This is a React application for R&D tax credit estimation and onboarding.

## Folder Structure

```
src/
├── components/
│   ├── auth/              # Authentication components
│   │   ├── SignIn.jsx
│   │   └── SignIn.css
│   │
│   ├── estimation/        # Tax credit estimation flow
│   │   ├── CompanyInfo.jsx
│   │   ├── EstimationFlow.jsx
│   │   └── EstimationResults.jsx
│   │
│   ├── onboarding/        # Onboarding process components
│   │   ├── OnboardingFlow.jsx    # Main onboarding orchestrator
│   │   ├── QualificationQuestions.jsx
│   │   ├── CompanyDetails.jsx
│   │   ├── PayrollProvider.jsx
│   │   ├── AccountingProvider.jsx
│   │   ├── SourceCodeRepository.jsx
│   │   ├── UploadDocuments.jsx
│   │   ├── ConfirmReview.jsx
│   │   ├── DownloadReport.jsx
│   │   └── [CSS files for each component]
│   │
│   └── shared/            # Shared/reusable components
│       ├── PricingPlans.jsx
│       ├── Recommendations.jsx
│       └── UpsellServices.jsx
│
├── services/              # Business logic and API services
│   ├── fileUploadService.js
│   ├── payrollService.js
│   ├── accountingService.js
│   └── repositoryService.js
│
├── config/                # Configuration files
│   ├── documentTypes.js
│   ├── payrollProviders.js
│   ├── accountingProviders.js
│   └── repositoryProviders.js
│
├── styles/                # Global styles (currently empty)
├── assets/                # Images, icons, etc. (currently empty)
├── App.jsx               # Main app component
├── App.css               # App-level styles
└── index.jsx             # Entry point
```

## Component Organization

- **auth/**: Contains sign-in and authentication related components
- **estimation/**: Handles the initial R&D credit estimation flow
- **onboarding/**: Contains all steps of the detailed onboarding process
- **shared/**: Reusable components used across different flows

## Import Aliases

The project uses Vite aliases for cleaner imports:
- `@/` - points to `src/`
- `@components/` - points to `src/components/`
- `@styles/` - points to `src/styles/`
- `@assets/` - points to `src/assets/`

Example:
```javascript
import { SignIn } from '@components/auth';
```