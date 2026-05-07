ShieldMe is a RESTful backend API for a Lagos-focused civic issue tracker. 
It allows citizens to report public infrastructure and safety concerns — 
such as bad roads, flooding, and waste management issues — and track their 
resolution status. Built to promote accountability between Lagos residents 
and government officials.

Stack: Node.js, Express, MySQL, Sequelize
Features: JWT auth, RBAC (citizens + admins), status tracking (Pending → In-Review → Resolved), comments, report following, Helmet, CORS, rate limiting, Swagger docs

Key features:
- Citizen signup/login with secure JWT authentication
- Report filing tagged to specific Lagos LGAs
- Status tracking: Pending → In-Review → Resolved
- Community interaction via comments and report following
- Admin-only status management
- Production-ready security with Helmet, CORS, and rate limiting
