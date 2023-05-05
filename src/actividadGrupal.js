d3.json("https://raw.githubusercontent.com/mahulo2009/d3-js-mercado-inmobiliario/main/data/indicadores_del_mercado_inmobiliario.json").then(function (datosCompletos) {

    console.log("Los datos ya se han recibido v1")

    // Definición de las variables

    // Fijar en alto y ancho del area donde se dibujará la gráfica.    
    var height = 800
    var width = 500

    // Los valores que queremos representar se encuentran en Repuesta/Datos/Metricas.
    // Aquí tenemos un array de 7 elementos con diferentes metricas según el siguiente
    // orden:

    // 1    Compraventa de viviendas a nivel mensual - Porcentaje de variación de nuevas Viviendas 
    //      con respecto al mismo mes del año anterior.
    
    // 2    Compraventa de viviendas a nivel mensual - Porcentaje de variación de Viviendas segunda mano
    //      con respecto al mismo mes del año anterior.
    
    // 3    Compraventa de viviendas a nivel mensual - Porcentaje de variación de Viviendas en general
    //      con respecto al mismo mes del año anterior.
    
    // 4    Compraventa de viviendas a nivel mensual - Porcentaje de variación de Euros/metro cuadrado 
    //      con respecto al mismo mes del año anterior.
    
    // 5    Hipotecas a nivel mensual - Porcentaje de variación de Número de hipotecas con respecto 
    //      al mismo mes del año anterior.
    
    // 6    Estos valores no son utilizados por el momento (formato de fecha distinto,es trimetre en vez de
    //      nombre del mes del año)
    
    // 7    Deuda de las familias a nivel mensual - Porcentaje de variación de Euros de la deuda 
    //      con respecto al mismo mes del año anterior
      
    // Se almacena en la vaible las metricas.
    var metricas = datosCompletos.Respuesta.Datos.Metricas
    

    // Con el objetivo de facilitar la creación de el eje X como escala temporal,
    // se transformará la fecha, que viene dada en dos campos, Agno y Periodo, a un 
    // formato fecha estandar: YYYY-MM-DD. Para ello se crea un mapeo entre nombre de
    // mes y número del mes en el año.
    var meses = {
        "Enero": 1,
        "Febrero": 2,
        "Marzo": 3,
        "Abril": 4,
        "Mayo": 5,
        "Junio": 6,
        "Julio": 7,
        "Agosto": 8,
        "Septiembre": 9,
        "Octubre": 10,
        "Noviembre": 11,
        "Diciembre": 12
    };

    // Se itera primero por las metricas, y luego por los datos dentro de las métricas,
    // para crear un nuevo campo 'fecha' que contiene la fecha según formato YYYY-MM-DD.
    // Para la metrica 6, donde Periodo no representa mes sino trimestre, la transformación
    // no está contemplada.
    metricas.forEach(function (d0) {
        d0.Datos.forEach(function (d1) {
            var fecha = d1.Agno + "-" + (meses[d1.Periodo] < 10 ? "0" : "") + meses[d1.Periodo] + "-01";
            d1.fecha = fecha;
        });
    });
    
    // Se definen los margenes para la gráfiac.
    var margen = { superior: 50, derecho: 20, inferior: 30, izquierdo: 50 };

    // Como elemento base donde dibujar la grafica de lineas se selecciona
    // el div con identificador grafiacaLineas
    var divgraficaLineas = d3.select("#graficaLineas")

    // Se crea el svg con ancho, alto en el grupo (g). Luego se translada
    // según los margenes definidos.
    var svg = divgraficaLineas
        .append("svg")
        .attr("width", height + margen.izquierdo + margen.derecho)
        .attr("height", width + margen.superior + margen.inferior)
        .append("g")
        .attr("transform", "translate(" + margen.izquierdo + "," + margen.superior + ")");

    // Para definir la escala se utiliza la metrica 0, ya que esta
    // sería la que podría tener un rango mayor y válido para el resto.

    // Una posibles mejora sería calcular un rango, teniendo en cuenta cada métrica, que cubra
    // los valores de todas ellas.
    datos = metricas[0].Datos

    // En el ejeX se utiliza una escala temporal, haciendo uso del nuevo campo fecha, creado con el
    // formato adecuado para poder crear un tipo de datos Date que la librería es capaz de interpretar.
    // Este dominio sería la fecha, y el rango el ancho de la gráfica.

    var escalaX = d3.scaleTime()
        .domain(d3.extent(datos, function (d) { return new Date(d.fecha); }))
        .range([0, height]);

    // En el eje Y se utilizan los valores máximos y minimos (más unos margenes de 20, para que las graficas de lineas no queden 
    // ajustadas al los límites), y se define un rango del alto de la gráfica.
    var escalaY = d3.scaleLinear()
        .domain([d3.min(datos, function (d) { return d.Valor; }) - 20, d3.max(datos, function (d) { return d.Valor; }) + 20])
        .range([width, 0]);

    // Se aplica la escala al ejeX
    var ejeX = d3.axisBottom(escalaX);

    // Se aplica la escala al ejeY
    var ejeY = d3.axisLeft(escalaY);

    // Se añade un título a la gráfica.
    svg.append('text')
        .attr('x', height / 2)
        .attr('y', 0)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('font-size', 20)
        .text("Indicadores del mercado inmobiliario");

    /*
        todo ver como hacer la leyenda
    svg.append('text')
        .attr('x', height / 2)
        .attr('y', 25)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('font-size', 20)
        .text("Porcentaje de variacion vivienda nuevas");
    */

    // Se añade el ejeX al svg grupo (g) , y se translada para situarlo,
    // en la parte inferior de la gráfica.
    svg.append("g")
        .attr("transform", "translate(0," + width + ")")
        .call(ejeX);

    // Se añade el ejeY al svg grupo (g).
    svg.append("g")
        .call(ejeY);

    // Para cada una de las métricas.    
    var ID = 0;
    metricas.forEach(function (d0) {

        // Se crea una línea conde la coordenada X sería la fecha y la coordenada Y sería el valor.
        // Se suaviza la curva con función MonotoneX.
        var linea = d3.line()
            .x(function (d) { return escalaX(new Date(d.fecha)); })
            .y(function (d) { return escalaY(d.Valor); })
            .curve(d3.curveMonotoneX)

        // Se vincula a la linea los valores, créandose con una configuraión de color, relleno etc...
        // Se añade un ID a la clase para luego poder activarse/desactivarse mediante acciones de botón.    


        svg.append("path")
            .datum(d0.Datos)
            .attr("d", linea)
            .attr("stroke", "grey")
            .attr("fill", "none")
            .style("stroke-width", "2")
            .style("display", "none")
            .attr("id", ID);

        svg.selectAll(".dot")
            .data(d0.Datos)
            .enter().append("circle")
            .attr("cx", (function (d) { return escalaX(new Date(d.fecha)); }))
            .attr("cy",(function (d) { return escalaY(d.Valor); }))
            .attr("r", 4)
            .style("display", "none")
            .attr("id", ID)
            .attr("fill", "grey");            

        ID++;

    });

    // Se crear una estructura de datos para guardar si línea está siendo visualizada o no.
    var lineasVisibles = {
        linea1: true,
        linea2: false,
        linea3: false,
        linea4: false,
        linea5: false,
        linea6: false,
        linea7: false
    };

    // Para cada uno de los botones se define una acción, donde se visualiza la línea o no, dependiendo 
    // de si pulsamos el botón correspondiente y del estado anterior.
    d3.select("#linea-1")
        .on("click", function () {
            console.log("Button clicked!")
            lineasVisibles.linea1 = !lineasVisibles.linea1;
            svg.select("path[id='0']").style("display", lineasVisibles.linea1 ? "inline" : "none");
            svg.selectAll("circle[id='0']").style("display", lineasVisibles.linea1 ? "inline" : "none");
        });

    d3.select("#linea-1")
        .on("mouseover", function () {

            svg.select("path[id='0']").style("stroke","blue");
            svg.selectAll("circle[id='0']").style("fill","blue");
        });

    d3.select("#linea-1")
        .on("mouseout", function () {

            svg.select("path[id='0']").style("stroke","grey");
            svg.selectAll("circle[id='0']").style("fill","grey");
        });



    d3.select("#linea-2")
        .on("click", function () {
            console.log("Button clicked!")
            lineasVisibles.linea2 = !lineasVisibles.linea2;
            svg.select("path[id='1']").style("display", lineasVisibles.linea2 ? "inline" : "none");
            svg.selectAll("circle[id='1']").style("display", lineasVisibles.linea2 ? "inline" : "none");
        });

    d3.select("#linea-3")
        .on("click", function () {
            console.log("Button clicked!")
            lineasVisibles.linea3 = !lineasVisibles.linea3;
            svg.select("path[id='2']").style("display", lineasVisibles.linea3 ? "inline" : "none");
            svg.selectAll("circle[id='2']").style("display", lineasVisibles.linea3 ? "inline" : "none");
        });

    d3.select("#linea-4")
        .on("click", function () {
            console.log("Button clicked!")
            lineasVisibles.linea4 = !lineasVisibles.linea4;
            svg.select("path[id='3']").style("display", lineasVisibles.linea4 ? "inline" : "none");
            svg.selectAll("circle[id='3']").style("display", lineasVisibles.linea4 ? "inline" : "none");
        });

    d3.select("#linea-5")
        .on("click", function () {
            console.log("Button clicked!")
            lineasVisibles.linea5 = !lineasVisibles.linea5;
            svg.select("path[id='4']").style("display", lineasVisibles.linea5 ? "inline" : "none");
            svg.selectAll("circle[id='4']").style("display", lineasVisibles.linea5 ? "inline" : "none");
        });

    d3.select("#linea-6")
        .on("click", function () {
            console.log("Button clicked 6!")
            lineasVisibles.linea6 = !lineasVisibles.linea6;
            svg.select("path[id='5']").style("display", lineasVisibles.linea6 ? "inline" : "none");
            svg.selectAll("circle[id='5']").style("display", lineasVisibles.linea6 ? "inline" : "none");
        });

    d3.select("#linea-7")
        .on("click", function () {
            console.log("Button clicked 7!")
            lineasVisibles.linea7 = !lineasVisibles.linea7;
            svg.select("path[id='6']").style("display", lineasVisibles.linea7 ? "inline" : "none");
            svg.selectAll("circle[id='6']").style("display", lineasVisibles.linea7 ? "inline" : "none");
        });

})