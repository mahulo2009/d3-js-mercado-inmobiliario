console.log ("Hello World")


d3.json("https://raw.githubusercontent.com/mahulo2009/d3-js-mercado-inmobiliario/main/data/indicadores_del_mercado_inmobiliario.json").then(function (datosCompletos) {

    console.log("Los datos ya se han recibido v1")

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

    datos.forEach(function (d) {
        var fecha = d.Agno + "-" + (meses[d.Periodo] < 10 ? "0" : "") + meses[d.Periodo] + "-01";
        d.fecha = fecha;

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

    var linea = d3.line()
        .x(function (d) { return escalaX(new Date(d.fecha)); })
        .y(function (d) { return escalaY(d.Valor); })
        .curve(d3.curveMonotoneX)

    svg.append("path")
        .datum(datos)
        .attr("d", linea)
        .attr("stroke", "steelblue")
        .attr("fill", "none")
        .style("stroke-width", "2");




})