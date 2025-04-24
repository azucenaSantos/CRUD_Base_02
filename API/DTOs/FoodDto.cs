
namespace API.DTOs
{
    public class FoodDto
    {
        //Propiedades que vamos a mostrar de cada food
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public decimal Precio { get; set; }
        public bool Saludable { get; set; }
        //Propiedades del tipo de food
        public TypeDto TypeEntity { get; set; } // Id del TypeEntity
        


    }
}