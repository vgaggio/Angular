using EmployeeCrudApi.Data;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using EmployeeCrudApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EmployeeCrudApi.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private ApplicationDbContext _context;

        public EmployeeController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<List<Employee>> GetAll()
        {
            return await _context.Employees.ToListAsync();
        }

        [HttpGet]
        public async Task<Employee> GetById(int id)
        {
            return await _context.Employees.FindAsync(id);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Employee employee)
        {

            //1. Verificar que el nombre no esté vacío o solo compuesto de espacios
            if (string.IsNullOrWhiteSpace(employee.Name))
            {
                return BadRequest("El nombre no puede estar vacío o compuesto solo de espacios.");
            }

            //2. Validar longitud máxima del nombre y apellido
            if (employee.Name.Length > 100)
            {
                return BadRequest("El nombre y apellido deben tener una longitud máxima de 100 caracteres.");
            }

            //3. Validar longitud mínima del nombre
            if (employee.Name.Length < 2)
            {
                return BadRequest("El nombre debe tener al menos dos caracteres.");
            }

            //4. Validar que el nombre no contenga números
            if (Regex.IsMatch(employee.Name, @"\d"))
            {
                return BadRequest("El nombre no debe contener números.");
            }

            //5. Verificar que cada parte del nombre tenga al menos 2 caracteres
            var nameParts = employee.Name.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            foreach (var part in nameParts)
            {
                if (part.Length < 2)
                {
                    return BadRequest("Cada parte del nombre debe tener al menos dos caracteres.");
                }
            }

            // Configurar la fecha de creación
            employee.CreatedDate = DateTime.Now;

            // Guardar el empleado en la base de datos
            await _context.Employees.AddAsync(employee);
            await _context.SaveChangesAsync();

            return Ok(employee);
        }


        [HttpPut]
        public async Task Update([FromBody] Employee employee)
        {
            Employee employeeToUpdate = await _context.Employees.FindAsync(employee.Id);
            employeeToUpdate.Name = employee.Name;
            await _context.SaveChangesAsync();
        }

        [HttpDelete]
        public async Task Delete(int id)
        {
            var employeeToDelete = await _context.Employees.FindAsync(id);
            _context.Remove(employeeToDelete);
            await _context.SaveChangesAsync();
        }
    }
}