# Branch Strategy for Team Collaboration

## Main Branches
- `main` - Production ready code
- `develop` - Integration branch for features

## Feature Branches (by team member)
- `feature/frontend-ui` - Member 1 (React components, UI/UX)
- `feature/backend-api` - Member 2 (Express routes, API endpoints)  
- `feature/database` - Member 3 (MongoDB models, database operations)
- `feature/auth-system` - Member 4 (Authentication, user management)

## Workflow Steps

### 1. Start Working (Daily)
```bash
# In GitHub Desktop:
1. Switch to 'develop' branch
2. Click 'Pull origin' to get latest changes
3. Create new branch from develop: 'feature/your-feature-name'
```

### 2. While Working
```bash
# Make changes to your assigned files
# Commit frequently with clear messages:
# "Add book search functionality"
# "Fix user login validation"
# "Update book model schema"
```

### 3. End of Work Session
```bash
# In GitHub Desktop:
1. Stage all changes
2. Write descriptive commit message
3. Commit to your feature branch
4. Push to origin
```

### 4. Ready to Merge
```bash
# Create Pull Request:
1. Go to GitHub.com
2. Create PR from your feature branch to 'develop'
3. Request review from team members
4. Merge after approval
```

## File Ownership (Avoid Conflicts)

### Member 1 - Frontend UI
- `client/src/components/`
- `client/src/pages/`
- `client/src/styles/`

### Member 2 - Backend API  
- `server/routes/`
- `server/controllers/`
- `server/middleware/`

### Member 3 - Database
- `server/models/`
- `server/config/database.js`
- Database seeding scripts

### Member 4 - Authentication
- `server/auth/`
- `client/src/auth/`
- User-related components

## Merge Conflict Prevention
- Communicate before editing shared files
- Pull latest changes before starting work
- Keep commits small and focused
- Use different files when possible