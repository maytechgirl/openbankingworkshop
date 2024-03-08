## Configuración del Entorno

### Archivo .env

Crea un archivo `.env` en la raíz de tu proyecto para definir variables de entorno. Aquí tienes un ejemplo de configuración:

### .env ejemplo
```bash
PERMISSIONS_OPTIONS_API_URL=https://run.mocky.io/v3/a4ff0f51-2b34-4369-ac5d-3deeb9797410
TRANSMITTERS_OPTIONS_API_URL=https://run.mocky.io/v3/88715074-23c3-4d87-bbeb-04b8973fec2a
TRANSMISSORA_URL=http://localhost:3000
DATA_URL=https://65e764a553d564627a8eb6d5.mockapi.io/process-demo
```
Asegúrate de que estas variables estén configuradas correctamente.

## Ejecutando el Proyecto
Modo de Desarrollo
Para ejecutar el servidor de desarrollo, utiliza el siguiente comando:

```bash
npm run dev
```
o
```bash
yarn dev
```

Para ejecutar el servidor de desarrollo en la puerta 3001, utiliza el siguiente comando:
```bash
PORT=3001 npm run dev
```

### Es necesario que la aplicación se ejecute en su máquina local para que pueda acceder
=======
# openbankingworkshop
openbankingworkshop