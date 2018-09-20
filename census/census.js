let width = 48, height = 48;
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

    processPieM(contents);
    processPieF(contents);
    processPieT(total);
    processBar(contents);
}

let processPieM = (contents) => {
    let info = [{
        labels: contents[0],
        values: contents[1],
        type: 'pie'
    }];

    let layout = {
        title: 'Male Age Groups Census'
    };

    Plotly.newPlot(pieM(), info, layout);
}

let processPieF = (contents) => {
    let info = [{
        labels: contents[0],
        values: contents[2],
        type: 'pie'
    }];

    let layout = {
        title: 'Female Age Groups Census'
    };

    Plotly.newPlot(pieF(), info, layout);
}

let processPieT = (total) => {
    let info = [{
        labels: [["Male"], [["Female"]]],
        values: [total.male, total.female],
        type: 'pie'
    }];

    let layout = {
        title: 'Total Population By Gender'
    };

    Plotly.newPlot(pieT(), info, layout);
}

let processBar = (contents) => {
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
        barmode: 'group'
    };

    let bars = [trace1, trace2];

    Plotly.newPlot(bar(), bars, layout );
}

let pieM = () => {
    let pieM = document.getElementById('pieM');
    let x = Plotly.d3.select(pieM)
        .style({
            width: width + '%',    
            height: height + 'vh'
        });

    return x.node();
}

let pieF = () => {
    let pieF = document.getElementById('pieF');
    let x = Plotly.d3.select(pieF)
        .style({
            width: width + '%',   
            height: height + 'vh'
        });

    return x.node();
}

let pieT = () => {
    if (window.innerWidth < 1000 + 'px') {
        width = 100, height = 50;
    }

    let pieT = document.getElementById('pieT');
    let x = Plotly.d3.select(pieT)
        .style({
            width: width + '%',   
            height: height + 'vh'
        });

    return x.node();
}

let bar = () => {
    let bar = document.getElementById('bar');
    let x = Plotly.d3.select(bar)
        .style({
            width: width + '%',   
            height: height + 'vh'
        });

    return x.node();
}

window.onresize = function() {
    Plotly.Plots.resize(pieM());
    Plotly.Plots.resize(pieF());
    Plotly.Plots.resize(pieT());
    Plotly.Plots.resize(bar());
};

makeplot();
