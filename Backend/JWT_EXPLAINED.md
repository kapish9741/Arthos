# 🔐 JWT Authentication - Simple Explanation

## What is JWT?
**JWT (JSON Web Token)** is like a **digital ID card** that proves who you are without storing sessions on the server.

## 🎯 How It Works (Simple 3 Steps)

### 1️⃣ **User Logs In**
```
User sends: email + password
↓
Server checks: Is this correct?
↓
Server creates: JWT Token (like an ID card)
↓
Server sends back: Token to user
```

### 2️⃣ **User Makes Requests**
```
User sends: Token with every request
↓
Server checks: Is this token valid?
↓
Server responds: Your data
```

### 3️⃣ **Token Structure**
```
eyJhbGci.eyJlbWFpbCI.SflKxwRJ
   ↓         ↓          ↓
Header    Payload    Signature
(Info)    (Data)     (Security)
```

---

## 📁 Our Code Files

### 1. **auth.js (Service)** - Creates and verifies tokens
```javascript
// Create token when user logs in
generateToken(email) {
  return jwt.sign({ email }, SECRET_KEY, { expiresIn: '7d' });
}

// Verify token is real
verifyToken(token) {
  return jwt.verify(token, SECRET_KEY);
}
```

### 2. **auth.js (Middleware)** - Protects routes
```javascript
// Checks if user has valid token
authenticateToken(req, res, next) {
  - Get token from header
  - Verify it's valid
  - If valid → continue
  - If invalid → reject
}
```

### 3. **auth.js (Routes)** - API endpoints
```javascript
POST /signup   → Create account + get token
POST /login    → Login + get token
GET  /me       → Get profile (needs token) 🔒
POST /logout   → Logout
```

---

## 🎤 Interview Questions & Answers

### Q1: What is JWT?
**A:** JWT is a secure way to transmit information between client and server as a JSON object. It's like a digital passport that proves your identity.

### Q2: Why use JWT instead of sessions?
**A:** 
- ✅ **Stateless** - Server doesn't store anything
- ✅ **Scalable** - Works across multiple servers
- ✅ **Mobile-friendly** - Easy to use in apps

### Q3: How does JWT work in your code?
**A:** 
1. User logs in with email/password
2. Server creates JWT token with `jwt.sign()`
3. Client stores token (localStorage)
4. Client sends token in header: `Authorization: Bearer <token>`
5. Middleware verifies token with `jwt.verify()`
6. If valid, user can access protected routes

### Q4: What's in a JWT token?
**A:** Three parts separated by dots:
- **Header**: Algorithm (HS256)
- **Payload**: User data (email)
- **Signature**: Security (prevents tampering)

### Q5: Is JWT secure?
**A:** Yes, because:
- Signed with secret key (only server knows)
- Can't be modified without breaking signature
- Has expiration time
- But: Never store sensitive data in payload (it's readable!)

### Q6: Where do you store JWT on frontend?
**A:** 
- ✅ **localStorage** - Simple, persistent
- ⚠️ **sessionStorage** - Cleared on tab close
- ❌ **Cookies** - Can use but need CSRF protection

---

## 🔑 Key Code Flow

### Login Flow
```
1. POST /login { email, password }
2. Server: Check credentials
3. Server: Generate token = jwt.sign({ email })
4. Response: { token, user }
5. Client: Store token in localStorage
```

### Protected Route Flow
```
1. GET /me with Header: "Authorization: Bearer <token>"
2. Middleware: Extract token
3. Middleware: jwt.verify(token, SECRET)
4. Middleware: Attach user to req.user
5. Route: Use req.user to get data
```

---

## 🛠️ Environment Variables
```bash
JWT_SECRET=your_secret_key_here  # Used to sign tokens
JWT_EXPIRES_IN=7d               # Token valid for 7 days
```

---

## ✅ Pros & Cons

### Pros ✅
- No session storage needed
- Works across multiple servers
- Easy to use
- Fast

### Cons ❌
- Can't invalidate before expiry
- Token size larger than session ID
- Need to store on client

---

## 📝 Quick Summary

**JWT = Secure way to prove identity**

1. **Login** → Get token
2. **Store** → Save in localStorage
3. **Send** → Include in Authorization header
4. **Verify** → Middleware checks validity
5. **Access** → Get protected data

**That's it!** 🎉
