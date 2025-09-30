const parsedCoordinates = JSON.parse(cordinates);
  
    mapboxgl.accessToken =maptoken;

        
    const map = new mapboxgl.Map({
        container: 'map', // container ID
         style: 'mapbox://styles/mapbox/streets-v12',
        center: parsedCoordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 10 // starting zoom
    });
console.log(cordinates)

console.log('Parsed coordinates:', parsedCoordinates);

const marker1 = new mapboxgl.Marker({ color: 'red'})
    .setLngLat(parsedCoordinates)
     .setPopup(
        new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h4>Welcome to Wanderlust</h4>`)
    )
    .addTo(map);

    