# API Documentation

## Base URL

- **Production**: `https://your-app.vercel.app/api`
- **Development**: `http://localhost:5000`

## Authentication Endpoints

### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response (201 Created)**:

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com"
  },
  "message": "Registration successful"
}
```

### Login User

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response (200 OK)**:

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

### Verify Token

```http
GET /api/auth/verify
Authorization: Bearer <token>
```

**Response (200 OK)**:

```json
{
  "success": true,
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

## Scan Endpoints

### Analyze Text

```http
POST /api/scan/analyze
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Click here to claim your prize! Enter your password now!"
}
```

**Response (200 OK)**:

```json
{
  "success": true,
  "riskScore": 75,
  "threatLevel": "HIGH",
  "phishingDetected": true,
  "message": "Scan completed successfully"
}
```

### Get Scan History

```http
GET /api/scan/history
Authorization: Bearer <token>
```

**Response (200 OK)**:

```json
{
  "success": true,
  "scans": [
    {
      "id": 1,
      "user_id": 1,
      "input_text": "Sample text...",
      "risk_score": 45,
      "threat_level": "MEDIUM",
      "phishing_detected": false,
      "created_at": "2026-01-29T13:45:00.000Z"
    }
  ]
}
```

## Error Responses

### 400 Bad Request

```json
{
  "message": "Email and password are required"
}
```

### 401 Unauthorized

```json
{
  "message": "Invalid credentials"
}
```

### 409 Conflict

```json
{
  "message": "Email already registered"
}
```

### 500 Server Error

```json
{
  "message": "Server error"
}
```

## CORS Configuration

All API endpoints support CORS with the following headers:

- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization`

## Rate Limiting

Currently no rate limiting is implemented. For production:

- Implement rate limiting in API functions
- Use Vercel Edge Config for distributed rate limiting
- Consider using Upstash Redis for rate limit storage

## Security Best Practices

1. **Always use HTTPS** in production
2. **Store JWT secret** in environment variables
3. **Validate all inputs** on the server side
4. **Use strong passwords** (minimum 8 characters recommended)
5. **Implement rate limiting** to prevent abuse
6. **Log security events** for monitoring

## Testing with cURL

### Register

```bash
curl -X POST https://your-app.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test1234"}'
```

### Login

```bash
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test1234"}'
```

### Scan (with token)

```bash
curl -X POST https://your-app.vercel.app/api/scan/analyze \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"text":"Click here to win a prize!"}'
```

## Environment Variables Required

- `JWT_SECRET`: Secret key for signing JWT tokens
- `NODE_ENV`: Environment (production/development)
- `MONGODB_URI`: (Optional) MongoDB connection string for persistent storage
