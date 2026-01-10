# Role-Based Access Control (RBAC) Implementation

## User Roles & Permissions

### 🔵 Member (Library Users)
**Permissions:**
- ✅ View available resources
- ✅ Search resources
- ✅ View personal profile
- ✅ View personal fines
- ✅ View issue/return history
- ❌ Cannot manage resources
- ❌ Cannot access admin features

### 🟢 Librarian (Library Staff)
**Permissions:**
- ✅ All Member permissions
- ✅ Manage resources (add, edit, delete)
- ✅ Issue/Return books
- ✅ Manage member accounts
- ✅ Calculate and manage fines
- ✅ View reports and analytics
- ❌ Cannot manage other librarians
- ❌ Cannot access system settings

### 🔴 Admin (System Administrator)
**Permissions:**
- ✅ All Librarian permissions
- ✅ Manage users (all roles)
- ✅ System settings and configuration
- ✅ Manage librarian accounts
- ✅ Advanced analytics
- ✅ Export system data
- ✅ Full system access

## Implementation Guide

### 1. Using RoleGuard Component

```javascript
import RoleGuard from './RoleGuard';

// Only show to Librarians and Admins
<RoleGuard allowedRoles={['Librarian', 'Admin']}>
  <ManageResourcesButton />
</RoleGuard>

// Only show to Admins
<RoleGuard allowedRoles={['Admin']}>
  <SystemSettingsPanel />
</RoleGuard>
```

### 2. Using usePermissions Hook

```javascript
import { usePermissions } from './RoleGuard';

const MyComponent = () => {
  const { canAccess, isAdmin, isLibrarian, isMember } = usePermissions();
  
  return (
    <div>
      {canAccess('manage-resources') && <AddBookButton />}
      {canAccess('view-analytics') && <AnalyticsPanel />}
      {isAdmin && <AdminPanel />}
      {isLibrarian && <LibrarianTools />}
      {isMember && <MemberDashboard />}
    </div>
  );
};
```

### 3. Dashboard Navigation Based on Role

```javascript
// In Dashboard.js
const { canAccess, user } = usePermissions();

<Pivot>
  <PivotItem headerText="Overview" itemKey="overview" />
  
  {canAccess('view-resources') && (
    <PivotItem headerText="Resources" itemKey="resources" />
  )}
  
  {canAccess('manage-members') && (
    <PivotItem headerText="Members" itemKey="members" />
  )}
  
  {canAccess('calculate-fines') && (
    <PivotItem headerText="Fines" itemKey="fines" />
  )}
  
  {canAccess('view-analytics') && (
    <PivotItem headerText="Analytics" itemKey="analytics" />
  )}
  
  {canAccess('system-settings') && (
    <PivotItem headerText="Settings" itemKey="settings" />
  )}
</Pivot>
```

## Backend Route Protection

### 1. Middleware for Role Checking

```javascript
// server/middleware/auth.js
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    
    next();
  };
};

module.exports = { requireRole };
```

### 2. Protected Routes Example

```javascript
// server/routes/resources.js
const { requireRole } = require('../middleware/auth');

// Anyone can view resources
router.get('/', async (req, res) => {
  // Get resources logic
});

// Only Librarians and Admins can add resources
router.post('/', requireRole(['Librarian', 'Admin']), async (req, res) => {
  // Add resource logic
});

// Only Admins can delete resources
router.delete('/:id', requireRole(['Admin']), async (req, res) => {
  // Delete resource logic
});
```

## Team Implementation Tasks

### Menka (Resource Management)
```javascript
// In ResourceList.js
const { canAccess } = usePermissions();

return (
  <div>
    <ResourceGrid />
    {canAccess('manage-resources') && (
      <Stack horizontal tokens={{ childrenGap: 8 }}>
        <PrimaryButton text="Add Resource" />
        <DefaultButton text="Import Resources" />
      </Stack>
    )}
  </div>
);
```

### Pratiksha (Members Management)
```javascript
// In MemberList.js
const { canAccess, isAdmin } = usePermissions();

return (
  <div>
    <MemberGrid />
    {canAccess('manage-members') && (
      <CommandBar
        items={[
          { key: 'add', text: 'Add Member' },
          { key: 'edit', text: 'Edit Member' },
          ...(isAdmin ? [{ key: 'delete', text: 'Delete Member' }] : [])
        ]}
      />
    )}
  </div>
);
```

### Nikhil (Fine Management)
```javascript
// In FinesList.js
const { canAccess, isMember } = usePermissions();

return (
  <div>
    {isMember ? (
      <PersonalFinesView />
    ) : (
      <AllFinesView />
    )}
    
    {canAccess('calculate-fines') && (
      <Stack>
        <PrimaryButton text="Calculate Overdue Fines" />
        <DefaultButton text="Waive Fine" />
      </Stack>
    )}
  </div>
);
```

## Registration Role Selection

Users can select their role during registration:
- **Member**: Default for library users
- **Librarian**: For library staff (requires admin approval)
- **Admin**: For system administrators (requires super admin approval)

## Color Coding in UI

- 🔵 **Member**: Blue (#0078d4)
- 🟢 **Librarian**: Green (#107c10)  
- 🔴 **Admin**: Red (#d13438)

This color coding appears in:
- User avatars in navbar
- Role badges
- Permission indicators

## Security Notes

1. **Frontend validation is for UX only** - always validate on backend
2. **Use middleware** to protect API routes
3. **Check permissions** on every sensitive operation
4. **Log access attempts** for security auditing
5. **Regular permission reviews** to ensure proper access levels