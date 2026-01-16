export interface UserDto
{
    id: number;
    username: string;
    email: string;
}

export function useUserService() {
    const API_BASE_URL = import.meta.env.VITE_API_URL;

    const getUserById = async (id: number): Promise<UserDto> => {
        const response = await fetch(`${API_BASE_URL}/user/${id}`);
        if (!response.ok) {
            throw new Error(`Error fetching user with ID ${id}: ${response.statusText}`);
        }
        const user: UserDto = await response.json();
        return user;
    };

    return {
        getUserById,
    };
}