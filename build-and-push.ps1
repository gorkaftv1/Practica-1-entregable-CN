param(
  [Parameter(Mandatory=$true)]
  [ValidateNotNullOrEmpty()]
  [string]$EcrName,

  [string]$Path = ".",

  # Ruta opcional al Dockerfile (si no se indica, se usa $Path/Dockerfile)
  [string]$Dockerfile = ""
)

$ErrorActionPreference = "Stop"

try {
  if (-not $Dockerfile -or $Dockerfile.Trim().Length -eq 0) {
    $dockerfileArg = ""
  } else {
    $dockerfileArg = "-f `"$Dockerfile`""
  }

  aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 975050237180.dkr.ecr.us-east-1.amazonaws.com

  Write-Host "Building image '$EcrName' from context '$Path'..."
  if ($dockerfileArg -ne "") {
    # PowerShell: use Start-Process or call docker directly; here we call docker with arguments split
    docker build --platform linux/amd64 --provenance=false -t $EcrName -f $Dockerfile $Path
  } else {
    docker build --platform linux/amd64 --provenance=false -t $EcrName $Path
  }

  $remote = "975050237180.dkr.ecr.us-east-1.amazonaws.com/${EcrName}:latest"
  docker tag ${EcrName}:latest $remote
  docker push $remote

  Write-Host "Pushed $remote"
  exit 0
}
catch {
  Write-Error "ERROR: $($_.Exception.Message)"
  exit 1
}