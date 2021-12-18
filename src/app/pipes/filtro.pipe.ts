import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtro'
})
export class FiltroPipe implements PipeTransform {

  transform(productos: any, buscado:any, page:number=0): any {
    if (buscado==='' || buscado.length<2) {
      return productos.slice(page, page+6)      
    }

    const resultadoPost=[];
    for( const producto of productos){
      if (producto.bodega.toLowerCase().indexOf(buscado.toLowerCase())>-1) {
        resultadoPost.push(producto);       
      } else if (producto.marca.toLowerCase().indexOf(buscado.toLowerCase())>-1) {
        resultadoPost.push(producto);        
      }else if (producto.variedad.toLowerCase().indexOf(buscado.toLowerCase())>-1) {
        resultadoPost.push(producto);        
      }else if (producto.varietal.toLowerCase().indexOf(buscado.toLowerCase())>-1) {
        resultadoPost.push(producto); 
    };
    return resultadoPost.slice(page, page+5)
    }
  }
}
