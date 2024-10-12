import { useMutation } from "@apollo/client";
import { ADMIN_LOGIN } from "@/graphql/mutations/login";
import cookies from 'js-cookie'; 
import { LoginResponse, LoginVariables } from "@/interfaces/login";

const adminLoginService = () =>{
    const[adminLogin, {loading, error}] = useMutation<LoginResponse, LoginVariables>(ADMIN_LOGIN);

    const login = async (email: string, password: string) => {
        try {
            const { data }  = await adminLogin({
                variables: { email, password }
            });

            if(data){
                const {token, admin} = data.adminLogin;

                cookies.set('adminToken', token, {expires: 2 / 24});

                return { token, admin };
            }
        } catch (error : unknown) {
            if(error instanceof Error){
                throw new Error (error.message);
            }
            throw new Error('An unexpected error has occured during login. Please try again');
        }
    };

    return { login, loading, error };
}

export default adminLoginService;