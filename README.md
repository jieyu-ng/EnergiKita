# EnergiKita FlexOS

## An AI-Orchestrated Bill-to-Flexibility Platform for Malaysian SMEs and Community Energy Operators

> **The platform transforms existing electricity bills, basic business information and optional interval data into an Energy Flexibility Passport.**

## Team Information

**Team Name:** M&N

**Team Members:**
- Ng Jie Yu
- Loo Weiqi
- Valiant Tai  
- Min PyaePhyo 
- Gan Kai Ken 

**Track:** Track 3 — Double Dot: Smarter Resource Management



## Technologies used

### Frontend
- **Next.js** with TypeScript
- **React** for component architecture
- **Tailwind CSS** for styling
- **Recharts** for data visualisation
- **Mapbox GL JS** for community mapping
- **React Query** for state synchronisation

### Backend
- **Python FastAPI** with Pydantic schemas
- **PostgreSQL** / **Supabase** for database
- **Object Storage** for document management
- **WebSocket** / **Server-Sent Events** for agent progress updates
- **Pytest** for testing

### AI and Machine Learning
- **Grafilab Qwen3-VL-Flash** for bill document understanding
- **Grafilab Qwen3.6-Flash** for structured business interpretation and explanations
- **XGBoost / LightGBM** for demand forecasting
- **pvlib** for solar generation modelling

---

## Challenge and Approach 
- Time Management Was Tough: We had to make some hard calls about what to build and what to leave out. Instead of trying to build ten half-working features, we focused on making one complete workflow work really well
- Mentor Feedback Changed Our Approach: About halfway through, we got some feedback from our mentor that made us rethink our architecture. So we pivoted to add more deterministic validation and audit capabilities.



## Build Instruction
`cd d:\ImagineHack2026\Lega\backend`
`pip install -r requirements.txt   # (If you have a requirements file)`
`python -m uvicorn main:app --reload`

`cd d:\ImagineHack2026\Lega\frontend`
`npm install    # (Only needed if you haven't installed dependencies yet)`
`npm run dev`
