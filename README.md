# Entity API

## Descripción

Esta API permite gestionar entidades de manera eficiente. Proporciona endpoints para crear, leer, actualizar y eliminar entidades.

## Instalación

Para instalar las dependencias necesarias, ejecute:

```bash
npm install
```

## Uso

Para iniciar el servidor, ejecute:

```bash
npm start
```

## Migraciones

Para manejar las migraciones de la base de datos, utilice Prisma. Ejecute el siguiente comando para aplicar las migraciones:

```bash
npx prisma migrate dev --name init
```

Reemplace `init` con un nombre descriptivo para la migración.

## Endpoints

### Obtener todas las entidades

```http
GET /entities
```

### Crear una nueva entidad

```http
POST /entities
```

### Obtener una entidad por ID

```http
GET /entities/:id
```

### Actualizar una entidad por ID

```http
PUT /entities/:id
```

### Eliminar una entidad por ID

```http
DELETE /entities/:id
```

## Licencia

Este proyecto está bajo la Licencia MIT.
