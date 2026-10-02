# Export the face from the existing portrait without generating new artwork.
Add-Type -AssemblyName System.Drawing
$taskRoot = Split-Path -Parent $PSScriptRoot
$taskSource = [System.Drawing.Bitmap]::new((Join-Path $taskRoot 'src/assets/character/manan-poses.png'))
$taskIcon = [System.Drawing.Bitmap]::new(64, 64, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$taskGraphics = [System.Drawing.Graphics]::FromImage($taskIcon)
try {
    $taskGraphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
    $taskGraphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
    $taskGraphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
    $taskGraphics.DrawImage($taskSource, [System.Drawing.Rectangle]::new(0, 0, 64, 64),
        [System.Drawing.Rectangle]::new(690, 638, 450, 450), [System.Drawing.GraphicsUnit]::Pixel)
    $taskOutput = Join-Path $taskRoot 'public'
    New-Item -ItemType Directory -Path $taskOutput -Force | Out-Null
    $taskIcon.Save((Join-Path $taskOutput 'favicon.png'), [System.Drawing.Imaging.ImageFormat]::Png)
} finally {
    $taskGraphics.Dispose()
    $taskIcon.Dispose()
    $taskSource.Dispose()
}
