// mapbox accessToken
mapboxgl.accessToken = 'pk.eyJ1IjoiYWV0aGUiLCJhIjoiY2tjZjc1Y3A0MGU5MTJ0cjBkY2N5bmVwbCJ9.WUCl0i-oGT8QCSPBnpBoZg';

//import map
const map = new mapboxgl.Map({
    container: 'map__map', // container id
    style: 'mapbox://styles/aethe/ckcfhxktj05k61itg540hrgr8',
    zoom: 15,
    center: [-73.997482, 40.730880]
});

const shortSegmentCentroidURL = 'src/data/short_segment_centroid.geojson';
const shortSegmentURL = 'src/data/shst_short_segment.geojson';
const segmentURL = 'src/data/segment.geojson';
const shstNodeURL = 'src/data/node.geojson';

const colorArray = ['#81C784', '#FCBBA1', '#FC9272', '#FB6A4A', '#DE2D26', '#A50F15'];
const breakPointArray = ['0','1~10','11~20','21~30','31~40','40~'];

map.on('load', function () {
    window.setInterval(function () {
        map.getSource('shortSegment').setData(shortSegmentURL);
        map.getSource('segment').setData(segmentURL);
        map.getSource('shortSegmentCentroid').setData(shortSegmentCentroidURL);
        map.getSource('node').setData(shstNodeURL);
    }, 2000);

    map.addSource('segment', {type: 'geojson', data: segmentURL, 'promoteId': 'id'});
    map.addSource('shortSegment', {type: 'geojson', data: shortSegmentURL, 'promoteId': 'id'});
    map.addSource('shortSegmentCentroid', {type: 'geojson', data: shortSegmentCentroidURL, 'promoteId': 'id'});
    map.addSource('node', {type: 'geojson', data: shstNodeURL, 'promoteId': 'node_id'});

    map.addLayer({
        'id': 'segment',
        'source': 'segment',
        'type': 'line',
        'paint': {
            'line-color': ['case',
                ['==', ['get', 'count'], 0], colorArray[0],
                ['<', ['get', 'count'], 11], colorArray[1],
                ['<', ['get', 'count'], 21], colorArray[2],
                ['<', ['get', 'count'], 31], colorArray[3],
                ['<', ['get', 'count'], 41], colorArray[4],
                colorArray[5]],
            'line-width': 3
        }
    });


    map.addLayer({
        'id': 'shortSegment',
        'source': 'shortSegment',
        'type': 'line',
        'paint': {
            'line-color': '#424242',
            'line-dasharray': [2, 2],
            'line-width': 1
        }
    });

    map.addLayer({
        'id': 'shortSegmentCentroid',
        'source': 'shortSegmentCentroid',
        'type': 'circle',
        'paint': {
            'circle-color': ['case',
                ['==', ['get', 'count'], 0], colorArray[0],
                ['<', ['get', 'count'], 11], colorArray[1],
                ['<', ['get', 'count'], 21], colorArray[2],
                ['<', ['get', 'count'], 31], colorArray[3],
                ['<', ['get', 'count'], 41], colorArray[4],
                colorArray[5]],
            'circle-radius': 5
        }
    });

    map.addLayer({
        'id': 'node',
        'source': 'node',
        'type': 'circle',
        'paint': {
            'circle-color': ['case',
                ['==', ['get', 'count'], 0], colorArray[0],
                ['<', ['get', 'count'], 11], colorArray[1],
                ['<', ['get', 'count'], 21], colorArray[2],
                ['<', ['get', 'count'], 31], colorArray[3],
                ['<', ['get', 'count'], 41], colorArray[4],
                colorArray[5]],
            'circle-radius': 5
        }
    });


    map.on('click', 'segment', function (e) {
        let clicked_feature = e.features[0];
        console.log(clicked_feature);
    });

    map.on('click', 'node', function (e) {
        let clicked_feature = e.features[0];
        console.log(clicked_feature);
    });


    map.on('click', 'shortSegment', function (e) {
        let clicked_feature = e.features[0];
        console.log(clicked_feature);
    });

    map.on('click', 'shortSegmentCentroid', function (e) {
        let clicked_feature = e.features[0];
        console.log(clicked_feature);
    });

    map.on('touchstart', 'shortSegment', function (e) {
        let clicked_feature = e.features[0];
        console.log(clicked_feature);
    });

    map.on('touchstart', 'shortSegmentCentroid', function (e) {
        let clicked_feature = e.features[0];
        console.log(clicked_feature);
    });
});

function changeMap(source){
    if(source.value==='511'){
        map.setLayoutProperty('segment', 'visibility', 'none');
        map.setLayoutProperty('node', 'visibility', 'none');
        map.setLayoutProperty('shortSegment', 'visibility', 'none');
        map.setLayoutProperty('shortSegmentCentroid', 'visibility', 'none');
        document.getElementById('map__legend-crash').style.display='none';
        document.getElementById('map__legend-511').style.display='flex';
    }
    else{
        map.setLayoutProperty('segment', 'visibility', 'visible');
        map.setLayoutProperty('node', 'visibility', 'visible');
        map.setLayoutProperty('shortSegment', 'visibility', 'visible');
        map.setLayoutProperty('shortSegmentCentroid', 'visibility', 'visible');
        document.getElementById('map__legend-crash').style.display='flex';
        document.getElementById('map__legend-511').style.display='none';
    }
}
