// mapbox accessToken
mapboxgl.accessToken = 'pk.eyJ1IjoiYWV0aGUiLCJhIjoiY2tjZjc1Y3A0MGU5MTJ0cjBkY2N5bmVwbCJ9.WUCl0i-oGT8QCSPBnpBoZg';

//import map
const map = new mapboxgl.Map({
    container: 'map__map', // container id
    style: 'mapbox://styles/aethe/ckcfhxktj05k61itg540hrgr8',
    zoom: 15,
    center: [-73.997482, 40.730880]
});

const shortSegmentURL = "src/data/short_segment.geojson";
const shstNodeURL = "src/data/shst_node.geojson";

map.on('load', function (){
    window.setInterval(function() {
        map.getSource('shortSegment').setData(shortSegmentURL);
        map.getSource('shstNode').setData(shstNodeURL);
    }, 2000);

    map.addSource('shortSegment', { type: 'geojson', data:shortSegmentURL , 'promoteId': 'short_segment_id'});
    map.addSource('shstNode', { type: 'geojson', data:shstNodeURL , 'promoteId': 'node_id'});

    map.addLayer({
        "id": "shortSegment",
        "source": "shortSegment",
        "type": "circle",
        "paint": {
            "circle-color": "#F44336",
            "circle-radius":4
        }
    });

    map.addLayer({
        "id": "shstNode",
        "source": "shstNode",
        "type": "circle",
        "paint": {
            "circle-color": "#2196F3",
            "circle-radius":4
        }
    });

});