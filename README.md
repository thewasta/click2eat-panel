Esto es un proyecto para gestionar tu comercio de manera sencilla y eficiente.

# Instalación

Podemos utilizar en **local** o instalar **docker** y hacer uso de los contenedores.

### Local

Una vez descargado el proyecto, nos cambiamos a la rama `main` y debemos instalar las dependencias con el siguiente comando:
```bash
npm install
```
También debemos de actualizar nuestras variables de entorno del archivo `.env.local` con las variables de entorno que se encuentran en el archivo `.env.local`.
Asegurarse de que las variables de entorno sean correctas.

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

### Docker

Para instalar el proyecto con docker, debemos tener instalado docker en nuestro sistema. Una vez instalado, ejecutamos el siguiente comando:
```bash
docker compose up
```

Esto iniciará los contenedores y podremos acceder a la aplicación en `http://localhost:3000`.
Tener en cuenta que esto usa el archivo `docker-compose.yaml` no confundir con el archivo `docker-compose.pro.yaml`


# Despliegue
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