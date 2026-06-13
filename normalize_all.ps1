# normalize_all.ps1
# Script para remover todos os acentos e caracteres especiais do projeto de forma robusta

function Remove-Diacritics {
    param ([string]$string)
    if ([string]::IsNullOrEmpty($string)) { return $string }
    
    # Substituições manuais para cedilha e caracteres específicos
    $string = $string.Replace('ç', 'c').Replace('Ç', 'C')
    $string = $string.Replace('ã', 'a').Replace('Ã', 'A')
    $string = $string.Replace('õ', 'o').Replace('Õ', 'O')
    
    # Decomposição Unicode (separa a letra do acento)
    $normalized = $string.Normalize([System.Text.NormalizationForm]::FormD)
    
    # Remove os acentos (Non-Spacing Marks)
    $normalized = $normalized -replace '\p{Mn}', ''
    
    # Garante que apenas caracteres ASCII sejam mantidos
    $normalized = $normalized -replace '[^\x00-\x7F]', ''
    
    # Remove múltiplos espaços
    $normalized = $normalized -replace '\s+', ' '
    
    return $normalized.Trim()
}

$root = Get-Item .
Write-Host "Iniciando normalização robusta em $($root.FullName)"

# 1. Ajustar data-seed.js
$seedPath = "data-seed.js"
$seedContent = [IO.File]::ReadAllText($seedPath)

# 2. Renomear arquivos nos diretórios
$dirs = @("MATEMATICA", "FISICA", "QUIMICA")
foreach ($dir in $dirs) {
    if (Test-Path $dir) {
        $files = Get-ChildItem -Path $dir -Filter "*.pdf" -Recurse
        foreach ($file in $files) {
            $oldName = $file.Name
            $newName = Remove-Diacritics $oldName
            
            # Caminho relativo no disco
            $relativeDir = $file.DirectoryName.Replace($root.FullName, "").Replace("\", "/").Trim('/')
            
            # Renomear se o nome mudou
            if ($oldName -ne $newName) {
                Write-Host "Renomeando arquivo: $oldName -> $newName"
                Rename-Item -Path $file.FullName -NewName $newName -Force
            }
            
            # Caminho que pode estar no seedContent
            # O seedContent pode estar com MATEMÁTICA ou MATEMATICA, FME - RESOLUÇÕES ou FME-RESOLUCOES
            # Então vamos fazer uma busca ampla substituindo as variações do nome do arquivo
            $relativeCleanDir = $relativeDir.Replace("FME - RESOLUÇÕES", "FME-RESOLUCOES").Replace("TF - RESOLUÇÕES", "TF-RESOLUCOES")
            $relativeCleanDir = $relativeCleanDir.Replace("MATEMÁTICA", "MATEMATICA").Replace("FÍSICA", "FISICA").Replace("QUÍMICA", "QUIMICA")
            
            $oldPathOption1 = "MATEMATICA/$($relativeCleanDir.Replace('MATEMATICA/', ''))/$oldName"
            $oldPathOption2 = "MATEMÁTICA/$($relativeCleanDir.Replace('MATEMATICA/', '').Replace('FME-RESOLUCOES', 'FME - RESOLUÇÕES'))/$oldName"
            $oldPathOption3 = "FISICA/$($relativeCleanDir.Replace('FISICA/', ''))/$oldName"
            $oldPathOption4 = "FÍSICA/$($relativeCleanDir.Replace('FISICA/', '').Replace('TF-RESOLUCOES', 'TF - RESOLUÇÕES'))/$oldName"
            $oldPathOption5 = "QUIMICA/$($relativeCleanDir.Replace('QUIMICA/', ''))/$oldName"
            $oldPathOption6 = "QUÍMICA/$($relativeCleanDir.Replace('QUIMICA/', ''))/$oldName"
            
            $newPath = "$relativeCleanDir/$newName"
            
            $options = @($oldPathOption1, $oldPathOption2, $oldPathOption3, $oldPathOption4, $oldPathOption5, $oldPathOption6)
            foreach ($opt in $options) {
                if ($seedContent.Contains($opt)) {
                    Write-Host "Substituindo no seed: '$opt' -> '$newPath'"
                    $seedContent = $seedContent.Replace($opt, $newPath)
                }
            }
        }
    }
}

# 3. Fazer substituições gerais de pastas no data-seed.js para garantir que está tudo limpo
$seedContent = $seedContent.Replace("MATEMÁTICA/FME - RESOLUÇÕES/", "MATEMATICA/FME-RESOLUCOES/")
$seedContent = $seedContent.Replace("FÍSICA/TF - RESOLUÇÕES/", "FISICA/TF-RESOLUCOES/")
$seedContent = $seedContent.Replace("MATEMÁTICA/", "MATEMATICA/")
$seedContent = $seedContent.Replace("FÍSICA/", "FISICA/")
$seedContent = $seedContent.Replace("QUÍMICA/", "QUIMICA/")

[IO.File]::WriteAllText($seedPath, $seedContent)
Write-Host "Normalização robusta concluída com sucesso!"
