# Database Setup Options

## Option 1: MongoDB Atlas (Recommended)
1. Create free account at mongodb.com/atlas
2. Create cluster and get connection string
3. Replace MONGODB_URI in server/.env
4. All team members use same connection string

## Option 2: Local MongoDB
Each member installs MongoDB locally:
- Windows: Download MongoDB Community Server
- Start MongoDB service
- Use: mongodb://localhost:27017/lms

## Option 3: Shared Database
One member hosts, others connect to their IP:
- Host: mongodb://0.0.0.0:27017/lms
- Others: mongodb://HOST_IP:27017/lms

## Environment Variables
Create server/.env with:
```
MONGODB_URI=your_connection_string_here
JWT_SECRET=your_secret_key_here
PORT=5000
```

## Team Workflow
1. One person sets up Atlas cluster
2. Share connection string with team
3. Everyone updates their .env file
4. All data automatically synced