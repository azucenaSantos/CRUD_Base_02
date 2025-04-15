
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
    }
}