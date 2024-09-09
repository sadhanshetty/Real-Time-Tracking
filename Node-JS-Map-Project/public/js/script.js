window.onload = function() {
    const map = L.map("map").setView([0, 0], 20
    );
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors"
    }).addTo(map);

    const markers = {};

    const socket = io();

    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                socket.emit("send-location", { latitude, longitude });
            },
            (error) => {
                console.error(error);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    }

    socket.on("receive-location", (data) => {
        const { id, latitude, longitude } = data;
        map.setView([latitude, longitude]);
        const offsetLat = latitude + (Math.random() - 0.5) * 0.0001;
        const offsetLng = longitude + (Math.random() - 0.5) * 0.0001;
        if (markers[id]) {
              // Add a small random offset to avoid marker overlap
        
            markers[id].setLatLng([offsetLat, offsetLng]);
        } else {
            markers[id] = L.marker([offsetLat, offsetLng]).addTo(map);
        }
    });

    socket.on("user-disconnected", (id) => {
        if (markers[id]) {
            map.removeLayer(markers[id]);
            delete markers[id];
        }
    });
};


// window.onload = function() {
//     const map = L.map("map").setView([0, 0], 16);
//     L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//         attribution: "© OpenStreetMap contributors"
//     }).addTo(map);

//     const markers = {};

//     const socket = io();

//     if (navigator.geolocation) {
//         navigator.geolocation.watchPosition(
//             (position) => {
//                 const { latitude, longitude } = position.coords;
//                 socket.emit("send-location", { latitude, longitude });
//             },
//             (error) => {
//                 console.error(error);
//             },
//             {
//                 enableHighAccuracy: true,
//                 timeout: 5000,
//                 maximumAge: 0
//             }
//         );
//     } 

//     socket.on("receive-location", (data) => {
//         const { id, latitude, longitude } = data;

//         // Add a small random offset to avoid marker overlap
//         const offsetLat = latitude + (Math.random() - 0.5) * 0.0001;
//         const offsetLng = longitude + (Math.random() - 0.5) * 0.0001;

//         if (markers[id]) {
//             markers[id].setLatLng([offsetLat, offsetLng]);
//         } else {
//             markers[id] = L.marker([offsetLat, offsetLng]).addTo(map);
//         }
//     });

//     socket.on("user-disconnected", (id) => {
//         if (markers[id]) {
//             map.removeLayer(markers[id]);
//             delete markers[id];
//         }
//     });
// };

