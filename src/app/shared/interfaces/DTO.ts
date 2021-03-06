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

export interface DTOidEstado {
    id: number;
}

export interface MunicipioDTO {
    id: number;
    nombre: string;
}

export interface LocalidadDTO {
    id: number;
    nombre: string;
}

export interface DTOidMunicipio {
    id: number;
}

export interface DTODatosUsuario {
    id: string;
    fullName: string;
    address: string;
    idLocalidad: number;
    cellPhone: number;
    phoneNumber: number;
    dateOfBirth: Date;
    gender: string;
    civilStatus: string;
    ocupation: string;
    charge: string;
    curp: string;
    claveDeElector: string;
    numberINECredential: string;
    role: string;
}

export interface DTOEmpresa {
    idCompany: string;
    name: string;
    phoneNumber: number;
    address: string;
    idLocalidad: number;
    localidad: string;
    lstProduct: Product[];
    productCount: number;
}

export interface Product {
    idProduct: string;
    claveProductoServicio: number;
    descripcionProductoServicio: string;
    name: String;
    calidad: String;
    lstMonthsOfHarvest: MesConId[];
    cuantityInKG: number;
}
export interface ProductConNombreMes {
    idProduct: string;
    claveProductoServicio: number;
    name: String;
    calidad: String;
    monthsName: String;
    months: MesConId[];
    cuantityInKG: number;
    descripcionProductoServicio: string;
}

export interface MesConId{
    id: string;
    name: string;
}

export interface DTOPostDatosEmpresa {
    idUsuario: string;
    name: string;
    phoneNumber: number;
    address: string;
    idLocalidad: number;
}

export interface DTOUpdateDatosEmpresa {
    idUsuario: string;
    idEmpresa: string;
    name: string;
    phoneNumber: number;
    address: string;
    idLocalidad: number;
}

export interface DTOGetDatosProducto {
    idUsuario: string;
    idEmpresa: string;
}

export interface DTOPostDatosProducto {
    idUsuario: string;
    idEmpresa: string;
    claveProductoServicio: string;
    name: String;
    calidad: String;
    monthsOfHarvest: String[];
    cuantityInKG: number;
    descripcionProductoServicio: string;
}

export interface DTOClaveProdServ{
    codigo: string;
    descripcion: string;
}

export interface DTOUpdateDatosProducto {
    idProducto: string;
    idUsuario: string;
    idEmpresa: string;
    claveProductoServicio: string;
    name: String;
    calidad: String;
    startOfHarvest: Date;
    endOfHarvest: Date;
    cuantityInKG: number;
    descripcionProductoServicio: string;
}

export interface DTODeleteDatosProducto {
    idProducto: string;
    idUsuario: string;
    idEmpresa: string;
}

export interface DTODatosUsuarioConLocalidad {
    fullName: string;
    address: string;
    localidad: string;
    municipio: string;
    estado: string;
    cellPhone: number;
    phoneNumber: number;
    dateOfBirth: Date;
    gender: string;
    civilStatus: string;
    ocupation: string;
    charge: string;
    curp: string;
    claveDeElector: string;
    numberINECredential: string;
}

export interface DTODatosLocacion{
    estado: string;
    municipio: string;
    localidad: string;
}

export interface DTODatosClaveProductoServicioSat{
    codigo: number;
    descripcion: string;
}

export interface DTOEmpresaConLocalidadEnString {
    idCompany: string;
    name: string;
    phoneNumber: number;
    address: string;
    localidad: string;
    lstProduct: Product[];
}