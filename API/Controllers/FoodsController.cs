
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class FoodsController : BaseApiController
    {
        private readonly DataContext _context; //Inyectamos el contexto de datos para acceder a la base de datos

        public FoodsController(DataContext context)
        {
            _context = context;
        }

        //Acceso todos los datos
        [HttpGet] //GET api/users
        public async Task<ActionResult<IEnumerable<FoodEntity>>> GetFoods()
        {
            var foods = await _context.Foods.ToListAsync();
            return foods; //Retornamos la lista de usuarios
        }

        //Acceso por id
        [HttpGet("{id}")] //GET api/users/1 --> especificamos el id del usuario a obtener
        public async Task<ActionResult<FoodEntity>> GetFood(int id)
        {
            return await _context.Foods.FindAsync(id);
        }

        //Funciones de añadir y borrar comidas en la base de datos
        //Añadir:
        [HttpPost("add")]
        public async Task<ActionResult> AddFood(FoodEntity newFood)
        {
            if (newFood == null) return BadRequest("Invalid food data");
            if (await FoodExists(newFood.Id)) return BadRequest("Id is taken");
            _context.Foods.Add(newFood);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateFood(int id, FoodEntity updatedFood)
        {
            if (id != updatedFood.Id) return BadRequest("ID mismatch");
            var food = await _context.Foods.FindAsync(id);
            if (food == null) return NotFound("Food not found");
            //asigno nuevos valores la entidad
            food.Nombre = updatedFood.Nombre;
            food.Descripcion = updatedFood.Descripcion;
            food.Precio = updatedFood.Precio;
            food.Saludable = updatedFood.Saludable;

            await _context.SaveChangesAsync();
            return Ok();

        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> RemoveFood(int id)
        {
            if (await FoodExists(id))
            {
                var foodToRemove = await _context.Foods.FindAsync(id);
                if (foodToRemove == null) return NotFound("Food not found");
                _context.Foods.Remove(foodToRemove);
                await _context.SaveChangesAsync();
                return Ok();
            }
            else
            {
                return BadRequest("Id doesn't exist");
            }
        }

        //Comprobar que la id no es la misma
        private async Task<bool> FoodExists(int idFoodSearch)
        {
            return await _context.Foods.AnyAsync(x => x.Id == idFoodSearch);
        }
    }
}