let makeplot = () => {
    return Plotly.d3.tsv("../data/choleraDeaths.tsv", (data) => { process(data) } );
}

let unpack = (rows, key) => {
    return rows.map((row) => {return row[key];});
}

let process = (data) => {
    for (let i = 0; i<data.length; i++) {
        data[i].total = parseInt(data[i].Attack) + parseInt(data[i].Death);
    }
    let header = [["Date"], ["Attack"], ["Death"], ["total"]];
    let contents = [];

    for (let i = 0; i < header.length; i++) {
        content = unpack(data, header[i]);       
        contents[i] = content;
    }

    var info = [{
        type: 'table',
        columnwidth:[200, 200, 200, 200],
        header: {
          values: [["Date"], ["Cholera Attacks"], ["Cholera Deaths"], ["Total Cholera Incidents"]],
          align: "center",
          line: {width: 1, color: 'rgb(50, 50, 50)'},
          fill: {color: ['rgb(235, 100, 230)']},
          font: {family: "Arial", size: 11, color: "white"}
        },
        cells: {
          values: contents,
          align: "center",
          line: {color: "black", width: 1},
          font: {family: "Arial", size: 11, color: ["black"]}
        }
      }]
      
      Plotly.plot('table', info);
}

makeplot();
