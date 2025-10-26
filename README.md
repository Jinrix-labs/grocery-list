# Simple Shopping List

A mobile-first Progressive Web App (PWA) for creating and managing shopping lists with budget tracking.

## Features

- ✅ **Simple Interface** - Just type what you need, no complex menus
- 📱 **Mobile-First Design** - Optimized for phone usage
- 💰 **Budget Tracking** - Set a budget and track spending
- 📝 **Quantity Support** - Add quantities for each item
- 💵 **Price Tracking** - Add prices as you shop
- ✅ **Check-off Items** - Mark items as purchased
- 📊 **Running Total** - See total spent vs budget
- 🔄 **PWA Support** - Install as a native app
- 📱 **Offline Support** - Works without internet

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express
- **UI**: Tailwind CSS + Radix UI
- **Database**: Neon PostgreSQL (optional - works with in-memory fallback)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Jinrix-labs/grocery-list.git
cd grocery-list
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5000](http://localhost:5000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Manual Deployment

The app builds to static files and can be deployed to any static hosting service.

## Usage

1. **Add Items**: Type what you need and press Enter
2. **Set Budget**: Enter your budget amount (optional)
3. **Adjust Quantities**: Click "Qty: X" to change quantities
4. **Add Prices**: Click "Add price" to enter actual prices
5. **Check Off**: Click the checkbox when you get an item
6. **Track Spending**: See your running total vs budget

## PWA Installation

- **Mobile**: Look for "Add to Home Screen" prompt
- **Desktop**: Click install icon in browser address bar

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details
