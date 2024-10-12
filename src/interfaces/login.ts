export interface LoginFormField{
    email: string;
    password: string;
}

export interface LoginVariables{
    email: string;
    password: string;
}

export interface LoginResponse{
    adminLogin:{
        token:string;
        admin:{
            id: string;
            email: string;
            name: string;
        }
    }
}