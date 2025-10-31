# BookIt: Experiences & Slots

A complete fullstack web application for booking travel experiences with available time slots. Built with React, TypeScript, Node.js, and PostgreSQL.

## 🚀 Live Demo

- **Frontend**: https://highway-del-assign.vercel.app/
- **Backend API**: https://highway-del-assign.onrender.com/

## 📋 Features

- Browse travel experiences with beautiful imagery
- View detailed experience information with dynamic slot availability
- Select dates and time slots with real-time availability updates
- Apply promo codes for discounts (SAVE10, FLAT100)
- Complete booking flow with form validation
- Responsive design (mobile, tablet, desktop)
- Loading states and error handling
- Prevent double-booking with database locking

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Lucide React for icons
- Axios for API calls

### Backend
- Node.js with Express
- MongoDB database
- CORS enabled
- Input validation
- Transaction management

## 📁 Project Structure


## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB 
- npm or yarn

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/bookit.git
cd bookit/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Create .env file**
```bash
cp .env.example .env
```

4. **Configure environment variables**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bookit
NODE_ENV=development
```

5. **Start the server**
```bash
npm start
```

The backend will:
- Create necessary database tables automatically
- Seed initial data (experiences and slots)
- Run on http://localhost:5000

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd ../frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Update API endpoint**

Edit `src/App.tsx` and update the API_BASE constant:
```typescript
const API_BASE = 'http://localhost:5000/api';
```

4. **Start development server**
```bash
npm run dev
```

Frontend will run on http://localhost:5173

## 🔌 API Endpoints

### Experiences

**GET /api/experiences**
- Returns list of all experiences
- Response: Array of experience objects

**GET /api/experiences/:id**
- Returns detailed experience info with available slots
- Response: Experience object with dates and slots array

### Bookings

**POST /api/bookings**
- Creates a new booking
- Body: 
```json
{
  "experienceId": 1,
  "date": "2025-10-22",
  "time": "09:00 am",
  "quantity": 2,
  "fullName": "John Doe",
  "email": "john@example.com",
  "promoCode": "SAVE10",
  "discountAmount": 100,
  "subtotal": 1000,
  "taxes": 50,
  "total": 950
}
```
- Response: Booking confirmation object

**GET /api/bookings/:id**
- Returns booking details
- Response: Booking object with experience details

### Promo Codes

**POST /api/promo/validate**
- Validates promo code and calculates discount
- Body:
```json
{
  "code": "SAVE10",
  "subtotal": 1000
}
```
- Response:
```json
{
  "valid": true,
  "discount": 100,
  "description": "10% off"
}
```



## 🎨 Design Implementation

The application matches the Figma design with:
- Exact color palette (yellow #FCD34D, gray shades)
- Consistent typography and spacing
- Responsive breakpoints (mobile, tablet, desktop)
- Component states (hover, active, disabled, sold-out)
- Loading indicators
- Success/failure messages

## 🔐 Security Features

- SQL injection prevention using parameterized queries
- Email validation
- Required field validation
- Database transaction locking for slot booking
- CORS configuration
- Environment variable protection

## 🚢 Deployment

### Backend (Render/Railway)

1. Create new MongoDB database
2. Create new web service
3. Connect GitHub repository
4. Set environment variables:
   - `DATABASE_URL`
   - `NODE_ENV=production`
5. Deploy

### Frontend (Vercel)

1. Connect GitHub repository
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variable:
   - `VITE_API_URL=https://your-backend-url.com/api`
6. Deploy

## 🧪 Testing

### Manual Testing Checklist

- [ ] Browse experiences on home page
- [ ] Search functionality
- [ ] Navigate to experience details
- [ ] Select different dates
- [ ] Select available time slots
- [ ] Sold-out slots are disabled
- [ ] Quantity increment/decrement
- [ ] Price calculation updates correctly
- [ ] Navigate to checkout
- [ ] Form validation (name, email)
- [ ] Apply valid promo code
- [ ] Apply invalid promo code
- [ ] Complete booking successfully
- [ ] Handle booking failure
- [ ] Responsive on mobile devices
- [ ] Loading states display correctly

## 📝 Available Promo Codes

- `SAVE10` - 10% discount
- `FLAT100` - ₹100 flat discount

