# ---------- Edit these values before running ----------
$ACCESSKEYID     = "XXXXXXXXX"
$ACCESSSECRETKEY = "XXXXXXXXXXXXXXXXXX"
$SESSIONTOKEN    = "XXXXXXXXXXXXXXXXXXXXXXXXXXX"

if (-not (Get-Command aws -ErrorAction SilentlyContinue)) {
    Write-Error "AWS CLI not found in PATH. Install AWS CLI v2 and retry."
    exit 2
}

if (-not $ACCESSKEYID -or -not $ACCESSSECRETKEY) {
    Write-Error "ACCESSKEYID and ACCESSSECRETKEY must be set in the script before running."
    exit 1
}


# Configure AWS CLI profile
aws configure set aws_access_key_id $ACCESSKEYID
aws configure set aws_secret_access_key $ACCESSSECRETKEY

if ($SESSIONTOKEN -and $SESSIONTOKEN.Trim().Length -gt 0) {
    aws configure set aws_session_token $SESSIONTOKEN
} else {
    # Ensure no leftover session token in the profile
    aws configure set aws_session_token ""
}



# Export to current PowerShell session so subsequent commands in this shell use them
$env:AWS_ACCESS_KEY_ID = $ACCESSKEYID
$env:AWS_SECRET_ACCESS_KEY = $ACCESSSECRETKEY
if ($SESSIONTOKEN -and $SESSIONTOKEN.Trim().Length -gt 0) {
    $env:AWS_SESSION_TOKEN = $SESSIONTOKEN
    Write-Host "AWS_SESSION_TOKEN exported to current session."
} else {
    Remove-Item Env:AWS_SESSION_TOKEN -ErrorAction SilentlyContinue
}

Write-Host "AWS CLI configured successfully."