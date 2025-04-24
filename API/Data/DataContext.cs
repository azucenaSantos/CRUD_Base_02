using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<FoodEntity> Foods { get; set; } //Representa tablas dentro de nuestra base de datos "Tabla: Foods"
                                                     //y las columnas serán las propiedades que hemos aplicado a la entidad
        public DbSet<TypeEntity> Types { get; set; } //Tabla de tipos

    }
}