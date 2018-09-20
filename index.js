let visibility = (obj, id) => {
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
function show() {
    let about = document.getElementById("about").style.display;
    if (about == "none") {
        document.getElementById('about').style = "display: block";
    } else {
        document.getElementById('about').style = "display: none";
    }
    
    
}