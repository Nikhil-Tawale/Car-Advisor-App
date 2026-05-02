# Car Advisor – Full‑stack Car Shortlister

**Live URL:** [https://car-advisor-frontend.vercel.app](https://car-advisor-frontend.vercel.app)  
**Backend API:** [https://car-advisor-backend.onrender.com/api/shortlist](https://car-advisor-backend.onrender.com/api/shortlist)  
**Screen Recording:** *Not recorded*

---

## What did you build and why?

I built a **smart shortlist generator** for confused car buyers.  
Users answer 4 simple questions (budget, fuel, usage, priority) and immediately see the **top 5 ranked cars** with a score and a plain‑English reason.

Why? Because the biggest problem is **paralysis by choice**.  
Forcing a priority (safety/mileage/boot) cuts through the noise and gives confidence.

## What did you deliberately cut?

- User accounts / login – out of scope for 2‑3 hours.  
- Database persistence – instead I log every query to a JSONL file (non‑trivial logging).  
- Image upload / car editing – only the given dataset.  
- Pagination – top 5 is enough for a shortlist.  
- Pixel‑perfect design – functional, clean, but not polished.

## Tech stack and why

| Layer     | Choice               | Why                                                                 |
|-----------|----------------------|---------------------------------------------------------------------|
| Frontend  | React + TypeScript + Tailwind | Fast to build, type‑safe, great AI tooling.                  |
| Backend   | Node.js + Hapi        | Lightweight, async, easy scoring logic. Hapi gives built‑in validation. |
| Scoring   | Custom algorithm      | Weights budget (40), fuel (20), usage (20), priority (20) → /100.  |
| Logging   | JSONL file            | Non‑trivial persistence (meets “full‑stack” requirement).           |
| Deployment| Vercel (frontend) + Render (backend) | Free tier, automatic HTTPS, no Docker needed.          |

## What did you delegate to AI vs. do manually?

- **AI (Claude Code / Cursor) did:**  
  - Generate React component boilerplate (cards, filters, loading states).  
  - Write the initial scoring function and ranking logic.  
  - Set up Hapi routes and CORS.  
  - Create Tailwind config and skeleton loaders.  
- **I did manually:**  
  - Designed the scoring weights (why budget = 40 points).  
  - Decided to log queries to JSONL instead of a full database.  
  - Wrote this README.  

**Where AI helped most:** Generating repetitive UI and the scoring loop – saved ~1.5 hours.  
**Where AI got in the way:** It kept suggesting Redis, Docker, and GraphQL. I had to say “no” repeatedly to keep it simple.

## If you had another 4 hours, what would you add?

1. **Compare two cars** side‑by‑side.  
2. **Persist user preferences** in localStorage (or a real DB).  
3. **Add unit tests** for the scoring algorithm.  
4. **Show actual “why this car” images** (e.g., boot space photo).  
5. **Support electric range** for EVs instead of kmpl.

## Screen Recording Note

The assignment requested a screen recording, but I did **not** record my build process.  
All other deliverables (GitHub repo, live URLs, local setup) are provided as required.

---

## Local setup (one command)

```bash
git clone https://github.com/yourusername/car-advisor-fullstack.git
cd car-advisor-fullstack
npm run setup   # installs deps for root, client, server
npm run dev     # starts frontend (5173) + backend (5000)