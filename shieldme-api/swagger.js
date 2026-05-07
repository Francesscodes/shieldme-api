const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '🛡️ ShieldMe API',
      version: '1.0.0',
      description: `
A Lagos Civic Issue Tracker API that enables citizens to report and track 
public infrastructure and safety concerns across all 20 Lagos LGAs.

**How to use authentication:**
1. Use /api/auth/signup to create an account
2. Use /api/auth/login to get your token
3. Click the Authorize button above and enter: Bearer YOUR_TOKEN_HERE
      `,
      contact: {
        name: 'Francess Ekezie',
        url: 'https://github.com/Francesscodes',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token from the login endpoint',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Zee Ekezie' },
            email: { type: 'string', example: 'zee@shieldme.com' },
            role: { type: 'string', enum: ['citizen', 'admin'], example: 'citizen' },
          },
        },
        Report: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Flooded road on Ago Palace Way' },
            description: { type: 'string', example: 'Road flooded for 3 days after heavy rain' },
            category: { type: 'string', enum: ['Road', 'Flooding', 'Waste Management', 'Street Lighting', 'Water Supply', 'Other'] },
            lga: { type: 'string', example: 'Oshodi-Isolo' },
            status: { type: 'string', enum: ['Pending', 'In-Review', 'Resolved'], example: 'Pending' },
            user_id: { type: 'integer', example: 1 },
          },
        },
        Comment: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            content: { type: 'string', example: 'This has been an issue for months!' },
            user_id: { type: 'integer', example: 1 },
            report_id: { type: 'integer', example: 1 },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'An error occurred' },
          },
        },
      },
    },
  },
  // This tells swagger-jsdoc where to find your route annotations
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;