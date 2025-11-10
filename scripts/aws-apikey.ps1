param(
    [string]$ApiKeyId
)
aws apigateway get-api-key --api-key $ApiKeyId --include-value