# 🗄️ Prisma + MySQL Setup Guide

## 📋 Prerequisites
- MySQL installed and running
- Node.js installed

## 🚀 Setup Steps

### 1. Install Prisma
```bash
cd Backend
npm install @prisma/client
npm install -D prisma
```

### 2. Configure Database
Update your `.env` file with your MySQL credentials:
```env
DATABASE_URL="mysql://USERNAME:PASSWORD@localhost:3306/capstone_db"
```

Example:
```env
DATABASE_URL="mysql://root:password@localhost:3306/capstone_db"
```

### 3. Create Database
Open MySQL and create the database:
```sql
CREATE DATABASE capstone_db;
```

Or use command line:
```bash
mysql -u root -p -e "CREATE DATABASE capstone_db;"
```

### 4. Run Prisma Migration
This creates the User table in your database:
```bash
npx prisma migrate dev --name init
```

### 5. Generate Prisma Client
```bash
npx prisma generate
```

### 6. Start Server
```bash
npm start
# or
nodemon
```

## 📊 Database Schema

**User Table:**
- `id` - Auto-increment primary key
- `email` - Unique email address
- `password` - User password (plain text for now)
- `name` - User's full name
- `createdAt` - Timestamp when user was created
- `updatedAt` - Timestamp when user was last updated

## 🔍 Useful Prisma Commands

```bash
# Open Prisma Studio (GUI for database)
npx prisma studio

# View database in browser
# Opens at http://localhost:5555

# Reset database (deletes all data)
npx prisma migrate reset

# Check database status
npx prisma migrate status
```

## 🎯 What Changed

### Before (In-Memory Array)
```javascript
const users = [];
users.push(newUser);
```

### After (MySQL Database)
```javascript
const prisma = require('./lib/prisma');
await prisma.user.create({ data: { email, password, name } });
```

## ✅ Benefits of Prisma

1. **Type Safety** - Auto-completion and type checking
2. **Easy Queries** - Simple, readable database queries
3. **Migrations** - Version control for database schema
4. **Prisma Studio** - Visual database editor
5. **MySQL Support** - Works with MySQL out of the box

## 🐛 Troubleshooting

### Error: Can't connect to MySQL
- Make sure MySQL is running
- Check username/password in DATABASE_URL
- Verify database exists

### Error: Environment variable not found
- Check `.env` file exists
- Verify DATABASE_URL is set correctly
- Restart the server

### Error: Prisma Client not generated
Run:
```bash
npx prisma generate
```

## 📝 Next Steps

Your authentication now uses a real MySQL database! Users are persisted and won't disappear when you restart the server.

**Test it:**
1. Signup a new user
2. Stop the server
3. Start the server again
4. Login with the same user - it still exists! 🎉
