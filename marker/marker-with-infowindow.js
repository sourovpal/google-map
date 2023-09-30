  initMap();
function initMap() {
    var locations = [
        [23.807385388865693, 90.41934567726697],
        [23.784139272327046, 90.41522580447062],
        [23.758060978969986, 90.40629941341184],
        [23.799532436318174, 90.37711698110431],
        [23.739520219042422, 90.36407071724918]
    ];

    const position = new google.maps.LatLng(44.73532729516236, 14.806330871582077);
    const map = new google.maps.Map(document.getElementById('map'), {
      zoom:16,
      center:position,
    });
    map.setMapTypeId('satellite');
    console.log(google.maps.SymbolPath)
    var myIcon ='https://s3-us-west-2.amazonaws.com/s.cdpn.io/123941/cheshire1-icon.png';
    var marker = new google.maps.Marker({
      map,
      position,
      icon:{
        // url:myIcon,
        // size: new google.maps.Size(100, 70), // Area Height and Width
        // scaledSize: new google.maps.Size(70, 70), // Icon Size
        // origin: new google.maps.Point(0, 0), // Size 200 - 200 left Right Top Bottom
        // anchor:new google.maps.Point(0, 0), // Widndow left Right Top Bottom
        //CIRCLE, FORWARD_CLOSED_ARROW, FORWARD_OPEN_ARROW, BACKWARD_CLOSED_ARROW, BACKWARD_OPEN_ARROW
        path: google.maps.SymbolPath.CIRCLE,
        scale: 5,
        strokeWeight: 2,
        strokeColor:'#ffffff',
        fillColor: 'red',
        fillOpacity: 0,
        rotation: 0,
        anchor: new google.maps.Point(0,2),
        title: 'Precision Profiles Manufacturing'
      }

    });

    var contentString = 
    '<div>'+
    '<div>'+
    '</div>'+
    '<h1 style = "font-size:20px;padding-bottom:10px;"><b>Precision Profiles Manuafcturing</b></h1>'+
    '<div id="bodyContent">'+
    '<p>The regions leading supplier of aircraft and precision engineering solutions.<p>'+
    '</div>'+
    '</div>';
    var infowindow = new google.maps.InfoWindow({
      content: contentString,
      maxWidth: 500,
      maxHeight: 400,
    });
    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });   
    
    
    
    var markerImage = new google.maps.MarkerImage(
            'img/icons/bank_euro.png',
            new google.maps.Size(30, 30),
            new google.maps.Point(0, 0),
            new google.maps.Point(15, 15)
        );
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      icon: markerImage
    });
    

    var image = {
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };

    var image = new google.maps.MarkerImage(
      place.icon,
      new google.maps.Size(71, 71),
      new google.maps.Point(0, 0),
      new google.maps.Point(17, 34),
      new google.maps.Size(25, 25));

    let markerInstance = mapInstance.addMarker({
        lat : _lat,
        lng : _lng,
        label: '8',
        icon : {
          url :  'url_image.png',
          origin:  new google.maps.Point(0, 0),
        }
    });
 

}
