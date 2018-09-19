let width = 100, height = 50;

let makeplot = () => {
    return Plotly.d3.tsv("../data/choleraDeaths.tsv", (data) => { process(data) } );
}

let unpack = (rows, key) => {
    return rows.map((row) => {return row[key];});
}

let process = (data) => {
    let atotal = [];
    let dtotal = [];
    let contents = [];
    let header = [["Date"], ["Attack"], ["Death"], ["total"], ["atotal"], ["dtotal"]];

    for (let i = 0; i<data.length; i++) {
        data[i].total = parseInt(data[i].Attack) + parseInt(data[i].Death);
        atotal[i] = 0;
        dtotal[i] = 0;

        for (let j = 0; j <= i; j++) {
            atotal[i] += parseInt(data[j].Attack);
            dtotal[i] += parseInt(data[j].Death);
        }

        data[i].atotal = atotal[i];
        data[i].dtotal = dtotal[i];
    }
    
    for (let i = 0; i < header.length; i++) {
        content = unpack(data, header[i]);       
        contents[i] = content;
    }

    processLine(contents);
    processTable(contents);
}

let table = () => {
    let table = document.getElementById('table');
    let x = Plotly.d3.select(table)
        .style({
            width: width + '%',
            'margin-left': (100 - width) / 2 + '%',    
            height: height + 'vh'
        });

    return x.node();
}

let line = () => {
    let line = document.getElementById('line');

    
    let x = Plotly.d3.select(line)
        .style({
            width: width + '%',
            'margin-left': (100 - width) / 2 + '%',    
            height: height + 'vh'
        });

    return x.node();
}

let processTable = (contents) => {

    let info = [{
        type: 'table',
        header: {
          values: [["Date"], ["Attacks"], ["Deaths"], ["Total Incidents"], ["Cumulative Attacks"], ["Cumulative Deaths"]],
          align: "center",
          line: {width: 1, color: 'rgb(50, 50, 50)'},
          fill: {color: ['rgb(46, 50, 54)']},
          font: {family: "Arial", size: 14, color: "white"}
        },
        cells: {
          values: contents,
          align: "center",
          line: {color: "black", width: 1},
          font: {family: "Arial", size: 11, color: ["black"]}
        }
      }]

      layout = {
          title: "Cholera Attacks and Deaths in London Data"
      };
     
      Plotly.plot(table(), info, layout);
}

let processLine = (contents) => {
    let trace1= {
        x: contents[0],
        y: contents[1],
        mode: 'lines',
        name: 'Attacks'
    };

    let trace2 = {
        x: contents[0],
        y: contents[2],
        mode: 'lines',
        name: 'Deaths'
    };

    let trace3 = {
        x: contents[0],
        y: contents[3],
        mode: 'lines',
        name: 'Cumulative Attacks'
    };

    let trace4 = {
        x: contents[0],
        y: contents[4],
        mode: 'lines',
        name: 'Cumulative Deaths'
    };

    let layout = {
        title: "Cholera Attacks and Deaths"
    };

    let lines = [trace1, trace2, trace3, trace4];

    Plotly.newPlot(line(), lines, layout);
}

window.onresize = function() {
    Plotly.Plots.resize(table());
    Plotly.Plots.resize(line());
}

makeplot();
