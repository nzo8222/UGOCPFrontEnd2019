export interface LoginDTO {
    usuario: string;
    password: string;
    recordar: boolean;
}
export interface RegistroUsuarioDTO {
    usuario: string;
    password: string;
    email: string;
}
export interface LoginDTO {
    usuario: string;
    password: string;
    recordar: boolean;
}

export interface SessionModel {
    userId: string;
    expiresIn: number;
    jwtToken: string;
    email: string;
    role: string;
}
export interface EstadoDTO {
    nombre: string;
    id: number;
}

export interface DTOidEstado{
    id:number;
}

export interface MunicipioDTO{
    id:number;
    nombre:string;
}

export interface LocalidadDTO{
    id:number;
    nombre:string;
}

export interface DTOidMunicipio{
    id:number;
}