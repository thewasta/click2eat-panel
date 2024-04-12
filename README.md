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

### Iniciar el proyecto

Y a continuación, ejecutamos el siguiente comando para iniciar el proyecto:
```bash
npm run dev
```
En la terminal veremos un mensaje similar a este:
```text
> restauranteqr-frontend@0.1.1 dev
> next dev

   ▲ Next.js 14.1.1
   - Local:        http://localhost:3000
   - Environments: .env.local, .env
```

Podremos acceder a la aplicación en `http://localhost:3000`.

# Subir cambio al repositorio

Antes de subir cambios, asegurarse de que el proyecto funciona correctamente. Para ello, ejecutar el siguiente comando:
```bash
npm run build
```
Esto compilará el proyecto y generará una carpeta llamada `.next` en la raíz del proyecto. Luego debemos de iniciar la aplicación
con el siguiente comando:
```bash
npm run start
```
Nos iniciará la aplicación el puerto `3000` y podremos acceder a ella en `http://localhost:3000`.
Y debemos de hacer las pruebas de funcionalidad y de diseño para asegurarnos de que todo funciona correctamente.
Ya que cuando se está en desarrollo, _next_ no compila los archivos de la misma manera que cuando se hace un `build` o el uso de la cache
lo hace distinto y puede ocasionar errores no esperados.