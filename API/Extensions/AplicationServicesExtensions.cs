
using API.Data;
using Microsoft.EntityFrameworkCore;


namespace API.Extensions
{
    public static class AplicationServicesExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services,
        IConfiguration config)
        {
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            return services;
        }
        
    }
}