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

        // Clave foránea para TypeEntity
        public int TypeEntityId { get; set; } // Id del TypeEntity

        //Relacion de foreign key entre tablas
        [ForeignKey("TypeEntityId")]
        public TypeEntity TypeFood { get; set; } // Relación con TypeEntity

    }
}