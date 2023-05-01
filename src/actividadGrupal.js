console.log ("Hello World")

d3.json ("https://gist.githubusercontent.com/double-thinker/817b155fd4fa5fc865f7b32007bd8744/raw/13068b32f82cc690fb352f405c69c156529ca464/partidos2.json").then (function (datosCompletos){
    
    
    // NUEVA VARIABLE CON LA INFO DE PARTIDOS DEL NUEVO DATASET
    var datos = datosCompletos.partidos
    //En nuestro caso será:
    //var datos = datosCompletos.Metricas
    
    
    
    console.log ("los datos ya se han recibido")
    
    var height = 600
    var width = 400
    
    var margin  = {
        top: 20,
        botton: 50,
        left:40,
        right:50
            
    }
    
    //var elementosvg=d3.select ("#grafica1")
    var svgGraficaBarras=d3.select ("body")
        .append("svg")
        .attr("width",width)
        .attr("height",height)
    
    
    
    
    
    // var svgHistograma=d3.select ("#grafica2")
    var svgGraficaLineas=d3.select ("body")
        .append("svg")     
        .attr("width",width)
        .attr("height",height)
    
    
    
})