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

## Version 1.0.0 :robot: (January 4th, 2024) ```Latest```
- [x] Login with Auth0
- [x] Create, Read, Update and Delete Organizations
- [x] Create, Accept or Reject Invitations to Organizations
- [x] Create, Read, Update and Delete Products
- [x] Create, Read, Update and Delete Categories
- [x] Create, Read, Update and Delete Inventories
- [x] Create, Read, Update and Delete Proyects
- [x] Create, Read, Update and Delete Subproyects
- [x] Create, Read, Update and Delete Units