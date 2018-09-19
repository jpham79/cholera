let read = () => {

    Plotly.d3.csv("../data/choleraDeathLocations.csv", (data) => { processDeath(data) });
    Plotly.d3.csv("../data/choleraPumpLocations.csv", (data) => { processPump(data) });
}



let unpack = (rows, key) => {
    return rows.map((row) => {return row[key];});
}

let processDeath = (data) => {
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

let processPump = (data) => {
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

read();