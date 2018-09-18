let makeplot = () => {
    return Plotly.d3.tsv("../data/naplesCholeraAgeSexData.tsv", (data) => { process(data) } );
}

let unpack = (rows, key) => {
    return rows.map((row) => {return row[key];});
}

let process = (data) => {
    let width = parent.innerWidth;
    let contents = [];
    let header = [["age"], ["male"], ["female"]];
    let name = [["Age"], ["Male Deaths"], ["Female Deaths"]];
    
    for (let i = 0; i < header.length; i++) {
        content = unpack(data, header[i]);              
        contents[i] = content;
    }
    
    let trace1 = {
        x: contents[0],
        y: contents[1],
        type: 'bar',
        name: 'Male Deaths'
    };

    let trace2 = {
        x: contents[0],
        y: contents[2],
        type: 'bar',
        name: 'Female Deaths'
    }

    let layout = {
        title: 'Cholera Deaths in Naples',
        barmode: 'group',
        width: width
    };

    let bar = [trace1, trace2];

    Plotly.newPlot('bar', bar, layout );

    let info = [{
        type: 'table',
        header: {
          values: name,
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
          title: "Cholera Deaths in Naples Data",
          width: width
      };
     
      Plotly.newPlot('table', info, layout);
}

makeplot();
