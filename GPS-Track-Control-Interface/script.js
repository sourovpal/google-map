//Constant and Variables
const tabEmployee = document.getElementById("emp-tab"), //Employee Table
    tabTour = document.getElementById("tour-tab"), //Tour Table
    tabPatrol = document.getElementById("pat-tab"), //Patrol Table

    groupBtn = document.getElementById("e-g-btn"), //Employee Table - Group Button
    empInput = document.getElementById("emp-input"), //Employee Table - Search Input
    mapDiv = document.getElementById("map-alt"), //Map - Div who Holds Map
    hideMapBtn = document.getElementById("hide-btn"), //Map - Hide Map Button
    goToUItems = document.getElementsByClassName("back-to-u-item"), //Map - Go to User Button Dropdown Items
    autoRefreshCheck = document.getElementById("auto-refresh"), //Tour Table - Auto Refresh Checkbox
    refreshBtn = document.getElementById("refresh-btn"), //Tour Table - Manual Refresh Button
    toExcelBtn = document.getElementById("to-excel-btn"), //Tour Table - Export to Excel Button
    tourPrintBtn = document.getElementById("tour-print-btn"), //Tour Table - Print Table Button
    patPrintBtn = document.getElementById("pat-print-btn"), //Patrol Table - Print Table Button
    patFilterD = document.getElementsByClassName("pat-f-i"), //Patrol Table - Patrol Filter Options
    patText = document.getElementById("p-hm"), //Patrol Table - Patrol Count Text

    empCheckBox = "<input type='checkbox' name='employee-check' class='employee-check form-check-input' onclick='groupDisable()'> "; //Employee Table Checkbox

var empArry = [], //Employee Table Data | empArry[0] = Employee Table's 1. Row
    tourArry = [], //Tour Table Data | tourArry[0] = Tour Table's 2. Row
    patArry = [], //Patrol Table Data | patArry[0] = Patrol Table's 2. Row
    filters = [], //Filter Data | filters[0] = tabEmployee | filters[1] = tabTour | filters[2] = tabPatrol
    passInx = [], //Filter Pass Indexes
    hideMapControl = true, //Control Variable for Hide/Show Map
    empGroupControl = false, //Control Variable for empGroup() Function
    patrolCount = 0; //Number of Users on Patrol

//Starter
autoRefreshCheck.checked = true;
patFilterD[2].classList.add("disabled");
tabTour.rows[1].style.display = "none";
tabPatrol.rows[1].style.display = "none";
filterStarter(3);

//Functions
function filterStarter(value) { //Starter Structure of the "filters" Array
    filters = [];
    
    for (i = 0; i < value; i++) { 
        filters.push([[]]);
        for (j = 0; j < filters[i].length; j++) 
            for ( k = 0; k < 2; k++)
                filters[i][j].push("");
    }
}

function getDt() { //Getting Date for Tables
    return new Date().getDate() + "/" + new Date().getMonth() + "/" + new Date().getFullYear() + " — " + new Date().getHours() + "." + new Date().getMinutes() + "." + new Date().getSeconds();
}

function btnStatus(condition, btnID) { //Button Disable / Enable Operations
    const btn = document.getElementById(btnID);

    if (condition) btn.classList.replace("enabled", "disabled");
    if (!condition) btn.classList.replace("disabled", "enabled");
}

function showHide(tableID, startRow, endRow, value) { //Show or Hide Table Rows
    const table = document.getElementById(tableID);

    for (j = startRow; j < endRow; j++)
        table.rows[j].style.display = value;
}

function search(tableID, inputID, searchColumn) { //Textbox Search Filter
    const input = document.getElementById(inputID),
        table = document.getElementById(tableID);

    var filter = input.value.toUpperCase(),
        tr = table.getElementsByTagName("tr"),
        td,
        txtValue;

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[searchColumn];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) tr[i].style.display = "";
            else tr[i].style.display = "none";

        }
    }

    filterControl(tableID, 1, table.rows.length);
}

function printSec(secID) { //Print Buttons
    printWindow = window.open();
    printWindow.document.body.innerHTML = '<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">' + document.getElementById(secID).innerHTML;
    setTimeout(printIt, 10);
    setTimeout(closeIt, 100);

    function printIt() { printWindow.print(); }
    function closeIt() { printWindow.close(); }
}

function filterControl(tableID, startRow, endRow) { //Check Filter for Tables
    const table = document.getElementById(tableID);
    var tNo;
    switch(tableID) {
        case "emp-tab": tNo = 0; break;
        case "tour-tab": tNo = 1; break;
        case "pat-tab": tNo = 2; break;
    }

    if (filters[tNo][0][0] !== "") {
        var iCount = 1, holder = filters[tNo][0][0];
            for (j = 0; j < filters[tNo].length; j++) {
                if (holder !== filters[tNo][j][0]) iCount++;
                holder = filters[tNo][j][0];
            }

        var tfArry = [],
            tCount = [],
            returnArry = [];
        for (i = startRow; i < endRow; i++) {
            tfArry.push([]);
            tCount.push(0);

            for (j = 0; j < filters[tNo].length; j++)
                if (table.rows[i].cells[filters[tNo][j][0]].innerText === filters[tNo][j][1]) tfArry[tfArry.length - 1].push(true);
                else tfArry[tfArry.length - 1].push(false);

            for (j = 0; j < tfArry[i - startRow].length; j++)
                if (tfArry[i - startRow][j]) tCount[i - startRow]++;
            
            if (iCount !== tCount[i - startRow]) table.rows[i].style.display = "none";
            else { table.rows[i].style.display = ""; returnArry.push(i); }
        }

        return returnArry;

    }

    return -1;
}

function groupDisable() { //Employee Table - Grouping Button Disable / Enable
    const empCheckBoxes = document.getElementsByClassName("employee-check");
    var checkControl = true;

    for (i = 0; i < empCheckBoxes.length; i++)
        if (empCheckBoxes[i].checked) checkControl = false;
    btnStatus(checkControl, "e-g-btn");
}

function empGroup() { //Employee Table - Grouping Button
    empGroupControl = !empGroupControl;

    const checkBox = document.getElementsByClassName("employee-check"), //Employee Table Checkboxes
        markerImgs = document.getElementsByClassName("leaflet-marker-icon"), //Marker Icons
        markerShadows = document.getElementsByClassName("leaflet-marker-shadow"), //Marker Shadows
        outerPolys = document.getElementsByClassName("outer-polyline"), //Temporary Polylines
        innerPolys = document.getElementsByClassName("inner-polyline"), //Permanent Polylines
        dropdown = document.getElementsByClassName("back-to-u-item"); //Back to User Button Items

    var checkArry = [], //Checked Checkbox Indexes
        userArry = []; //User Titles without Checkbox HTMLs

    if (empGroupControl) {

        for (i = 0; i < checkBox.length; i++) //Get Checkbox Indexes & Uncheck Checked Checkboxes
            if (checkBox[i].checked) {
                checkBox[i].checked = false;
                checkBox[i].style.display = "none";
                checkArry.push(i); 
            }

        for (i = 0; i < markerImgs.length; i++){ //Hide All the Leaflet Layers & Close Popups
            mapDisplay(i, "none");
            markers[i].closePopup();
        }

        for (i = 0; i < checkArry.length; i++) { //Unhide Selected Leaflet Layers
            mapDisplay(checkArry[i], "");
            userArry.push(tabEmployee.rows[checkArry[i] + 1].cells[0].innerText);
        }

        for (i = 0; i < filters.length; i++) //Add Required Indexes
            for (j = 0; j < userArry.length; j++)
                    filters[i].push([]);
        
        for (i = 0; i < filters.length; i++) //Keep Untouchable Indexes
            for (j = 0; j < filters[i].length; j++)
                if (filters[i][j][0] > 0) passInx.push([i, j]);

        if (passInx.length !== 0) { //Single Out Indexes that Hold the Same Value
            for (i = 0; i < passInx.length; i++) 
                for (j = 0; j < passInx.length; j++)
                    if (passInx[i][0] === passInx[j][0] && passInx[i][1] === passInx[j][1] && i !== j) passInx.splice(j, 1);
        } else passInx.push(["", ""]); //To Move Through the Loop Below

        for (i = 0; i < filters.length; i++) //Add Filters
            for (j = 0; j < userArry.length; j++) {
                for (k = 0; k < filters[i].length; k++) {
                    for (l = 0; l < passInx.length; l++) {
                        if (i === passInx[l][0] && k === passInx[l][1]) { filters[i].push([]); continue; }
                        filters[i][k][0] = 0;
                        filters[i][k][1] = userArry[j];
                        j++;
                    }
                } filters[i].pop();
            }

        for (i = 0; i < dropdown.length; i++) { //Hide Unselected User's Dropdown Items
            for (j = 0; j < filters[0].length; j++)
                if (dropdown[i].innerText === filters[0][j][1]) { dropdown[i].style.display = ""; break;}
                else dropdown[i].style.display = "none";
        }

        filterControl("emp-tab", 1, tabEmployee.rows.length); //Check Filters for All Tables
        filterControl("tour-tab", 1, tabTour.rows.length);
        filterControl("pat-tab", 1, tabPatrol.rows.length);

        groupBtn.attributes.value.value = "Unselect";

    } else {

        for (i = 0; i < checkBox.length; i++) { //Unhide All Leaflet Layers & Checkboxes & Uncheck All Checkboxes
            mapDisplay(i, "");
            dropdown[i].style.display = "";
            if (checkBox[i].checked) checkBox[i].checked = false;
            checkBox[i].style.display = "";
        }

        showHide("emp-tab", 0, tabEmployee.rows.length, ""); //Unhide Employee Table Rows in the Table

        for (i = 0; i < passInx.length; i++) //Delete Empty Indexes
            if (passInx[i][0].length === 0) passInx.splice(i, 1);

        var holder = []; //Put Temporary Data Into Array
        if (passInx.length !== 0)
            for (i = 0; i < passInx.length; i++)
                holder.push(filters[passInx[i][0]][passInx[i][1]]);
        
        filterStarter(3); //Reset Filters

        for (i = 0; i < passInx.length; i++) //Adding Temporary Data to Filters Again
            filters[passInx[i][0]][filters[passInx[i][0]].length - 1] = holder[i];
        
        passInx = []; //Find New Positions of Untouchable Indexes
        for (i = 0; i < filters.length; i++) 
            for (j = 0; j < filters[i].length; j++) 
                if (filters[i][j][0] !== "") passInx.push([i, j]);

        filterControl("tour-tab", 1, tabTour.rows.length); //Check Filters for Tables
        showHide("pat-tab", 1, tabPatrol.rows.length, ""); filterControl("pat-tab", 1, tabPatrol.rows.length);

        groupBtn.attributes.value.value = "Select";
        groupBtn.classList.replace("enabled", "disabled");
        tabTour.rows[1].style.display = "none";
        tabPatrol.rows[1].style.display = "none";
        empInput.value = "";
        
    }

    function mapDisplay(i, value) { //Display Changes for Leaflet Layers
        markerImgs[i].style.display = value;
        markerShadows[i].style.display = value;
        outerPolys[i].style.display = value;
        innerPolys[i].style.display = value;
    }
}

function empAdd(n) { //Employee Table - Add Data
    for (i = 0; i < n; i++) {
        var row = tabEmployee.insertRow(tabEmployee.length);
        
        for (j = 0; j < tabEmployee.rows[0].cells.length; j++)
            var cell = row.insertCell(j);

        for (j = 0; j < n; j++) {
            empArry[j] = [empCheckBox + markers[i].options.title,
            markers[i].getLatLng(),
            "",
            j];
        }

        for (j = 0; j < empArry[0].length; j++)
            tabEmployee.rows[i + 1].cells[j].innerHTML = empArry[i][j];

    } tabEmployee.deleteRow(tabEmployee.rows.length - 1);
}

function empUpdate(where, q) { //Employee Table - Update Data
    if (where) { //Location Update
        empArry[q][1] = markers[q].getLatLng();
        tabEmployee.rows[q + 1].cells[1].innerHTML = empArry[q][1];

    } else { //Area Update
        empArry[q][2] = polygons[isContain(polygons, q)].options.title;
        tabEmployee.rows[q + 1].cells[2].innerHTML = empArry[q][2];

    }
}

function hideMap() { //Map - Hide / Show Map Button
    if (hideMapControl) {
        mapDiv.style.display = "none";
        document.getElementById("hide-btn").attributes.value.value = "Unhide Map";

    }
    if (!hideMapControl) {
        mapDiv.style.display = "";
        document.getElementById("hide-btn").attributes.value.value = "Hide Map";

    }

    btnStatus(hideMapControl, "back-to-a-btn");
    btnStatus(hideMapControl, "back-to-u-btn");
    hideMapControl = !hideMapControl;
}

function prepareGta() {// Map - Add Items Dropdown Menu for "Go to Area" Button
    for (i = 0; i < polygons.length; i++) //Adding Dropdown Items for Go to Area Button
        document.getElementById("back-to-a-div").innerHTML += "<a href='#' class='back-to-a-item dropdown-item text-danger'>" + polygons[i].options.title + "</a>";

    const goToItems = document.getElementsByClassName("back-to-a-item");

    for (i = 0; i < goToItems.length; i++)
        goToItems[i].setAttribute("onclick", "goToArea(" + (i) + ")");
}

function goToArea(j) { //Map - Go to Area Button
    for (i = 0; i < markers.length; i++)
        markers[i].closePopup();

    if (!j) map.setView(startLocation, 16);
    else map.flyTo(polygons[j - 1].getBounds().getCenter(), 17);
}

function prepareGtu(n) { //Map - Add Items Dropdown Menu for "Go to User" Button
    for (i = 0; i < n; i++)
        document.getElementById("back-to-u-div").innerHTML += "<a href='#' class='back-to-u-item dropdown-item text-danger'>" + markers[i].options.title + "</a>";
    const goToItems = document.getElementsByClassName("back-to-u-item");

    for (i = 0; i < goToItems.length; i++) 
        goToItems[i].setAttribute("onclick", "goToUser(" + i + ", goToUItems)");
}

function goToUser(q, goToItems) { //Map - Go to User Button
    for (i = 0; i < goToItems.length; i++) 
        if (markers[q].options.title === goToItems[i].innerText) {
                map.flyTo(markers[q].getLatLng(), 18);
                markers[q].openPopup();
                
        }
}

function toExcel(tableID, type, fn) { //Tour Table - Export to Excel Table
    var wb = XLSX.utils.table_to_book(document.getElementById(tableID), { sheet: "Sheet JS" }),
        fname = fn || 'tour-table.' + type;
    XLSX.writeFile(wb, fname);
}

function tourAdd(j) { //Tour Table - Add Data (Auto Refresh)
    tourArry[tInx] = [markers[j].options.title,
    getDt(),
    "",
    tourArry.length];

    var row = tabTour.insertRow(tabTour.length);

    for (i = 0; i < tabTour.rows[0].cells.length; i++)
        var cell = row.insertCell(i);

    for (i = 0; i < tourArry[0].length; i++)
        tabTour.rows[tabTour.rows.length - 1].cells[i].innerHTML = tourArry[tInx][i];

    if (!autoRefreshCheck.checked) row.style.display = "none";
    else { filterControl("tour-tab", tabTour.rows.length - 1, tabTour.rows.length); manualRefresh(); }
}

function manualRefresh() { //Tour Table - Add Data (Manual)
    for (i = 1; i < tabTour.rows.length; i++)
        if (tabTour.rows[i].style.display === "none") tabTour.rows[i].style.display = "";

    filterControl("tour-tab", 1, tabTour.rows.length);
    tabTour.rows[1].style.display = "none";
}

function tourUpdate(j) { //Tour Table - Update Data
    var x = 0;

    for (i = 0; i < tourArry.length; i++)
        if (tourArry[i][0] === (markers[j].options.title)) x = i;

    tourArry[x][2] = time[j][3] + " h " + time[j][2] + " m " + time[j][1] + " s ";
    tabTour.rows[x + 2].cells[2].innerHTML = tourArry[x][2];
}

function patAdd(j) { //Patrol Table - Add Data
    patArry[tInx] = [markers[j].options.title,
    "On Patrol",
    getDt(),
    "",
    polygons[isContain(polygons, j)].options.title,
    "<a href='#' class='patrol-img text-danger'>media.jpg</a>",
    patArry.length];

    var row = tabPatrol.insertRow(tabPatrol.length);

    for (i = 0; i < tabPatrol.rows[0].cells.length; i++)
        var cell = row.insertCell(i);

    for (i = 0; i < patArry[0].length; i++)
    tabPatrol.rows[tabPatrol.rows.length - 1].cells[i].innerHTML = patArry[tInx][i];

    filterControl("pat-tab", tabPatrol.rows.length - 1, tabPatrol.rows.length);

    patrolCount++;
    patText.innerText = "Number of Users on Patrol: " + patrolCount;
}

function patUpdate(j) { //Patrol Table - Update Data
    var dtx, x = 0;

    for (i = 0; i < patArry.length; i++)
        if (patArry[i][0] === markers[j].options.title) {
            x = i;
            dtx = getDt();

        }
    
    patArry[x][1] = "Finished"; patArry[x][3] = dtx;
    tabPatrol.rows[x + 2].cells[1].innerHTML = patArry[x][1];
    tabPatrol.rows[x + 2].cells[3].innerHTML = patArry[x][3];

    filterControl("pat-tab", x + 2, x + 3);

    patrolCount--;
    patText.innerText = "Number of Users on Patrol: " + patrolCount;
}

function activePatFilt(filter) { //Patrol Table - Filter Dropdown: On Patrol, End
    var x = filters[2].length;

    filters[2][x] = [1, filter];
    if (filters[2].length === 2 && (filters[2][0][0] === "" || filters[2][0][0] === 1)) filters[2].shift();
    else for (i = 0; i < filters[2].length; i++)
            if(filters[2][i][0] === 1 && i !== filters[2].length - 1) filters[2].splice(i, 1);

    showHide("pat-tab", 1, tabPatrol.rows.length, "none");
    filterControl("pat-tab", 1, tabPatrol.rows.length);

    passInx.push([2, filters[2].length - 1]);
    for (i = 0; i < passInx.length; i++)
        if(passInx[i][0] === "") passInx.splice(i, 1);

    patFilterD[2].classList.replace("disabled", "enabled");
}

function resetPatFilt() { //Patrol Table - Filter Dropdown: Reset
    for (i = 0; i < filters[2].length; i++)
        if (filters[2][i][0] === 1) filters[2].splice(i, 1);
    if (filters[2].length === 0) filters[2].push(["", ""]);

    showHide("pat-tab", 1, tabPatrol.rows.length, "");

    passInx = [["", ""]];
    filterControl("pat-tab", 1, tabPatrol.rows.length);

    tabPatrol.rows[1].style.display = "none";
    patFilterD[2].classList.replace("enabled", "disabled");
}

//Events
empInput.onkeyup = function() { search("emp-tab", this.id, 0); } //Employee Table - Search Input
groupBtn.onclick = function() { empGroup(); } //Employee Table - Group Filter Button

hideMapBtn.onclick = function() { hideMap(); } //Map - Hide Map Button

autoRefreshCheck.onclick = function() { btnStatus(autoRefreshCheck.checked, "refresh-btn"); } //Tour Table - Auto Refresh Checkbox
refreshBtn.onclick = function() { manualRefresh(); } //Tour Table - Manual Refresh Button
toExcelBtn.onclick = function() { toExcel("tour-tab", "xlsx"); } //Tour Table - Export to Excel Table Button
tourPrintBtn.onclick = function() { printSec("tour-tab-div"); } //Tour Table - Print Button

patPrintBtn.onclick = function() { printSec("pat-tab-div"); } //Patrol Table - Print Button
patFilterD[0].onclick = function() { activePatFilt("On Patrol"); } //Patrol Table - Filter 0 (On Patrol)
patFilterD[1].onclick = function() { activePatFilt("Finished"); } //Patrol Table - Filter 1 (End Patrol)
patFilterD[2].onclick = function() { resetPatFilt(); } //Patrol Table - Filter 2 (Reset)

var startLocation = [40.98381739328393, 29.052041172981266],
    apiKey = 'YOUR_ARCGIS_API_KEY',

    map = L.map('map', {
        fullscreenControl: true,
        minZoom: 1
    }).setView(startLocation, 16),
    osm = L.tileLayer('https://tile.openstreetmap.bzh/br/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        noWrap: true,
        bounds: [
            [-90, -180],
            [90, 180]
        ]
    }).addTo(map),
    scale = L.control.scale().addTo(map),
    geocodeService = L.esri.Geocoding.geocodeService({
        apikey: apiKey
    }),
    
    markers = [], //Markers (Users)
    outerPolylines = [], //Polylines for Outside the Polygon
    innerPolylines = [], //Polylines for Inside the Polygon
    polygons = drawArea(), //Polygon Areas

    outerCoord = [[]], //Polyline Coordinates for Outside the Polygon
    innerCoord = [[[[]]]], //Polyline Coordinates for Inside the Polygon
    inx = [], //Represent Indexes from "innerCoord" | [i][0] Index1, Represent Polylines | [i][1] Index2, Represent Polyline Points
    entDate = [], //Last Date Markers Entered an Area
    time = [], //Timers [i][0] Represent Millisecond | [i][1] Represent Second | [i][2] Represent Minute | [i][3] Represent Hour
    
    control = false, //Marker - Polygon Contains Controller
    tInx = 0; //Repeat Number (Table Index) for Table Updates

// map.on('click', function(e) { 
//    alert(e.latlng.lat + ", " + e.latlng.lng);
// });


walk(15, 20, 150, 8000, polygons);

function walk(n, lineLength, intervalRate, dist, polygons) { //Make Move
    var redIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    }),
    violetIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    for (i = 0; i < n; i++) {
        markers.push(L.marker(startLocation, {
            icon: redIcon, 
            title: "User " + i
        }).addTo(map));
        
        outerPolylines.push(L.polyline([[-180, -180], [-180, -180]], {
            color: 'rgba(111, 56, 197, 0.8)',
            className: 'outer-polyline'
        }).addTo(map));
        innerPolylines.push(L.polyline([[-180, -180], [-180, -180]], {
            color: 'rgba(0, 0, 0, 0.6)', 
            className: 'inner-polyline'
        }).addTo(map));

        outerCoord.push([[]]);
        innerCoord.push([[[]]]);
        inx.push([0, 0]);
        time.push(-1);
        entDate.push(-1);

    } outerCoord.shift(); innerCoord.shift();

    for (i = 0; i < n; i++) {
        outerCoord[i].shift();
        for(j = 0; j < (lineLength + 1); j++)
            outerCoord[i].push([startLocation[0], startLocation[1]]);
    } 

    var areaLayers = L.layerGroup(), //Layer Control System
        emptyLayer = L.layerGroup();
    for (i = 0; i < innerPolylines.length; i++)
        areaLayers.addLayer(innerPolylines[i]);

    for (i = 0; i < polygons.length; i++)
        areaLayers.addLayer(polygons[i]);
    
    map.addLayer(areaLayers);
    L.control.layers({
        "Show Areas": areaLayers,
        "Hide Areas": emptyLayer
    }).addTo(map);

    empAdd(n); //Add All Users
    prepareGta(); //Add Areas "Go to Area" Button's Dropdown
    prepareGtu(n); //Add Users "Go to User" Button's Dropdown

    setInterval(() => {
        for (q = 0; q < n; q++) {
            empUpdate(true, q); //Update Employee Table - Location
            popup(q);

            control = isContain(polygons, q);
        
            for (i = 0; i < lineLength; i++)
                for(j = 0; j < 2; j++)
                    outerCoord[q][i][j] = outerCoord[q][i + 1][j];

            newLocation(dist, lineLength, q);
    
            if (isContain(polygons, q) !== -1) { //Permanent Polyline
                innerCoord[q][inx[q][0]][inx[q][1]] = ([outerCoord[q][lineLength][0], outerCoord[q][lineLength][1]]);
                inx[q][1]++;

                markers[q].setLatLng(innerCoord[q][inx[q][0]][innerCoord[q][inx[q][0]].length - 1]);
                innerPolylines[q].setLatLngs(innerCoord[q]);
                outerPolylines[q].setLatLngs(outerCoord[q]);

            } else { //Temporary Polyline
                markers[q].setLatLng(outerCoord[q][lineLength]).setIcon(redIcon);
                outerPolylines[q].setLatLngs(outerCoord[q]);

            }

            if (control === -1 && isContain(polygons, q) !== -1) { //Entering the Polygon
                markers[q].setIcon(violetIcon);
                entDate[q] = new Date();

                empUpdate(false, q); //Update Employee Table - Area
                tourAdd(q); //Add New Data Tour Table
                patAdd(q); //Add New Data Patrol Table
                
                tInx++;

            } else if (control !== -1 && isContain(polygons, q) === -1) { //Going Out from Polygon
                markers[q].setIcon(redIcon);
                time[q] = getAreaTime(new Date().getTime() - entDate[q].getTime(), [1000, 60, 60]);
                
                tourUpdate(q); //Update Tour Table
                patUpdate(q); //Update Patrol Table

                innerCoord[q].push([[]]);
                inx[q][0]++; inx[q][1] = 0;

            }
        }
    }, intervalRate);
}

function popup(q) { //Adding Popup to Marker  
    if (apiKey.includes("API_KEY")) noAddress(); //If API Key is Not Entered, Reverse Geocoding Will Not Work.
    else { //If API Key is Entered, Reverse Geocoding Will Work.
        geocodeService.reverse().latlng(markers[q].getLatLng()).run(function (error, result) {
            if (error) {
                noAddress();
                console.log(error);
                return; 
            }
    
            markers[q].bindPopup(
                "<b style='font-size: 1.25rem'>" + markers[q].options.title + " - Information</b>" + //Header
                "<br><b>Latitude: </b>" + markers[q].getLatLng().lat +  //Lat
                "<br><b>Longitude: </b>" + markers[q].getLatLng().lng + //Lng
                "<br><b>Address: </b>" + result.address.LongLabel + //Address
                "<br><b>Last Visited Place: </b>" + tabEmployee.rows[q + 1].cells[2].innerText //Last Visited Area
            ); 
        });
    }

    function noAddress(){
        markers[q].bindPopup(
            "<b style='font-size: 1.25rem'>" + markers[q].options.title + " - Information</b>" + //Header
            "<br><b>Latitude: </b>" + markers[q].getLatLng().lat +  //Lat
            "<br><b>Longitude: </b>" + markers[q].getLatLng().lng + //Lng
            "<br><b>Last Visited Place: </b>" + tabEmployee.rows[q + 1].cells[2].innerText //Last Visited Area
        );
    }
}

function newLocation(dist, lineLength, q) { //Giving New Location to Marker
    var latV = (Math.random()) / dist,
        lngV = (Math.random()) / dist,
        direction = Math.floor(Math.random() * 20);
    if (direction > 7) direction = Math.floor(Math.random() * 4); //Reduce the Chance of Going Straight
    
    switch (direction) { //Set Direction
        case 0: outerCoord[q][lineLength][0] += latV; outerCoord[q][lineLength][1] += lngV; break; //Northeast
        case 1: outerCoord[q][lineLength][0] -= latV; outerCoord[q][lineLength][1] -= lngV; break; //Southwest
        case 2: outerCoord[q][lineLength][0] += latV; outerCoord[q][lineLength][1] -= lngV; break; //Northwest
        case 3: outerCoord[q][lineLength][0] -= latV; outerCoord[q][lineLength][1] += lngV; break; //Southeast
        case 4: outerCoord[q][lineLength][0] += latV; break; //North
        case 5: outerCoord[q][lineLength][0] -= latV; break; //South
        case 6: outerCoord[q][lineLength][1] += lngV; break; //East
        case 7: outerCoord[q][lineLength][1] -= lngV; break; //West
    }
}

function isContain(polygons, j) { //Control If the Area Contains Marker
    for(i = 0; i < polygons.length; i++)
            if (polygons[i].contains(markers[j].getLatLng())) return i;

    return -1;
}

function getAreaTime(baseValue, timeFractions) { //Clock
    var data = [baseValue];
    
    for (i = 0; i < timeFractions.length; i++) {
        data.push(parseInt(data[i] / timeFractions[i]));
        data[i] = data[i] % timeFractions[i];
    }

    return data;
}

function drawArea() { //Define Areas 
    var polygonLatlngs = //Coordinates for Areas
    [
        [[40.98993353591273, 29.051579833030700], //Area 0
        [40.98734410611007, 29.0511453151702880],
        [40.9857680521782, 29.04901027679443700],
        [40.98502260067399, 29.0514349937439000],
        [40.984738937509256, 29.053387641906742],
        [40.98473083418041, 29.0544497966766400],
        [40.985079276421196, 29.054422974586490],
        [40.9891267438206, 29.05512034893036200],
        [40.98972634749166, 29.0545463562011720]],

        [[40.98452301615978, 29.055077974550798], //Area 1
        [40.98355870988021, 29.0548633978296070],
        [40.98331155347965, 29.0561294004846360],
        [40.98250930173115, 29.0557968065667900],
        [40.98208791306527, 29.0578674719262860],
        [40.98403276136791, 29.0587686941552900],
        [40.9843974140397, 29.05679458832033000]],

        [[40.98143133792221, 29.048758149147037], //Area 2
        [40.98060069987966, 29.0512847900390660],
        [40.9822336027832, 29.05233085155487400],
        [40.98312482694568, 29.0497559309005770],
        [40.9842557213152, 29.05056059360504500],
        [40.98574672779907, 29.0483719110488930],
        [40.98514708793963, 29.0478193759918250],
        [40.98289461108739, 29.0464514493942300]],
                    
        [[40.98120548183793, 29.055259823799137], //Area 3
        [40.980776655924736, 29.054669737815860],
        [40.98025395777374, 29.0534949302673380],
        [40.97809018647969, 29.0522825717926030],
        [40.97787542628065, 29.0533661842346230],
        [40.97902215660076, 29.0606671571731600],
        [40.98078438575148, 29.0565204620361360],
        [40.98078033384422, 29.0561395883560200]]
    ],
    polygons = [];

    for (i = 0; i < polygonLatlngs.length; i++) {
        polygons.push(L.polygon(polygonLatlngs[i], {
            color: 'rgb(135, 162, 251)', 
            title: 'Area ' + i,
            className: 'area-polygon'
        }).addTo(map));

        polygons[i].bindPopup("This is " + polygons[i].options.title);
    }

    return polygons;
}