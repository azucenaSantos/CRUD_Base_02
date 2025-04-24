
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class TypesController : BaseApiController
    {
        private readonly DataContext _context; //Acceso a la base de datos

        public TypesController(DataContext context)
        {
            _context = context;
        }

        //End-point de acceso a los tipos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TypeEntity>>> GetTypes()
        {
            var types = await _context.Types.ToListAsync();
            return types; //lista de tipos de comida
        }

        //Acceso a un tipo por id
        /*[HttpGet("{id}")] //GET api/users/1
        public async Task<ActionResult<TypeEntity>> GetType(int id)
        {
            return await _context.Types.FindAsync(id); //devuelve un tipo
        }*/






    }
}