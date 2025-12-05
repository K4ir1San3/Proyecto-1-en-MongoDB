/*

Los siguientes scripts se pueden colocar en la terminal de MongoDB
En caso de que se agreguen directamente en el apartado de validación 
en las colecciones, entonces se colocará solo el bloque que corresponde
a $jsonSchema.

*/


// 1. Validación para 'clientes'

db.runCommand({
  collMod: "clientes",
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: [
        'clase_envio',
        'cliente_id',
        'fecha_envio',
        'fecha_pedido',
        'pedido_prioridad',
        'productos'
      ],
      properties: {
        _id: {
          bsonType: [
            'string',
            'objectId'
          ],
          description: 'ID único del documento'
        },
        clase_envio: {
          bsonType: 'string',
          'enum': [
            'First Class',
            'Same Day',
            'Second Class',
            'Standard Class'
          ],
          description: 'Tipo de envío válido'
        },
        cliente_id: {
          bsonType: 'string',
          pattern: '^[A-Z]{2}-\\d{5}$',
          description: 'Formato: XX-12345'
        },
        fecha_envio: {
          bsonType: 'string',
          pattern: '^\\d{2}-\\d{2}-\\d{4}$',
          description: 'Formato DD-MM-YYYY'
        },
        fecha_pedido: {
          bsonType: 'string',
          pattern: '^\\d{2}-\\d{2}-\\d{4}$',
          description: 'Formato DD-MM-YYYY'
        },
        pedido_prioridad: {
          bsonType: 'string',
          'enum': [
            'Critical',
            'High',
            'Medium',
            'Low'
          ],
          description: 'Prioridad válida'
        },
        productos: {
          bsonType: 'array',
          minItems: 1,
          maxItems: 100,
          description: 'Array con al menos 1 producto',
          items: {
            bsonType: 'object',
            required: [
              'producto_id',
              'cantidad',
              'ventas'
            ],
            properties: {
              producto_id: {
                bsonType: 'string',
                pattern: '^[A-Z]{3}-[A-Z]{2}-\\d{8}$',
                description: 'Formato: ABC-DE-12345678'
              },
              cantidad: {
                bsonType: 'int',
                minimum: 1,
                maximum: 1000,
                description: 'Cantidad entre 1 y 1000'
              },
              ventas: {
                bsonType: [
                  'double',
                  'int',
                  'decimal'
                ],
                minimum: 0,
                description: 'Ventas no negativas'
              },
              descuento: {
                bsonType: [
                  'double',
                  'int',
                  'decimal'
                ],
                minimum: 0,
                maximum: 1,
                description: 'Descuento entre 0 y 1 (ej: 0.5 = 50%)'
              },
              costo_envio: {
                bsonType: [
                  'double',
                  'int',
                  'decimal'
                ],
                minimum: 0,
                description: 'Costo de envío no negativo'
              }
            },
            additionalProperties: false
          }
        }
      },
      additionalProperties: false,
      description: 'Esquema para documentos de órdenes de venta'
    }
  },
  validationLevel: "strict",
  validationAction: "error"
});


// 2. Validación para 'ordenes'

db.runCommand({
  collMod: "ordenes",
  validator: {
      $jsonSchema: {
    bsonType: 'object',
    required: [
      'fecha_pedido',
      'cliente_id',
      'productos'
    ],
    properties: {
      fecha_pedido: {
        bsonType: 'string',
        pattern: '^\\d{2}-\\d{2}-\\d{4}$'
      },
      cliente_id: {
        bsonType: 'string',
        minLength: 3
      },
      productos: {
        bsonType: 'array',
        minItems: 1,
        items: {
          bsonType: 'object',
          required: [
            'producto_id',
            'cantidad',
            'ventas'
          ],
          properties: {
            producto_id: {
              bsonType: 'string'
            },
            cantidad: {
              bsonType: 'int',
              minimum: 1
            },
            ventas: {
              bsonType: [
                'double',
                'int'
              ],
              minimum: 0
            }
          }
        }
      },
      pedido_prioridad: {
        bsonType: 'string',
        'enum': [
          'Critical',
          'High',
          'Medium',
          'Low'
        ]
      },
      clase_envio: {
        bsonType: 'string',
        'enum': [
          'First Class',
          'Same Day',
          'Second Class',
          'Standard Class'
        ]
      }
    }
  }
  },
  validationLevel: "strict",
  validationAction: "error"
});


// 3. Validación para 'productos'

db.runCommand({
  collMod: "productos",
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: [
        '_id',
        'categoria',
        'nombre',
        'sub_categoria'
      ],
      properties: {
        _id: {
          bsonType: 'string'
        },
        categoria: {
          bsonType: 'string'
        },
        nombre: {
          bsonType: 'string'
        },
        sub_categoria: {
          bsonType: 'string'
        }
      }
    }
  },
  validationLevel: "strict",
  validationAction: "error"
});