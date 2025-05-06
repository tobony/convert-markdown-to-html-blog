@echo off
REM Copy the release executable to the output folder
echo Copying release executable to output folder...

REM Create output directory if it doesn't exist
if not exist "output" mkdir output

REM Copy the executable
copy "src-tauri\target\release\convert-markdown-to-html-blog.exe" "output\"

REM Copy the latest MSI installer file to the output folder
echo Copying latest MSI installer to output folder...
for /f "delims=" %%i in ('dir /b /o:d "src-tauri\target\release\bundle\msi\convert-markdown-to-html-blog_*.msi"') do set "LATEST_MSI=%%i"
echo Latest MSI file: %LATEST_MSI%
copy "src-tauri\target\release\bundle\msi\%LATEST_MSI%" "output\"

echo Copy completed successfully!