# Staxiom R&D Tax Credit Application Flow

## Application Flow Overview

### 1. Authentication (Pages 1-2)
- **Sign-in page**: Welcome back to Staxiom with Google sign-in option
- **Registration page**: Start claiming your R&D Tax Today

### 2. Estimation Flow (Pages 3-5)
1. **Company Information** (page 2)
   - Company Name
   - Year of Incorporation
   - Number of U.S. Full-Time Employees
   - Estimated Avg Salary for U.S. Full-time Employee
   - In What State is the Company Doing Business?

2. **Estimation Result** (page 3)
   - Shows: "You can claim up to $40,000 in Federal R&D Credits"
   - Next Steps section with Connect, Upload, Claim
   - Options: "Assign to your Accountant" or "Next"

3. **Pricing Selection** (page 4)
   - Flexible Pricing Plan for Every Company
   - Two plans:
     - Staxiom Base: $500 per tax filing
     - Staxiom Pro: 20% total credits used

### 3. Onboarding Flow (Pages 6-15)
1. **Qualifying Questions** (page 5)
   - "Has your company generated any profit yet?" (Yes/No)

2. **Company Details** (page 6)
   - Company Name on Tax Return
   - Primary Business State
   - Federal Employer Identification Number
   - Company Type
   - Accounting Basis (Accrual/Cash)

3. **Payroll Integration** (page 7)
   - Connect to: Gusto, Quickbooks Payroll, Justworks, Rippling, ADP, Paychex
   - Opens OAuth login popup (page 8)

4. **Accounting Integration** (page 10)
   - Connect to: Quickbooks Online/Desktop, Xero, Sage, FreshBooks, Wave

5. **Source Code Repository** (page 11)
   - Connect to: GitHub, Bitbucket, Assembla, Sourceforge, ProjectLocker, GitLab

6. **Document Upload** (page 12-13)
   - Upload R&D Related Documents
   - SMART DOCS system recognizes file types
   - Required documents:
     - 2020/2019 Federal Tax Return
     - 2020/2019 State Tax Return
     - Employee Job Titles
     - Company Organization Chart
     - Project Patents/Briefs

7. **Review & Submit** (page 14)
   - One Last Step Before Submission
   - Shows all collected information
   - Company info, Payroll, Accounting, Source Code, Documents

8. **Success** (page 15)
   - "We're excited for this journey to help claim your R&D Credits"
   - Options: Visit Dashboard or Contact Us
   - Will include AI processing animation (0-100%)
   - Download report functionality

## Technical Implementation Notes

### State Management
- User authentication state
- Company information
- Selected plan
- Integration connections
- Uploaded documents
- Progress tracking through multi-step flow

### Key Features
- OAuth integration popups (simulated)
- Drag-and-drop file upload
- Progress sidebar navigation
- Tax credit calculation
- AI processing animation
- PDF report generation/preview