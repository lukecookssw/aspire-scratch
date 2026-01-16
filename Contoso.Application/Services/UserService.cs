using Contoso.Application.DTOs;
using Contoso.Infrastructure.Data;
using Contoso.Infrastructure.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Contoso.Application.Service;

public interface IUserService
{
    Task<UserDto> GetUserById(int id, CancellationToken ct);
}

public class UserService : IUserService
{
    private readonly IContosoDbContext _context;
    public UserService(IContosoDbContext context)
    {
        _context = context;
    }

    public async Task<UserDto> GetUserById(int id, CancellationToken ct)
    {
        User? user = await _context.Users.FirstOrDefaultAsync(ct);
        if (user == null)
            throw new Exception("User not found");

        return new UserDto
        {
            Id       = user.Id,
            Username = user.Username,
            Email    = user.Email
        };
    }
}