var url = "https://raw.githubusercontent.com/mahulo2009/d3-js-mercado-inmobiliario/main/data/indicadores_del_mercado_inmobiliario.json"

d3.json(url).then(function (datosCompletos) {

    // Definición de las variables

    // Fijar en ancho y alto del area donde se dibujará la gráfica.    
    var width = 800
    var height = 600

    // Se definen los margenes para la gráficas.
    var margen = { superior: 50, derecho: 20, inferior: 30, izquierdo: 20 };

    // Colores para cada una de las métricas.    
    var coloresLineas = [
        "#1F1F7A",
        "#555555",
        "#003366",
        "#006633",
        "#990000",
        "#660066"
    ]
    
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
    var metricas = datosCompletos.Respuesta.Datos.Metricas;
    

    //A continuación se realiza un procesado de los datos para facilitar la representación:
    //
    // - Se selecciona solo el año 2021 para simplificar las gráficas.      
    //
    // - Se elimina la métrica 6 ya que no sigue el convenio de las otras métricas 
    //  (formato de fecha distinto, es trimetre en vez de nombre del mes del año).
    //
    // - Se establece formato de fechas.
    
    
    // Se elimina la métrica 6, indice 5 ya que empiza en 0.
    metricas.splice(5, 1);


    // Para cada una de las métricas, solo vamos a utilizar datos del año 2021.
    metricas.forEach(function (d0) {
        d0.Datos = d0.Datos.filter(function (d) { return d.Agno == '2021' });
    });
    
    // Formato de fechas:
    
    // Con el objetivo de facilitar la creación de el eje X como escala temporal,
    // se transformará la fecha, que viene dada en dos campos, Agno y Periodo, a un 
    // formato fecha estandar: YYYY-MM-DD. Para ello se crea un mapeo entre nombre de
    // mes y número del mes en el año.
    //
    
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

    
    // Como elemento base donde dibujar la grafica de lineas se selecciona
    // el div con identificador grafiacaLineas
    var divGraficaLineas = d3.select("#graficaLineas");

    // Se crea el svg con ancho, alto en el grupo (g). Luego se translada
    // según los margenes definidos.
    var svgGraficaLineas = divGraficaLineas
        .append("svg")
        .attr("width", width + margen.izquierdo + margen.derecho)
        .attr("height", height + margen.superior + margen.inferior)
        .append("g")
        .attr("transform", "translate(" + margen.izquierdo + "," + margen.superior + ")");

    // Para definir la escala en el eje Y se calcula el valor máximo y mínimo de todas
    // las métricas.
    var values = [];
    metricas.forEach(function (d0) {
        d0.Datos.forEach(function (d1) {
            values.push(d1.Valor);            
        });
    });

    var minValue = Math.min(...values);
    var maxValue = Math.max(...values);
    
        // Para definir la escana en el eje X, como el rango temporal es el mismo, se 
    // utiliza la métrica 0.
    datos = metricas[0].Datos

    // En el ejeX se utiliza una escala temporal, haciendo uso del nuevo campo fecha, creado con el
    // formato adecuado para poder crear un tipo de datos Date que la librería es capaz de interpretar.
    // Este dominio sería la fecha, y el rango el ancho de la gráfica.
    var escalaXGraficaLineas = d3.scaleTime()
        .domain(d3.extent(datos, function (d) { return new Date(d.fecha); }))
        .range([0, width]);

    // En el eje Y se utilizan los valores máximos y minimos y se define un rango del alto de la gráfica.
    var escalaYGraficaLineas = d3.scaleLinear()
        .domain([minValue, maxValue+10])
        .range([height, 0]);

    // Se aplica la escala al ejeX
    var ejeXGraficaLineas = d3.axisBottom(escalaXGraficaLineas);

    // Se aplica la escala al ejeY
    var ejeYGraficaLineas = d3.axisLeft(escalaYGraficaLineas);

    // Se añade un título a la gráfica.  
    svgGraficaLineas.append('text')
        .attr('x', height / 2)
        .attr('y', 0)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('font-size', 20)
        .text("Evolución Indicadores del mercado inmobiliario");

    // Se añade el ejeX al svg grupo (g) , y se translada para situarlo,
    // en la parte inferior de la gráfica.
    svgGraficaLineas.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(ejeXGraficaLineas);

    // Se añade el ejeY al svg grupo (g).
    svgGraficaLineas.append("g")
        .call(ejeYGraficaLineas);

    // Para cada una de las métricas.    
    var ID = 0;
    metricas.forEach(function (d0) {

        // Se crea una línea conde la coordenada X sería la fecha y la coordenada Y sería el valor.
        // Se suaviza la curva con función MonotoneX.
        var linea = d3.line()
            .x(function (d) { return escalaXGraficaLineas(new Date(d.fecha)); })
            .y(function (d) { return escalaYGraficaLineas(d.Valor); })
            .curve(d3.curveMonotoneX)

        // Se vincula a la linea los valores, créandose con una configuraión de color, relleno etc...
        // Se añade un ID a la clase para luego poder activarse/desactivarse mediante acciones de botón.    
        svgGraficaLineas.append("path")
            .datum(d0.Datos)
            .attr("d", linea)
            .attr("stroke", coloresLineas[ID])
            .attr("fill", "none")
            .style("stroke-width", "1")
            .attr("id", ID)
            .attr("class", "linea");

        // Se crean puntos a lo largo de la línea, centrados donde existen valores (cx,cy) sería igual
        // a la fecha y el valor en esa fecha. Se incluye el campo ID para poder luego ocultar/mostrar 
        // los puntos asociados a la línea, según el usuario seleccione las líneas a visualizar.

        // Se guarda en la variable puntos para poder luego definir las acciones de mostrar/ocultar tooltip
        // al pasar el punter del ratón por los puntos.    
        puntos = svgGraficaLineas.selectAll(".dot")
            .data(d0.Datos)
            .enter().append("circle")
            .attr("cx", function (d) { return escalaXGraficaLineas(new Date(d.fecha)); })
            .attr("cy", function (d) { return escalaYGraficaLineas(d.Valor); })
            .attr("r", 4)
            .attr("id", ID)
            .attr("fill", coloresLineas[ID]);

        // Se define la acción al pasar el ratón sobre los puntos, de mostar el tooltip.
        // Haciendo uso del parémtro (d) que sería el registro actual, se extrae información
        // detallada del registro y se presenta en el tooltip, cuyo estilo se ha definido en 
        // la el fichero html.
        puntos.on("mouseover", function (d, i) {
            d3.select("body")
                .append("div")
                .attr("class", "tooltip")
                .html(
                    "Año: " + d.Agno + "<br>" +
                    "Mes: " + d.Periodo + "<br>" +
                    "Valor: " + (d.Valor).toFixed(2) + "%" + "<br>" +
                    "Estado: " + (d.Estado) + "<br>"
                )
                // Se posiciona tooltip en la coordenada X,Y del click del ratón más cierto marge
                // para que sea visible y el puntero del ratón no oculte la información.
                .style("left", (d3.event.pageX + 12) + "px")
                .style("top", d3.event.pageY + "px");

        }).on("mouseout", function () {
            // Cuando el puntero del ratón se mueve fuera del punto, se elimina el tooltip.
            d3.select(".tooltip").remove();
        });

        ID++;

    });

    // Cuando pasamos el puntero del ratón por encima de las líneas, se dibujan más gruesas.
    d3.selectAll(".linea")
        .on("mouseover", function (d) {
            d3.select(this).style("stroke-width", "4");
        })
        .on("mouseout", function () {
            d3.select(this).style("stroke-width", "1");
        });

    // Se crear una estructura de datos para guardar si línea está siendo visualizada o no.
    var lineasVisibles = {
        linea1: true,
        linea2: true,
        linea3: true,
        linea4: true,
        linea5: true,
        linea6: true,
        linea7: true
    };
    
    // Para cada uno de los botones se define una acción, donde se visualiza la línea o no, dependiendo
    // de si pulsamos el botón correspondiente y del estado anterior.
    d3.select("#linea-1")
        .on("click", function () {            
            lineasVisibles.linea1 = !lineasVisibles.linea1;
            svgGraficaLineas.select("path[id='0']").style("display", lineasVisibles.linea1 ? "inline" : "none");
            svgGraficaLineas.selectAll("circle[id='0']").style("display", lineasVisibles.linea1 ? "inline" : "none");
        });

    d3.select("#linea-2")
        .on("click", function () {            
            lineasVisibles.linea2 = !lineasVisibles.linea2;        
            svgGraficaLineas.select("path[id='1']").style("display", lineasVisibles.linea2 ? "inline" : "none");
            svgGraficaLineas.selectAll("circle[id='1']").style("display", lineasVisibles.linea2 ? "inline" : "none");
        });

    d3.select("#linea-3")
        .on("click", function () {            
            lineasVisibles.linea3 = !lineasVisibles.linea3;
            svgGraficaLineas.select("path[id='2']").style("display", lineasVisibles.linea3 ? "inline" : "none");
            svgGraficaLineas.selectAll("circle[id='2']").style("display", lineasVisibles.linea3 ? "inline" : "none");            
        });

    d3.select("#linea-4")
        .on("click", function () {            
            lineasVisibles.linea4 = !lineasVisibles.linea4;            
            svgGraficaLineas.select("path[id='3']").style("display", lineasVisibles.linea4 ? "inline" : "none");
            svgGraficaLineas.selectAll("circle[id='3']").style("display", lineasVisibles.linea4 ? "inline" : "none");                        
        });

    d3.select("#linea-5")
        .on("click", function () {            
            lineasVisibles.linea5 = !lineasVisibles.linea5;
            svgGraficaLineas.select("path[id='4']").style("display", lineasVisibles.linea5 ? "inline" : "none");
            svgGraficaLineas.selectAll("circle[id='4']").style("display", lineasVisibles.linea5 ? "inline" : "none");                        
        });

    d3.select("#linea-6")
        .on("click", function () {            
            lineasVisibles.linea6 = !lineasVisibles.linea6;
            svgGraficaLineas.select("path[id='5']").style("display", lineasVisibles.linea6 ? "inline" : "none");
            svgGraficaLineas.selectAll("circle[id='5']").style("display", lineasVisibles.linea6 ? "inline" : "none");                        
        });

    d3.select("#linea-7")
        .on("click", function () {            
            lineasVisibles.linea7 = !lineasVisibles.linea7;
            svgGraficaLineas.select("path[id='6']").style("display", lineasVisibles.linea7 ? "inline" : "none");
            svgGraficaLineas.selectAll("circle[id='6']").style("display", lineasVisibles.linea7 ? "inline" : "none");                        
        });

    // Gráfico de barras.
    var divgraficaBarras = d3.select("#graficaBarras");

    var svgGraficaBarras = divgraficaBarras
        .append("svg")
        .attr("width", width + margen.izquierdo + margen.derecho)
        .attr("height", height + margen.superior + margen.inferior)
        .append("g")
        .attr("transform", "translate(" + margen.izquierdo + "," + margen.superior + ")");

    datos = metricas[0].Datos

    var escalaBarrasX = d3.scaleTime()
        .domain(d3.extent(datos, function (d) { return new Date(d.fecha); }))
        .range([0, width]);

    var escalaBarrasY = d3.scaleLinear()
        .domain([minValue, maxValue+10])
        .range([0,height]);

    var ejeBarrasX = d3.axisBottom(escalaBarrasX);

    var ejeBarrasY = d3.axisLeft(escalaBarrasY);

    // Se añade un título a la gráfica.  
    svgGraficaBarras.append('text')
        .attr('x', height / 2)
        .attr('y', 0)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('font-size', 20)
        .text("Histograma Indicadores del mercado inmobiliario");


    svgGraficaBarras.append("g")
        .attr("transform", "translate(0," + height + ")")        
        .call(ejeBarrasX);

    // Se añade el ejeY al svg grupo (g).
    svgGraficaBarras.append("g")
        .call(ejeBarrasY);

    var ID = 0;
    metricas.forEach(function (d0) {

        svgGraficaBarras.selectAll("rect" + ID)
            .data(d0.Datos)
            .enter()
            .append("rect")
            .attr("x", function (d, i) { return i * 69 + ID * 8; })
            .attr("y", function (d) { return 600-escalaBarrasY(d.Valor); })
            .attr("width", 5)
            .attr("height", function (d) { return escalaBarrasY(d.Valor); })
            .attr("id", ID)
            .attr("stroke", coloresLineas[ID])
            .attr("fill", coloresLineas[ID])
            .on("mouseover", function () {
                d3.select(this).style("stroke-width", "4");
            })
            .on("mouseout", function () {
                d3.select(this).style("stroke-width", "1");
            })

        ID++;

        console.log(ID)
    });

});