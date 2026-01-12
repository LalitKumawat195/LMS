@echo off
REM Replace YOUR_ADMIN_TOKEN_HERE with actual admin JWT token from localStorage
set TOKEN=YOUR_ADMIN_TOKEN_HERE

curl -X POST http://localhost:5000/api/books/sample ^
  -H "Authorization: Bearer %TOKEN%" ^
  -H "Content-Type: application/json" ^
  -d "{}"

pause