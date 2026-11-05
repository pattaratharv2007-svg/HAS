@echo off
setlocal
echo ========================================================
echo  Starting CareLink MediSync Backend (Spring Boot 8080)
echo ========================================================

set "JAVA_HOME=C:\Program Files\Java\jdk-17"
set "PATH=%JAVA_HOME%\bin;%PATH%"

cd /d "%~dp0backend"

if exist "%USERPROFILE%\.m2\wrapper\dists\apache-maven-3.10.0\2aaba761688b1a6ea5a46e7e5f4d5406ed7a75ee8da95e5e3079863a23461c9b\bin\mvn.cmd" (
    call "%USERPROFILE%\.m2\wrapper\dists\apache-maven-3.10.0\2aaba761688b1a6ea5a46e7e5f4d5406ed7a75ee8da95e5e3079863a23461c9b\bin\mvn.cmd" spring-boot:run
) else (
    call mvn spring-boot:run
)

pause

