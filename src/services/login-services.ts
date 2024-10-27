import { useMutation } from "@apollo/client";
import { ADMIN_LOGIN } from "@/graphql/mutations/login";
import cookies from 'js-cookie'; 
import { LoginResponse, LoginVariables } from "@/interfaces/login";

// Custom hook for admin login service
const adminLoginService = () => {
    // Define the adminLogin mutation and its loading/error states
    const [adminLogin, { loading, error }] = useMutation<LoginResponse, LoginVariables>(ADMIN_LOGIN);

    // Function to handle admin login
    const login = async (email: string, password: string) => {
        try {
            // Execute the admin login mutation
            const { data } = await adminLogin({
                variables: { email, password }
            });

            // If login is successful, store the token in cookies
            if (data) {
                const { token, admin } = data.adminLogin;
                cookies.set('adminToken', token, { expires: 2 / 24 }); // Token expires in 2 hours
                return { token, admin };
            }
        } catch (error: unknown) {
            // Handle errors appropriately
            if (error instanceof Error) {
                throw new Error(error.message);
            }
            throw new Error('An unexpected error has occurred during login. Please try again.');
        }
    };

    return { login, loading, error }; // Return the login function and loading/error states
}

export default adminLoginService;
