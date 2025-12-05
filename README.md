# DESCRIPCIÓN DEL PROYECTO
Este proyecto tiene como objetivo observar el procesamiento y análisis de datos en una base de datos NOSQL, específicamente en MongoDB por medio de la plataforma MongoDB Atlas. Se trabajará con una base de datos de ejemplo llamada "Global Market", la cual contiene información sobre órdenes, productos y clientes.

## Archivos del repositorio
### Validacion.js
Contiene los scripts necesarios para colocar las validaciones en las colecciones de la base de datos, estas validaciones permiten que cualquier actualización o inserción cumpla con las reglas definidas para mantener la integridad de los datos.

### queries.js
Contiene consultas generales y relevantes para la base de datos, estas consultas pueden ser utilizadas como referencia para realizar análisis y obtener información valiosa de los datos almacenados.

# Cómo cargar la Base de Datos en MongoDB Atlas
Previo a este paso necesita tener una cuenta en MongoDB Atlas y tener creado un clúster, siga los siguientes pasos para cargar la base de datos:
* Descargar los siguientes archivos:
    * Global.Market.ordenes.json
    * Global.Market.productos.json
    * Global.Market.clientes.json

* Crear colecciones para cada uno de los archivos en la base de datos que desee e importe los archivos
* Luego puede proceder a crear los índices necesarios para optimizar las consultas que se especifican a continuación.


# CREACIÓN DE INDICES TRADICIONALES PARA LAS COLECCIONES
Para agregar los indices requeridos a las colecciones de la base de datos, se debe ejecutar el siguiente script en la consola de MongoDB.

**NOTA: los nombres que le coloque a la colección y los atributos deben coincidir con los aparezcan en los scripts, de lo contrario, debe asegurarse de cambiarlos para que coincidan.**

```javascript
db.ordenes.createIndex(
  { "productos.producto_id": 1 },
  { name: "productos.producto_id_1" }
);

print("Índice 'productos.producto_id_1' creado en colección 'ordenes'");

db.ordenes.createIndex(
  { "fecha_pedido": -1 },
  { name: "fecha_pedido_-1" }
);

print("Índice 'fecha_pedido_-1' creado en colección 'ordenes'");

db.ordenes.createIndex(
  { "clase_envio": 1, "pedido_prioridad": 1 },
  { name: "clase_envio_1_pedido_prioridad_1" }
);

print("Índice 'clase_envio_1_pedido_prioridad_1' creado en colección 'ordenes'");



db.productos.createIndex(
    { "nombre": 1 },
    { 
      name: "nombre_1",
      background: true
    }
  );
  print("Índice 'nombre_1' creado en colección 'productos'");
  
 
db.productos.createIndex(
    { "categoria": 1 },
    { 
      name: "categoria_1",
      background: true
    }
  );
  print("Índice 'categoria_1' creado en colección 'productos'");
```

# CREACION DE INDICES DE BUSQUESDA DE TEXTO PARA LAS COLECCIONES
Los siguientes scripts deben ejecutarse en el apartado de Atlas -> Database -> Search -> Create Search Index.

En **Create Search Index** seleccionar la colección correspondiente y pegar el siguiente código en el apartado de **Index Definition**:

### Indice de busqueda por categoría y subcategoría en la coleccion de productos con Json Editor:

```json
{
  "mappings": {
    "dynamic": false,
    "fields": {
      "categoria": {
        "type": "string"
      },
      "sub_categoria": {
        "type": "string"
      }
    }
  }
}
```

### Indice de busqueda por nombre en la colección de productos:
```json
{
  "mappings": {
    "dynamic": false,
    "fields": {
      "nombre": {
        "analyzer": "lucene.standard",
        "searchAnalyzer": "lucene.standard",
        "type": "string"
      },
      "nombre_autocomplete": {
        "analyzer": "lucene.standard",
        "type": "autocomplete"
      }
    }
  }
}
```     
