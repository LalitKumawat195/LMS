# Replace with actual admin JWT token from localStorage
$token = "YOUR_ADMIN_TOKEN_HERE"

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/books/sample" -Method POST -Headers $headers -Body "{}"
    Write-Host "Success: $($response | ConvertTo-Json)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}