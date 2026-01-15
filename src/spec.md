# My Expenses - Luxury Personal Finance App

A mobile-first personal finance application for tracking expenses, managing friend balances, and settling debts with a premium dark UI experience. Optimized as a Progressive Web App (PWA) for Android installation.

## Core Features

### Tab 1: Expenses
- Add, edit, and delete personal expenses
- Fields: Item name, Amount (₹), Date, Who paid (Me or Friend)
- Friend selection from existing friends list
- Payment logic:
  - If "Me" paid: adds to Personal Expenses and Total Expenses
  - If "Friend" paid: adds to Personal Expenses and Total Expenses, records as borrowed amount on friend's account
- Real-time updates to all related calculations and views

### Tab 2: Friends
- Add friends by name
- Friends list view showing net balance summary for each friend
- Tapping on any friend card navigates to Friend Detail Page
- Individual friend detail view with:
  - Friend's name prominently displayed at the top
  - Current balance clearly shown (green if positive/lent, red if negative/borrowed)
  - Chronological list of all transactions (Borrowed in red, Lent in green)
  - Floating "Add Transaction" button styled with luxury theme
  - Add Transaction Form with:
    - Selection between Borrowed or Lent
    - Inputs for Amount (₹), Item, and Date
    - Save functionality that creates new transaction and recalculates balances
  - Edit and delete options for each transaction with respective modals/forms
- Auto-calculated totals: borrowed amount, lent amount, net balance per friend
- Smooth luxury-style animations for all UI transitions (navigation, adding/editing/deleting)

### Tab 3: Summary
**My Summary Section:**
- My Personal Expenses (total money spent on user)
- My Total Expenses (net money lost)
- Total Expenses calculation: (Money paid for self + Money paid for friends + Money friends paid for user) - (Money friends paid back)
- Expandable breakdown by month, item, friend, and date

**Friends Summary Section:**
- Overall total borrowed across all friends
- Overall total lent across all friends
- Combined view of all friend balances

### Tab 4: Settlement
- Record repayment transactions between user and friends
- Fields: Friend selection, Payment direction (I paid friend / Friend paid me), Amount (₹), Date
- Settlement logic:
  - "Friend paid me": reduces friend balance and reduces Total Expenses
  - "I paid friend": reduces friend balance only
- Edit and delete settlement records
- Instant updates across all related tabs and calculations

## PWA Features

### Manifest Configuration
- App name: "My Expenses"
- Short name: "Expenses"
- Display mode: standalone
- Theme color: deep black
- Background color: deep black
- App icons including the provided wallet icon for various sizes

### Installation Support
- Custom install prompt detection for Android devices
- Install button or banner when installation is available
- Proper meta tags for Android PWA support including theme-color
- Splash screen configuration with deep black background

### Offline Functionality
- Service worker implementation for robust offline caching
- Cache assets, pages, and API data for offline access
- Smooth user experience when offline with cached data
- Background sync capabilities when connection is restored

### Responsive Design
- Optimized for various Android screen sizes
- Maintains smooth animations and navigation transitions post-installation
- Touch-friendly interface optimized for mobile interaction

## Data Storage
- All data persisted in backend storage
- Backend stores: expenses, friends, transactions, settlements
- Backend operations: CRUD operations for all data types, balance calculations, summary aggregations

## UI/UX Requirements
- Mobile-first responsive design
- Dark luxury theme:
  - Deep black backgrounds
  - Dark glass effect cards
  - White and grey text
  - Green for money received/positive balances
  - Red for money owed/negative balances
- Smooth animations and transitions throughout
- Premium feel with luxury styling
- Instant cache refresh using React Query hooks
- App content language: English
