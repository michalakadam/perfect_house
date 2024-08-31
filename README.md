# Perfect House Real Estate Management System

This project is a comprehensive real estate management system for Perfect House agency, integrating data from the Galactica Virgo CRM system.

## Project Structure

The project consists of three main components:

1. Frontend (Angular)
2. Backend Server
3. Database Server

### Frontend

The frontend is built with Angular and provides a user interface for clients and agents to interact with the real estate listings and agency services.

Key features:
- Offer listings and detailed views
- Agent profiles and contact information
- Property management services
- Eco-friendly house offerings
- Mortgage consultancy

### Backend Server

The backend server handles data reception from the CRM system and processes incoming updates.

Key responsibilities:
- Receiving incremental updates via FTP
- Processing incoming XML data and photos
- Extracting and preparing offer data for the database server

### Database Server

The database server manages the MongoDB instance and handles data updates.

Key responsibilities:
- Fetching and processing new XML files
- Converting XML to JSON
- Updating MongoDB with offer data
- Exporting updated database to JSON for frontend use

## Development and Deployment

- The frontend uses Angular CLI for development and build processes
- Backend scripts are primarily written in Bash and Node.js
- Database operations use MongoDB

For detailed information on each component, please refer to the respective README files in the `server/` and `frontend/` directories.

## Ongoing Development

The database server architecture is currently undergoing a major rework to implement an API layer between the database and clients.

## Contact

For any questions or improvements, please contact:
Adam Michalak <adam.michalak.dev@gmail.com>