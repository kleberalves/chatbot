param
(
[Parameter(Mandatory=$true)]
[string]$caminho
)
cd $caminho
npm start --silent