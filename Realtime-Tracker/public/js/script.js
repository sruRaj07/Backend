const socket = io(); // connection request send to backend

if(navigator.geolocation){
    navigator.geolocation.watchPosition(function(position) {
        const {latitude, longitude} = position.coords;
        socket.emit("send-location",{ latitude,longitude});
    },
    function(error) {
        console.log(error);
    },
    {
        enableHighAccuracy : true,
        timeout : 5000,
        maximumAge : 0,
    }
  );
}

// to get the location
const map = L.map("map").setView([0,0], 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" ,{
    attribution: "SRURAj"
}).addTo(map)


const markers = {};
// get the data from backend and display to frontend
socket.on("receive-location", function(data) {
    const { id,latitude,longitude} = data;
    map.setView([latitude, longitude], 16);
    if(markers[id]){
        markers[id].setLatLng([latitude, longitude]);
    }
    else{
        markers[id] =  L.marker([latitude,longitude]).addTo(map);
    }
});

// if the user get disconnected we are gong to remove the marker
socket.on("user-disconnected", function(id) {
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});