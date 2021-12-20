import { type } from "os";
import { Cliente } from "./cliente";
import { Producto } from "./productos";

export interface Venta{
    id:string;
    cliente?:Cliente;
    productos:ProductoVenta[];
    ventaTotal:number;
    estado:EstadoVenta;
    fecha:Date;
    valoracion:number;
}

export interface ProductoVenta{
    producto:Producto;
    cantidad:number;
}

export type EstadoVenta = 'enviado' | 'visto' |'camino'|'entregado';