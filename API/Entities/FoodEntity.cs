using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    public class FoodEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] //autoincremental
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public decimal Precio { get; set; }
        public bool Saludable { get; set; }

        

        //Relacion de foreign key entre tablas
        [ForeignKey("TypeEntity")] //Nombre entidad de la que recibe el id
        // Clave foránea para TypeEntity
        public int IdTypeEntity { get; set; } // Id del TypeEntity
        public TypeEntity TypeEntity { get; set; } // Entidad (id+nombre)

    }
}