Esto es un proyecto para gestionar tu comercio de manera sencilla y eficiente.

# Instalación

## Local

Una vez descargado el proyecto, nos cambiamos a la rama `main` y debemos instalar las dependencias con el siguiente comando:
```bash
npm install
```

### Variables de entorno
Para generar las variables de entorno se requiere lanzar el comando:
```bash
npx dotenv-vault@latest login
```
En la consola nos aparecerá un **LINK** al que debemos acceder e iniciar sesión, seguiremos los pasos que nos
mostrará en la web.

> _En el caso de no tener acceso al proyecto, se debe de solicitar al administrador del proyecto._

Seguimos los pasos, en nuestro local deberíamos ver nuevos archivos `.env` y `.env.me` en la raíz del proyecto. En el caso
de no verlos, intentar lanzar el comando 
```shell
npx dotenv-vaul@latest pull development
```
Si lanzando ese comando vemos cambios en el archivo `.env.vault`, no preocuparse, ya que podría ser que se hicieron
cambios en las variables de entorno desde la web y esos cambios no se reflejaron en el repositorio. 

**Debemos hacer un commit específico solo para esto.**

### Configuración SSL en localhost
> _Requerido para el uso de las notificaciones push._

Debemos de tener instalado mkcert en nuestro pc, para ello, podemos seguir la [documentación oficial](https://github.com/FiloSottile/mkcert)
lo más recomendado es utilizar `choco` para instalarlo en Windows y `brew` en MacOS.

Una vez instalado, verificamos que se haya instalado correctamente con el siguiente comando:
```bash
mkcert
```
Nos debería de mostrar un mensaje similar a este:
```text
Usage of mkcert:

	$ mkcert -install
	Install the local CA in the system trust store.
	
	...
```

Luego debemos de instalar el certificado en nuestro pc, para ello, debemos de ejecutar
**con permisos de administrador** el siguiente comando:
```bash
mkcert -install
```
Reiniciamos el navegador (cerramos y volvemos a abrir) y podremos generar el certificado para nuestro proyecto
```bash
mkcert click2eat.localhost
```
Esto generará dos archivos con la extensión `.pem`, estos archivos debemos de moverlos a la carpeta `docker/nginx/certs`.
Debemos de asegurarnos que los archivos se llaman `click2eat.localhost.pem` y `click2eat.localhost-key.pem`.

### Iniciar el proyecto
Para el inicio, debemos de ejecutar el comando
```shell
docker compose up -d --force-recreate
```
Verificamos que los contenedores se hayan iniciado correctamente con el comando
```shell
docker ps
```
Cuando estén ambos contenedores corriendo, podemos acceder a la aplicación en https://click2eat.localhost