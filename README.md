ShieldMe is designed as a civic-tech solution tailored for Lagos, Nigeria.
Citizens can create reports tied to specific Lagos LGAs, track issue resolution progress, interact with reports through comments, and follow ongoing civic concerns.

ShieldMe allows citizens to report public infrastructure and safety concerns such as:

Bad roads
Flooding
Waste management issues
Drainage problems
Unsafe public spaces

The platform promotes transparency and accountability between Lagos residents and government agencies by enabling issue tracking and community engagement.

Features
Authentication & Authorization
Citizen signup and login
Secure JWT authentication
Password hashing with bcrypt
Role-Based Access Control (RBAC)
Citizens
Admins

 Civic Issue Reporting: Create reports for civic issues, Assign reports to Lagos LGAs, Upload detailed descriptions and Categorize public concerns

 Status Tracking: Track issue progress through:Pending, In-Review and Resolved

Only admins can update report statuses.

 Community Engagement
Comment on reports
Follow reports for updates
Encourage community visibility and participation

The API includes authentication, authorization, security best practices, and structured documentation using Swagger.

Stack: Node.js, Express, MySQL, Sequelize
Features: JWT auth, RBAC (citizens + admins), status tracking (Pending → In-Review → Resolved), comments, report following, Helmet, CORS, rate limiting

API Documentation: Interactive Swagger API documentation included.

Installation
1. Clone the Repository
git clone https://github.com/YOUR_USERNAME/shieldme-api.git
2. Navigate into the Project
cd shieldme-api
3. Install Dependencies
npm install
4. Create Environment Variables

Create a .env file in the root directory:

PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=shieldme_db

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
5. Start the Server

Development:
npm run dev

Production:
npm start
Database Setup

Create a MySQL database:

CREATE DATABASE shieldme_db;

Run Sequelize migrations/sync depending on your setup.

 API Documentation
Swagger documentation is available at:
http://localhost:5000/api-docs/


User Roles
Citizen
Create reports
View reports
Comment on reports
Follow reports
🛠️ Admin
Manage report statuses
Review civic issues
Moderate activity


Example Civic Report
{
  "title": "Flooded Road at Lekki Phase 1",
  "description": "Heavy flooding blocking traffic movement after rainfall.",
  "category": "Flooding",
  "lga": "Eti-Osa",
  "status": "Pending"
}

 
 Future Improvements
File/image upload support
Email notifications
Geo-location mapping
Real-time report updates
Analytics dashboard
Mobile app integration


API Testing

You can test endpoints using:

Postman
Swagger UI
Thunder Client


Contribution

Contributions, ideas, and civic-tech collaborations are welcome.

Fork the project
Create your feature branch
Commit your changes
Push to the branch
Open a Pull Request

License

This project is licensed under the MIT License.

