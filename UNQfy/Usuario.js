
class Usuario{
    constructor(nickName){
        this.id=undefined;
        this.canciones = [];
        this.dic = new Map();
        this.nickName = nickName;
        
               
    }
   getCancionesEscuchadas(){
       var canc  = new Set(this.canciones);
       return canc;
   }
   cuantasVecesEscuche(track){
     return this.dic.get(track);
   }
   escuchar(track){
        this.canciones.push(track);
        if(this.dic.has(track)){
            var cantidadNueva = this.dic.get(track) + 1;
            this.dic.set(track,cantidadNueva);
        }
        else{
            this.dic.set(track,1)
        }
       
   }
   tresMasEscuchadas(){
       var mapOrdenado = this.dic.sort((x, y) => x[1] - y[1]);
       var cancionesEscuchadas = mapOrdenado.values()
       var lasPrimeras3 = cancionesEscuchadas.slice(0,2);
       return lasPrimeras3;

   }
}
module.exports = Usuario;