using API.Data;
using API.DTOs;
using API.Entities;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace API.Controllers
{
    public class FoodsController : BaseApiController
    {
        private readonly DataContext _context; //Inyectamos el contexto de datos para acceder a la base de datos
        private readonly IMapper _mapper;

        public FoodsController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        //Acceso todos los datos
        [HttpGet] //GET
        /*public async Task<ActionResult<IEnumerable<FoodEntity>>> GetFoods()
        {
            var foods = await _context.Foods.ToListAsync();
            return foods; //Retornamos la lista de usuarios
        }*/
        //Ahora no devolvemos FoodEntity, devolvemos FoodDto con los valores de food+type
        public async Task<ActionResult<List<FoodDto>>> GetFoods()
        {
            //Recogemos las comidas incluyendo el tipo de entidad
            var foods = await _context.Foods.Include(f => f.TypeEntity).ToListAsync();
            var foodsToReturn = _mapper.Map<List<FoodDto>>(foods);
            return Ok(foodsToReturn);
        }
        //Acceso por id
        /*[HttpGet("{id}")] //GET api/users/1 --> especificamos el id del usuario a obtener
        public async Task<ActionResult<FoodEntity>> GetFood(int id)
        {
            return await _context.Foods.FindAsync(id);
        }*/

        //Funciones de añadir y borrar comidas en la base de datos
        //Añadir:
        [HttpPost("add")]
        public async Task<ActionResult> AddFood(FoodDto newFood)
        {
            if (newFood == null) return BadRequest("Invalid food data");
            if (await FoodExists(newFood.Id)) return BadRequest("Id is taken");

            //Buscar la entidad del tipo a partir del foodDto que se ha pasado
            //Una vez encontrada se crea un FoodEntity con los valores del dto junto con los del tipo
            //Guardamos datos en la base de dato
            var typeFind = await _context.Types.FindAsync(newFood.TypeEntity.Id);
            
            //Creo una foodEntity 
            var foodToSave = new FoodEntity
            {
                Id = newFood.Id,
                Nombre = newFood.Nombre,
                Descripcion = newFood.Descripcion,
                Precio = newFood.Precio,
                Saludable = newFood.Saludable,
                IdTypeEntity = typeFind.Id,
                TypeEntity = typeFind
            };

            //Guardamos y almacenamos la nueva comida en la BD
            _context.Foods.Add(foodToSave);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPut("{id}")]

        public async Task<ActionResult> UpdateFood(int id, FoodDto updatedFood)
        {
            if (id != updatedFood.Id) return BadRequest("ID mismatch");
            var food = await _context.Foods.FindAsync(id);
            if (food == null) return NotFound("Food not found");

            var typeFind = await _context.Types.FindAsync(updatedFood.TypeEntity.Id);
            //asigno nuevos valores la entidad
            food.Nombre = updatedFood.Nombre;
            food.Descripcion = updatedFood.Descripcion;
            food.Precio = updatedFood.Precio;
            food.Saludable = updatedFood.Saludable;
            food.IdTypeEntity= updatedFood.TypeEntity.Id;
            food.TypeEntity= typeFind;
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