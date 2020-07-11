// mapbox accessToken
mapboxgl.accessToken = 'pk.eyJ1IjoiYWV0aGUiLCJhIjoiY2tjZjc1Y3A0MGU5MTJ0cjBkY2N5bmVwbCJ9.WUCl0i-oGT8QCSPBnpBoZg';

//import map
const map = new mapboxgl.Map({
    container: 'map__map', // container id
    style: 'mapbox://styles/aethe/ckcfhxktj05k61itg540hrgr8',
    zoom: 15,
    center: [-73.997482, 40.730880]
});

const shortSegmentCentroidURL = "src/data/shst_short_segment_centroid.geojson";
const shortSegmentURL = "src/data/shst_short_segment.geojson";
const segmentURL = "src/data/shst_segment_filtered_simplified.geojson";
const shstNodeURL = "src/data/shst_node_filtered.geojson";

map.on('load', function (){
    window.setInterval(function() {
        map.getSource('shortSegment').setData(shortSegmentURL);
        map.getSource('segment').setData(segmentURL);
        map.getSource('shortSegmentCentroid').setData(shortSegmentCentroidURL);
        map.getSource('shstNode').setData(shstNodeURL);
    }, 2000);

    map.addSource('segment', { type: 'geojson', data:segmentURL , 'promoteId': 'id'});
    map.addSource('shortSegment', { type: 'geojson', data:shortSegmentURL , 'promoteId': 'id'});
    map.addSource('shortSegmentCentroid', { type: 'geojson', data:shortSegmentCentroidURL , 'promoteId': 'id'});
    map.addSource('shstNode', { type: 'geojson', data:shstNodeURL , 'promoteId': 'node_id'});

    map.addLayer({
        "id": "segment",
        "source": "segment",
        "type": "line",
        "paint": {
            "line-color": '#424242',
            "line-width": 2
        }
    });


    map.addLayer({
        "id": "shortSegment",
        "source": "shortSegment",
        "type": "line",
        "paint": {
            "line-color": '#424242',
            "line-dasharray": [2,2],
            "line-width": 1
        }
    });

    map.addLayer({
        "id": "shortSegmentCentroid",
        "source": "shortSegmentCentroid",
        "type": "circle",
        "paint": {
            "circle-color": "#F44336",
            "circle-radius":5
        }
    });

    map.addLayer({
        "id": "shstNode",
        "source": "shstNode",
        "type": "circle",
        "paint": {
            "circle-color": "#2196F3",
            "circle-radius":5
        }
    });


    map.on("click", "shortSegment", function(e) {
        let clicked_feature = e.features[0];
        console.log(clicked_feature);
    });
});

