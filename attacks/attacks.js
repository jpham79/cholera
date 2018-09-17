let makeplot = () => {
    return Plotly.d3.tsv("../data/choleraDeaths.tsv", (data) => { process(data) } );
}

let unpack = (rows, key) => {
    return rows.map((row) => {return row[key];});
}

let process = (data) => {

    let dates = [];
    let attacks = [];
    let deaths = [];
    let atotal = [];
    let dtotal = [];
    let contents = [];
    let header = [["Date"], ["Attack"], ["Death"], ["total"], ["atotal"], ["dtotal"]];

    for (let i = 0; i<data.length; i++) {
        dates[i] = data[i].Date;
        attacks[i] = data[i].Attack;
        deaths[i] = data[i].Death;
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

    let trace1= {
        x: dates,
        y: attacks,
        mode: 'lines',
        name: 'Attacks'
    };

    let trace2 = {
        x: dates,
        y: deaths,
        mode: 'lines',
        name: 'Deaths'
    };

    let trace3 = {
        x: dates,
        y: atotal,
        mode: 'lines',
        name: 'Cumulative Attacks'
    };

    let trace4 = {
        x: dates,
        y: dtotal,
        mode: 'lines',
        name: 'Cumulative Deaths'
    };

    let layout = {
        title: "Cholera Attacks and Deaths"
        // plot_bgcolor: "#000000",
        // paper_bgcolor: "#000000"
    };

    let lines = [trace1, trace2, trace3, trace4];

    Plotly.newPlot('line', lines, layout);

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
     
      Plotly.plot('table', info, layout);
}

makeplot();
