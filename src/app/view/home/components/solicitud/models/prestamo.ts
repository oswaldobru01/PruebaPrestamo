export interface Prestamo {
    id : number;
    cedula: string;
    valorSolicitado: number;
    fechaPagar?: Date;
    pago: boolean;
}
