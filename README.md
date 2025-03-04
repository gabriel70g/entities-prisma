# Entity API

## Descripción

Esta API permite gestionar entidades de manera eficiente, proporcionando endpoints para crear, leer, actualizar y eliminar datos.

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

## Tecnologías utilizadas

- NestJS como framework backend.
- Prisma ORM para la gestión de base de datos.

## Configuración y Expansión

Si necesitas agregar más entidades, sigue estos pasos:

1. Agrega la nueva entidad en el esquema de Prisma (`prisma/schema.prisma`).
2. Ejecuta la migración con Prisma (`npx prisma migrate dev --name nombre_de_la_migracion`).
3. Crea un nuevo recurso en NestJS (`nest generate resource nombre-entidad`).
4. Modifica el recurso generado según los requerimientos del proyecto.

## Licencia

Este proyecto está bajo la Licencia MIT.
