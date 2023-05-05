d3.json("https://raw.githubusercontent.com/mahulo2009/d3-js-mercado-inmobiliario/main/data/indicadores_del_mercado_inmobiliario.json").then(function (datosCompletos) {

    console.log("Los datos ya se han recibido v1")

    var metricas = datosCompletos.Respuesta.Datos.Metricas

    var datos = datosCompletos.Respuesta.Datos.Metricas[0].Datos

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

    metricas.forEach(function (d0) {
        d0.Datos.forEach(function (d1) {
            var fecha = d1.Agno + "-" + (meses[d1.Periodo] < 10 ? "0" : "") + meses[d1.Periodo] + "-01";
            d1.fecha = fecha;
        });
    });

    var ancho = 800;
    var altura = 500;
    var margen = { superior: 50, derecho: 20, inferior: 30, izquierdo: 50 };

    var svg = d3.select("body")
        .append("svg")
        .attr("width", ancho + margen.izquierdo + margen.derecho)
        .attr("height", altura + margen.superior + margen.inferior)
        .append("g")
        .attr("transform", "translate(" + margen.izquierdo + "," + margen.superior + ")");


    datos = metricas[0].Datos

    var escalaX = d3.scaleTime()
        .domain(d3.extent(datos, function (d) { return new Date(d.fecha); }))
        .range([0, ancho]);

    var escalaY = d3.scaleLinear()
        .domain([d3.min(datos, function (d) { return d.Valor; }) - 20, d3.max(datos, function (d) { return d.Valor; }) + 20])
        .range([altura, 0]);

    var ejeX = d3.axisBottom(escalaX);
    var ejeY = d3.axisLeft(escalaY);

    // Title
    svg.append('text')
        .attr('x', ancho / 2)
        .attr('y', 0)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('font-size', 20)
        .text("Indicadores del mercado inmobiliario");

    svg.append('text')
        .attr('x', ancho / 2)
        .attr('y', 25)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('font-size', 20)
        .text("Porcentaje de variacion vivienda nuevas");


    svg.append("g")
        .attr("transform", "translate(0," + altura + ")")
        .call(ejeX);

    svg.append("g")
        .call(ejeY);

    var ID = 0;
    metricas.forEach(function (d0) {


        var linea = d3.line()
            .x(function (d) { return escalaX(new Date(d.fecha)); })
            .y(function (d) { return escalaY(d.Valor); })
            .curve(d3.curveMonotoneX)

        svg.append("path")
            .datum(d0.Datos)
            .attr("d", linea)
            .attr("stroke", "steelblue")
            .attr("fill", "none")
            .style("stroke-width", "2")
            .attr("id", ID);

        ID++;

    });

    var lineasVisibles = {
        linea1: true,
        linea2: true,
        linea3: true,
        linea4: true,
        linea5: true,
        linea6: true,
        linea7: true
    };

    d3.select("#linea-1")
        .on("click", function () {
            console.log("Button clicked!")
            lineasVisibles.linea1 = !lineasVisibles.linea1;
            svg.select("path[id='0']").style("display", lineasVisibles.linea1 ? "inline" : "none");
        });

    d3.select("#linea-2")
        .on("click", function () {
            console.log("Button clicked!")
            lineasVisibles.linea2 = !lineasVisibles.linea2;
            svg.select("path[id='1']").style("display", lineasVisibles.linea2 ? "inline" : "none");
        });

    d3.select("#linea-3")
        .on("click", function () {
            console.log("Button clicked!")
            lineasVisibles.linea3 = !lineasVisibles.linea3;
            svg.select("path[id='2']").style("display", lineasVisibles.linea3 ? "inline" : "none");
        });

    d3.select("#linea-4")
        .on("click", function () {
            console.log("Button clicked!")
            lineasVisibles.linea4 = !lineasVisibles.linea4;
            svg.select("path[id='3']").style("display", lineasVisibles.linea4 ? "inline" : "none");
        });

    d3.select("#linea-5")
        .on("click", function () {
            console.log("Button clicked!")
            lineasVisibles.linea5 = !lineasVisibles.linea5;
            svg.select("path[id='4']").style("display", lineasVisibles.linea5 ? "inline" : "none");
        });

    d3.select("#linea-6")
        .on("click", function () {
            console.log("Button clicked 6!")
            lineasVisibles.linea6 = !lineasVisibles.linea6;
            svg.select("path[id='5']").style("display", lineasVisibles.linea6 ? "inline" : "none");
        });

    d3.select("#linea-7")
        .on("click", function () {
            console.log("Button clicked 7!")
            lineasVisibles.linea7 = !lineasVisibles.linea7;
            svg.select("path[id='6']").style("display", lineasVisibles.linea7 ? "inline" : "none");
        });

})