function visibility (obj, id) {
    let content = document.getElementById(id);
    let active = document.getElementsByClassName("active item");
    switch (active[0].id) {
        case 'a':
            document.getElementById("attacks").style = "display: none";
            break;
        case 'f':
            document.getElementById("fatalities").style = "display: none";
            break;
        case 'c':
            document.getElementById("census").style = "display: none";
            document.getElementById("censusTable").style = "display: none";
            break;
        case 'm':
            document.getElementById("map").style = "display: none";
            break;    
        case 'all':
            document.getElementById("attacks").style = "display: none";
            document.getElementById("fatalities").style = "display: none";
            document.getElementById("census").style = "display: none";
            document.getElementById("censusTable").style = "display: none";
            document.getElementById("map").style = "display: none";
            break;
    }

    active[0].classList.remove("active");
    obj.className = ("active item");
    if (obj.id == 'c') {
        document.getElementById("censusTable").style = "display: block";
    }
    if (id != "all") {
        content.style = "display: block";
    } else {
        document.getElementById("attacks").style = "display: block";
        document.getElementById("fatalities").style = "display: block";
        document.getElementById("census").style = "display: block";
        document.getElementById("censusTable").style = "display: block";
        document.getElementById("map").style = "display: block"; 
    }
    
}

//DATA PROCESSING AND UNPACKING
function read () {
    Plotly.d3.tsv("data/choleraDeaths.tsv", (data) => { processAttacks(data) } );
    Plotly.d3.tsv("data/naplesCholeraAgeSexData.tsv", (data) => { processFatalities(data) } );
    Plotly.d3.csv("data/UKcensus1851.csv", (data) => { processCensus(data) } );
    Plotly.d3.csv("data/choleraDeathLocations.csv", (data) => { processDeath(data) });
    Plotly.d3.csv("data/choleraPumpLocations.csv", (data) => { processPump(data) });
}

function unpack (rows, key) {
    return rows.map((row) => {return row[key];});
}

function processAttacks (data) {
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

    attacksLine(contents);
    attacksTable(contents);
}

function processFatalities (data) {

    let contents = [];
    let header = [["age"], ["male"], ["female"]];
 
    for (let i = 0; i < header.length; i++) {
        content = unpack(data, header[i]);              
        contents[i] = content;
    }

    fatalitiesTable(contents);
    fatalitiesBar(contents);
}

function processCensus (data) {

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

    censusPieM(contents);
    censusPieF(contents);
    censusPieT(total);

    censusBar(contents);
    contents[0].push("Total Population");
    contents[1].push(total.male);
    contents[2].push(total.female);
    contents[3].push(total.combined);
    censusTable(contents);
}

function processDeath (data) {
    let contents = [];
    let header = [["deaths"], ["long"], ["lat"]];
    
    for (let i = 0; i < header.length; i++) {
        content = unpack(data, header[i]);       
        contents[i] = content;
    }

    for (let i = 0; i < contents[2].length; i++) {
        var circle = L.circle([contents[2][i], contents[1][i]], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: contents[0][i]
        }).addTo(mymap);
        circle.bindPopup(contents[0][i] + ' Deaths');
    }
    
}

function processPump (data) {
    let contents = [];
    let header = [["long"], ["lat"]];
    
    for (let i = 0; i < header.length; i++) {
        content = unpack(data, header[i]);       
        contents[i] = content;
    }

    for (let i = 0; i < contents[0].length; i++) {
        var circle = L.circle([contents[1][i], contents[0][i]], {
            color: 'blue',
            fillColor: 'purple',
            fillOpacity: 0.5,
            radius: 5
        }).addTo(mymap);
        circle.bindPopup('Cholera Pump');
    }
    
}

//PLOTTING THE STUFF
// xaxis: {
//     title: ''
// },
// yaxis: {
//     title: ''
// }
let attacksLine = (contents) => {
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
        title: "Cholera Attacks and Deaths",
        xaxis: {
            title: 'Date'
        },
        yaxis: {
            title: '# of People'
        }
    };

    let lines = [trace1, trace2, trace3, trace4];

    Plotly.newPlot('attacksLine', lines, layout);
}


let attacksTable = (contents) => {
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
     
      Plotly.plot('attacksTable', info, layout);
}

let fatalitiesBar = (contents) => {
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
        xaxis: {
            title: 'Age Range'
        },
        yaxis: {
            title: '# of Deaths'
        }
    };

    let bars = [trace1, trace2];

    Plotly.newPlot('fatalitiesBar', bars, layout );
}

let fatalitiesTable = (contents) => {
    let name = [["Age"], ["Male Deaths"], ["Female Deaths"]];

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
          title: "Cholera Deaths in Naples Data"
      };
     
      Plotly.newPlot('fatalitiesTable', info, layout);
}

let censusPieM = (contents) => {
    let info = [{
        labels: contents[0],
        values: contents[1],
        type: 'pie'
    }];

    let layout = {
        title: 'Male Age Groups Census'
    };

    Plotly.newPlot('pieM', info, layout);
}

let censusPieF = (contents) => {
    let info = [{
        labels: contents[0],
        values: contents[2],
        type: 'pie'
    }];

    let layout = {
        title: 'Female Age Groups Census'
    };

    Plotly.newPlot('pieF', info, layout);
}

let censusPieT = (total) => {
    let info = [{
        labels: [["Male"], [["Female"]]],
        values: [total.male, total.female],
        type: 'pie'
    }];

    let layout = {
        title: 'Total Population By Gender'
    };

    Plotly.newPlot('pieT', info, layout);
}

let censusBar = (contents) => {
    let trace1 = {
        x: contents[0],
        y: contents[1],
        type: 'bar',
        name: 'Males by Age Group'
    };

    let trace2 = {
        x: contents[0],
        y: contents[2],
        type: 'bar',
        name: 'Females by Age Group'
    }

    let layout = {
        title: 'Population by Age and Gender',
        barmode: 'group',
        xaxis: {
            title: 'Age Range'
        },
        yaxis: {
            title: 'Population'
        }
    };

    let bars = [trace1, trace2];

    Plotly.newPlot('censusBar', bars, layout );
}

let censusTable = (contents) => {
    let name = ["Age", "Males", "Females", "Combined Population"];
    
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
          autosize: true,
          responsive: true
      };
     
      Plotly.newPlot('censusTable', info, layout);

}

function menu() {
    $('.sidebar')
  .sidebar('toggle')
;
}

function modal() {
    $('.ui.basic.modal')
  .modal('show')
;
}

read();

//RESPONSIVE STUFF

// let width = 100;
// let height = 100;

// let aline = () => {
//     let line = document.getElementById('attacksLine');  
//     let x = Plotly.d3.select(line)
//         .style({
//             width: width + '%',
//             'margin-left': (100 - width) / 2 + '%',    
//             height: height + 'vh'
//         });

//     return x.node();
// }

// let atable = () => {
//     let table = document.getElementById('attacksTable');
//     let x = Plotly.d3.select(table)
//         .style({
//             width: width + '%',
//             'margin-left': (100 - width) / 2 + '%',    
//             height: height + 'vh'
//         });

//     return x.node();
// }

// let fbar = () => {
//     let bar = document.getElementById('fatalitiesBar');
//     let x = Plotly.d3.select(bar)
//         .style({
//             width: width + '%',
//             'margin-left': (100 - width) / 2 + '%',    
//             height: height + 'vh'
//         });

//     return x.node();
// }

// let ftable = () => {
//     let table = document.getElementById('fatalitiesTable');
//     let x = Plotly.d3.select(table)
//         .style({
//             width: width + '%',
//             'margin-left': (100 - width) / 2 + '%',    
//             height: height + 'vh'
//         });

//     return x.node();
// }

// let pieM = () => {
//     let pieM = document.getElementById('pieM');
//     let x = Plotly.d3.select(pieM)
//         .style({
//             width: width + '%',    
//             height: height + 'vh'
//         });

//     return x.node();
// }

// let pieF = () => {
//     let pieF = document.getElementById('pieF');
//     let x = Plotly.d3.select(pieF)
//         .style({
//             width: width + '%',   
//             height: height + 'vh'
//         });

//     return x.node();
// }

// let pieT = () => {
//     if (window.innerWidth < 1000 + 'px') {
//         width = 100, height = 50;
//     }

//     let pieT = document.getElementById('pieT');
//     let x = Plotly.d3.select(pieT)
//         .style({
//             width: width + '%',   
//             height: height + 'vh'
//         });

//     return x.node();
// }

// let cbar = () => {
//     let bar = document.getElementById('censusBar');
//     let x = Plotly.d3.select(bar)
//         .style({
//             width: width + '%',   
//             height: height + 'vh'
//         });

//     return x.node();
// }

// let ctable = () => {
//     let width = 100, height = 50;
//     let table = document.getElementById('censusTable');
//     let x = Plotly.d3.select(table)
//         .style({
//             width: width + '%',  
//             height: height + 'vh'
//         });

//     return x.node();
// }

// window.onresize = function() {
//     Plotly.Plots.resize(aline());
//     Plotly.Plots.resize(atable());
//     Plotly.Plots.resize(fbar());
//     Plotly.Plots.resize(ftable());
//     Plotly.Plots.resize(pieM());
//     Plotly.Plots.resize(pieF());
//     Plotly.Plots.resize(pieT());
//     Plotly.Plots.resize(cbar());
//     Plotly.Plots.resize(ctable());
// };



