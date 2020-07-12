// mapbox accessToken
mapboxgl.accessToken = 'pk.eyJ1IjoiYWV0aGUiLCJhIjoiY2tjZjc1Y3A0MGU5MTJ0cjBkY2N5bmVwbCJ9.WUCl0i-oGT8QCSPBnpBoZg';

//import map
const map = new mapboxgl.Map({
    container: 'map__map', // container id
    style: 'mapbox://styles/aethe/ckcfhxktj05k61itg540hrgr8',
    zoom: 15,
    center: [-73.997482, 40.730880]
});

const shortSegmentCentroidURL = "src/data/short_segment_centroid.geojson";
const shortSegmentURL = "src/data/shst_short_segment.geojson";
const segmentURL = "src/data/segment.geojson";
const shstNodeURL = "src/data/node.geojson";

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
            "line-color": ["case",
                ["==",["get","count"],0], "#81C784",
                ["<", ["get","count"], 10], "#fcbba1",
                ["<", ["get","count"], 20], "#fc9272",
                ["<", ["get","count"], 30], "#fb6a4a",
                ["<", ["get","count"], 40], "#de2d26",
                "#a50f15"],
            "line-width": 3
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
            "circle-color": ["case",
                ["==",["get","count"],0], "#81C784",
                ["<", ["get","count"], 10], "#fcbba1",
                ["<", ["get","count"], 20], "#fc9272",
                ["<", ["get","count"], 30], "#fb6a4a",
                ["<", ["get","count"], 40], "#de2d26",
                "#a50f15"],
            "circle-radius":5
        }
    });

    map.addLayer({
        "id": "shstNode",
        "source": "shstNode",
        "type": "circle",
        "paint": {
            "circle-color": ["case",
                ["==",["get","count"],0], "#81C784",
                ["<", ["get","count"], 10], "#fcbba1",
                ["<", ["get","count"], 20], "#fc9272",
                ["<", ["get","count"], 30], "#fb6a4a",
                ["<", ["get","count"], 40], "#de2d26",
                "#a50f15"],
            "circle-radius":5
        }
    });


    map.on("click", "shortSegment", function(e) {
        let clicked_feature = e.features[0];
        console.log(clicked_feature);
    });
});

