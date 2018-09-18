let makeplot = () => {
    return Plotly.d3.csv("../data/UKcensus1851.csv", (data) => { process(data) } );
}

let unpack = (rows, key) => {
    return rows.map((row) => {return row[key];});
}

let process = (data) => {
    let width = parent.innerWidth;
    let contents = [];
    let header = [["age"], ["male"], ["female"], ["total"]];
    let name = [["Age"], ["Males"], ["Females"], ["Combined Population"]];

    for (let i = 0; i < data.length; i++) {
        data[i].total = parseInt(data[i].male) + parseInt(data[i].female);        
    }
    
    for (let i = 0; i < header.length; i++) {
        content = unpack(data, header[i]);              
        contents[i] = content;
    }

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
          title: "UK Census Age Data 1851",
          width: width
      };
     
      Plotly.newPlot('table', info, layout);
}

makeplot();
