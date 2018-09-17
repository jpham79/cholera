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
            break;
        case 'm':
            document.getElementById("map").style = "display: none";
            break;
    }

    active[0].classList.remove("active");
    obj.className = ("active item");
    content.style = "display: block";

}



