# :globe_with_meridians: Kipin: Web App for managing your inventory and bussiness

## Getting Started
1. Clone the repository
```
https://github.com/tomasgbailon/Inventario-Backend.git
```
2. Install the dependencies
```
yarn install
npm install
```
3. Create a .env file and add the following variables
```
VITE_APP_AUTH0_DOMAIN=
VITE_APP_AUTH0_CLIENT_ID=
VITE_APP_AUTH0_AUDIENCE=
VITE_BACK_ADDRESS=
VITE_API_ADDRESS=
```
4. Run the project
```
yarn dev
npm run dev
```
5. Open the project in your browser
```
http://localhost:3000
```
For implementing in cloud services:
1. Upload the project to S3
2. Create a CloudFront distribution
3. Create DNS records for your domain (optional)

# :globe_with_meridians: Kipin: Web App for managing your inventory and bussiness

## Getting Started
1. Clone the repository
```
https://github.com/tomasgbailon/Inventario-Backend.git
```
2. Install the dependencies
```
yarn install
npm install
```
3. Create a .env file and add the following variables
```
DB_HOST=
DB_PORT=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
REDIS_PASSWORD=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_REGION=
```
4. Build Docker Container
```
docker-compose up --build
```
5. Run the project
```
yarn dev
npm run dev
```
## Version 1.0.0 :robot: (January 4th, 2024) (Alpha)
- [x] Create, Read, Update and Delete Organizations (name, location, description)
- [x] Create, Read, Update and Delete Users (name, email, authId)
- [x] Create, Read, Update and Delete Products (name, prefix, type, description, brand, model, measurement unit)
- [x] Create, Read, Update and Delete Invitations (inviter, receptor, type, inventory, proyect, organization, status)
- [x] Create, Read, Update and Delete Categories (name, prefix, description)
- [x] Create, Read, Update and Delete Units (name, prefix, status, price, purchase date, provider, sku, responsible, subproyect, quantity, description)
- [x] Create, Read, Update and Delete Inventories (name, prefix, description, location)
- [x] Create, Read, Update and Delete Proyects (name, status, description, budget)
- [x] Create, Read, Update and Delete Subproyects (name, status, description, budget)
- [x] Create, Read, Update and Delete Permissions for Admin, Editor and Viewer (user, inventory, subproyect, status, organization)
- [x] Generate xlsx reports of Inventories and Proyects

## Version 1.0.1 :robot: (January 10th, 2024)
- [x] Units return to inventory when a proyect that contains a subproyect that contains a unit is deleted
- [x] Units return to inventory when a subproyect that contains a unit is deleted
- [x] Units return to inventory when a subproyect that contains a unit is disactivated
- [x] Units return to inventory when a proyect that contains a subproyect that contains a unit is disactivated

## Version 1.1.0 :moon: (January, 2024)
- [x] Improved UI for inventories and products
- [x] New attributes for units
- [x] Better optimized return addresses after submitting forms
- [x] Dark Mode
- [x] New type of report: History Report
- [x] New model Event that will be used to generate History Reports
- [x] New Endpoints that create events triggered by the user
- [x] New Endpoints that return events
- [x] New Tool Bar with new options like propagating changes within multiple units

## Version 1.1.1 :star: (March, 2024)
- [x] Bug fixes
- [x] Improved UI for documentation in dark mode

## Version 1.1.2 🚀 (March, 2024) 
- [x] Added events to documentation
- [x] Improved invitations logic
- [x] Fixed documentarion about projects
- [x] Improved responsiveness for vertical screens
- [x] Improved date format in reports
- [x] Limited events reports to current year

## Version 1.1.3 ☀️ (April, 2024) ```Latest```
- [x] Fixed bugs related to date formatting in History and Events


