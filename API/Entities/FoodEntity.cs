namespace API.Entities
{
    public class FoodEntity
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public int Precio { get; set; }
        public bool Saludable { get; set; }
        
    }
}