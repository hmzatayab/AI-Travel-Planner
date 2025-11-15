# 🌍 AI Travel Planner (MERN Stack + OpenAI Integration)

## 🧭 Project Overview
AI-powered travel planning app built using the **MERN Stack (MongoDB, Express, React, Node.js)**.  
Users can enter their **budget, travel duration, preferences, and interests**, and the AI will generate a complete **day-wise travel itinerary** including:

- 🗓 Daily schedule (Day 1, Day 2…)  
- 🏨 Suggested hotels  
- ✈️ Suggested flights with detailed info (departure, arrival, duration, class pricing, stops, seats, airport names)  
- 🍽 Recommended food spots  
- 🚖 Travel modes & estimated cost  
- 📍 Tourist attractions with timings  
- 💰 Total estimated cost  

---

## ⚙️ Tech Stack
**Frontend:** React + TailwindCSS  
**Backend:** Node.js + Express.js  
**Database:** MongoDB (Mongoose)  
**AI Integration:** OpenAI API (or Gemini / Claude)  
**Authentication:** JWT + bcrypt password hashing  

---

## 🔹 API Endpoints

### **Auth Routes**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/api/auth/register` | Register new user |
| POST   | `/api/auth/login` | User login |
| POST   | `/api/auth/logout` | Logout user (protected) |
| POST   | `/api/auth/forgot-password` | Request password reset |
| POST   | `/api/auth/reset-password/:token` | Reset password |
| GET    | `/api/auth/me` | Get logged-in user profile (protected) |

### **User Plan**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/itineraries/my-plan` | Get current user subscription/plan (protected) |

### **Itinerary Routes**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/itineraries/` | List all itineraries of logged-in user (protected) |
| POST   | `/api/itineraries/generate` | Generate new itinerary using AI (protected) |
| GET    | `/api/itineraries/:id` | Get itinerary by ID (protected) |
| POST   | `/api/itineraries/:id/hotels` | Generate hotel suggestions for an itinerary (protected) |
| POST   | `/api/itineraries/:id/flights` | Generate flight suggestions for an itinerary (protected) |

---

## 💡 Notes
- AI credits are deducted on generating hotels or flights (5 credits each).  
- Hotels and flights are saved directly in the itinerary document.  
- All AI-generated data is strictly validated and stored in structured JSON.  
- Authentication required for all itinerary and plan-related routes.  
