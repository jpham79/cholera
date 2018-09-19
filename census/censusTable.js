let width = 100, height = 95;
let makeplot = () => {
    return Plotly.d3.csv("../data/UKcensus1851.csv", (data) => { process(data) } );
}

let unpack = (rows, key) => {
    return rows.map((row) => {return row[key];});
}

let process = (data) => {

    let contents = [];
    let total = [];
    total.male = 0;
    total.female = 0;
    total.combined = 0;
    let header = [["age"], ["male"], ["female"], ["total"]];

    for (let i = 0; i < data.length; i++) {
        data[i].total = parseInt(data[i].male) + parseInt(data[i].female);        
    }
    for (let i = 0; i < header.length; i++) {
        content = unpack(data, header[i]);              
        contents[i] = content;
    }
    for(let i = 0; i < contents[1].length; i++) {
        total.male += parseInt(contents[1][i]);
        total.female += parseInt(contents[2][i]);
        total.combined += parseInt(contents[3][i]);
    }

    processTable(contents, total);
}



let processTable = (contents, total) => {
    let name = [["Age"], ["Males"], ["Females"], ["Combined Population"]];
    contents[0].push("Total Population");
    contents[1].push(total.male);
    contents[2].push(total.female);
    contents[3].push(total.combined);
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
          title: "UK Census Age Data 1851"
      };
     
      Plotly.newPlot(table(), info, layout);

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

window.onresize = function() {
    Plotly.Plots.resize(table());
};

makeplot();
