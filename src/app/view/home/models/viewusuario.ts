export interface ViewUsuario{
    id: number
    cedula: string
    nombre : string
    email: string
    idPrestamo?: number
    valorSolicitado?: number
    fechaPagar? : Date
    pago?: boolean
}

