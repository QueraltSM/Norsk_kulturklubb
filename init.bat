@echo off

REM Inicia el servidor de la API
start node API\index.js

REM Inicia http-server y abre el navegador con el HTML deseado
start http-server && start "" http://localhost:8080/index.html