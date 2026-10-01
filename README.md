# Car Advisor – Full‑stack Car Shortlister

**Live URL (Render – single service):** [https://car-advisor-app.onrender.com](https://car-advisor-app.onrender.com)  
**Backend API:** same URL + `/api/shortlist`  
**Screen Recording:** *Not recorded*

---


## Tech stack and why

| Layer     | Choice               | Why                                                                 |
|-----------|----------------------|---------------------------------------------------------------------|
| Frontend  | React + TypeScript + Tailwind | Fast to build, type‑safe, great AI tooling.                  |
| Backend   | Node.js + Hapi        | Lightweight, async, easy scoring logic. Hapi gives built‑in validation. |
| Scoring   | Custom algorithm      | Weights budget (40), fuel (20), usage (20), priority (20) → /100.  |
| Logging   | JSONL file            | Non‑trivial persistence (meets “full‑stack” requirement).           |
| Deployment| Render (single web service) | Free tier, one `render.yaml` blueprint, serves both API + frontend. |



## 🚀 Local setup – one command to install, build, and start everything

```bash
git clone https://github.com/yourusername/Car-Advisor-App.git
cd Car-Advisor-App
npm run start-all
