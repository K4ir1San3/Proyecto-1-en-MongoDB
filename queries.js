// -- Top 50 Productos por Unidades Vendidas -- //

db.ordenes.aggregate(
[
  {
    $unwind: "$productos"
  },
  {
    $group: {
      _id: "$productos.producto_id",
      unidades_vendidas: {
        $sum: "$productos.cantidad"
      },
      ventas_totales: {
        $sum: "$productos.ventas"
      },
      pedidos_totales: {
        $sum: 1
      }
    }
  },
  {
    $lookup: {
      from: "productos",
      localField: "_id",
      foreignField: "_id",
      pipeline: [
        {
          $project: {
            nombre: 1,
            categoria: 1,
            subcategoria: 1
          }
        }
      ],
      as: "producto"
    }
  },
  {
    $unwind: "$producto"
  },
  {
    $sort: {
      unidades_vendidas: -1
    }
  },
  {
    $limit: 50
  },
  {
    $project: {
      _id: 0,
      producto_id: "$_id",
      nombre: "$producto.nombre",
      categoria: "$producto.categoria",
      subcategoria: "$producto.subcategoria",
      unidades_vendidas: 1,
      ventas_totales: 1,
      pedidos_totales: 1
    }
  }
])


// -- Ordenes totales por producto -- //

db.ordenes.aggregate(
([
  {
    $match: {
      "productos.producto_id": { $exists: true }
    }
  },

  // Expande productos
  { $unwind: "$productos" },

  // Agrupación por producto_id
  {
    $group: {
      _id: "$productos.producto_id",
      ordenesTotales: { $sum: 1 },
      ventasTotales: { $sum: "$productos.ventas" },
      cantidadTotal: { $sum: "$productos.cantidad" }
    }
  },

  // Traer nombre/categoría desde colección productos
  {
    $lookup: {
      from: "productos",
      localField: "_id",
      foreignField: "_id",
      pipeline: [
        { $project: { nombre: 1, categoria: 1 } }
      ],
      as: "prod"
    }
  },

  { $unwind: "$prod" },

  // Formato final
  {
    $project: {
      _id: 0,
      producto_id: "$_id",
      nombre: "$prod.nombre",
      categoria: "$prod.categoria",
      ordenesTotales: 1,
      ventasTotales: 1,
      cantidadTotal: 1
    }
  },

  // Ordenar por ventas (opcional)
  { $sort: { ventasTotales: -1 } }
])
)

// -- Total de ordenes por rango de prioridad -- //  

db.ordenes.aggregate(
[
  {
    $addFields: {
      prioridad_num: {
        $switch: {
          branches: [
            { case: { $eq: ["$pedido_prioridad", "Low"] }, then: 1 },
            { case: { $eq: ["$pedido_prioridad", "Medium"] }, then: 2 },
            { case: { $eq: ["$pedido_prioridad", "High"] }, then: 3 },
            { case: { $eq: ["$pedido_prioridad", "Critical"] }, then: 4 }
          ],
          default: 0
        }
      }
    }
  },

  {
    $bucket: {
      groupBy: "$prioridad_num",
      boundaries: [1, 2, 3, 4, 5],
      default: "Desconocido",
      output: {
        total_pedidos: { $sum: 1 }
      }
    }
  },

  {
    $addFields: {
      prioridad: {
        $switch: {
          branches: [
            { case: { $eq: ["$_id", 1] }, then: "Baja" },
            { case: { $eq: ["$_id", 2] }, then: "Media" },
            { case: { $eq: ["$_id", 3] }, then: "Alta" },
            { case: { $eq: ["$_id", 4] }, then: "Crítica" }
          ],
          default: "Desconocida"
        }
      }
    }
  },

  {
    $project: {
      _id: 0,
      prioridad: 1,
      total_pedidos: 1
    }
  }
])



/*
Las siguientes consultas son mejores realizarlas en el apartado de
agregaciones en MongoDB Compass para un resultado inmediato
*/

// -- Búsqueda fuzzy de producto por categoria y/o subcategoria -- //

([
  {
    $search: {
      index: "categoria_subcategoria_busqueda",
      compound: {
        should: [
          {
            text: {
              query: "<tu-texto-a-buscar>",
              path: "categoria",
              fuzzy: { maxEdits: 2 }
            }
          },
          {
            text: {
              query: "<tu-texto-a-buscar>",
              path: "sub_categoria",
              fuzzy: { maxEdits: 2 }
            }
          }
        ]
      }
    }
  },
  {
    $project: {
      _id: 1,
      nombre: 1,
      categoria: 1,
      sub_categoria: 1,
      score: { $meta: "searchScore" }
    }
  },
  { $sort: { score: -1 } }
])


// -- Búsqueda de producto por nombre -- //

[
  {
    $search: {
      index: "nombre_busqueda",
      text: {
        query: "string",
        path: "string"
      }
    }
  }
]

