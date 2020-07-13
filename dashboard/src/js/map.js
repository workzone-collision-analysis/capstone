// mapbox accessToken
mapboxgl.accessToken = 'pk.eyJ1IjoiYWV0aGUiLCJhIjoiY2tjZjc1Y3A0MGU5MTJ0cjBkY2N5bmVwbCJ9.WUCl0i-oGT8QCSPBnpBoZg';

//import map
const map = new mapboxgl.Map({
    container: 'map__map', // container id
    style: 'mapbox://styles/aethe/ckcfhxktj05k61itg540hrgr8',
    zoom: 15,
    center: [-73.997482, 40.730880]
});

// set the URL of the datasets
const shortSegmentCentroidURL = 'src/data/short_segment.geojson';
const shortSegmentURL = 'src/data/short_segment_line.geojson';
const segmentURL = 'src/data/segment.geojson';
const shstNodeURL = 'src/data/node.geojson';
const crashZero511 = 'src/data/511_zero.geojson';
const crashNotZero511 = 'src/data/511_not_zero.geojson';

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
        'id': 'segment_transparent',
        'source': 'segment',
        'type': 'line',
        'paint': {
            'line-color': "rgba(0,0,0,0)",
            'line-width': 10
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
        'id': 'shortSegmentCentroid_transparent',
        'source': 'shortSegmentCentroid',
        'type': 'circle',
        'paint': {
            'circle-color': 'rgba(0,0,0,0)',
            'circle-radius': 8
        }
    });

    map.addLayer({
        'id': 'node_transparent',
        'source': 'node',
        'type': 'circle',
        'paint': {
            'circle-color': 'rgba(0,0,0,0)',
            'circle-radius': 8
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

    // these are related to click activities on each layers
    map.on('click', 'segment_transparent', function (e) {
        let clicked_feature = e.features[0];
        const target = store['segment_attribute'].filter(d=>d.id === clicked_feature.id)[0];
        update_attribute(target);
    });

    map.on('click', 'node_transparent', function (e) {
        let clicked_feature = e.features[0];
        console.log(clicked_feature.id);
    });

    map.on('click', 'shortSegmentCentroid_transparent', function (e) {
        let clicked_feature = e.features[0];
        const target = store['segment_attribute'].filter(d=>d.id === clicked_feature.id)[0];
        const monthlyCrash = store['monthlyCrash'].filter(d=>d.id === clicked_feature.id);
        document.getElementById('street-info__Crash').innerText = clicked_feature.properties.count;
        update_attribute(target);
        monthlyCrashChart(monthlyCrash);
        const hourlyCrash = store['hourlyCrash'].filter(d=>d.id === clicked_feature.id);
        hourlyCrashChart(hourlyCrash);
        const hourlyInjured = store['hourlyInjured'].filter(d=>d.id === clicked_feature.id);
        hourlyInjuredChart(hourlyInjured);
    });

    map.on('touchstart', 'shortSegment', function (e) {
        let clicked_feature = e.features[0];
    });

    map.on('touchstart', 'shortSegmentCentroid', function (e) {
        let clicked_feature = e.features[0];
    });

});

// this function is for the dropbox menu
function changeMap(source){
    if(source.value==='511'){
        map.setLayoutProperty('segment', 'visibility', 'none');
        map.setLayoutProperty('node', 'visibility', 'none');
        map.setLayoutProperty('shortSegment', 'visibility', 'none');
        map.setLayoutProperty('shortSegmentCentroid', 'visibility', 'none');
        map.setLayoutProperty('shortSegmentCentroid_transparent', 'visibility', 'none');
        map.setLayoutProperty('node_transparent', 'visibility', 'none');
        map.setLayoutProperty('segment_transparent', 'visibility', 'none');
        document.getElementById('map__legend-crash').style.display='none';
        document.getElementById('map__legend-511').style.display='flex';
        if(map.getLayer('511zero')=== undefined){
            map.addSource('511zero', {type: 'geojson', data: crashZero511, 'promoteId': 'event_id'});
            map.addSource('511NotZero', {type: 'geojson', data: crashNotZero511, 'promoteId': 'event_id'});

            map.addLayer({
                'id': '511zero',
                'source': '511zero',
                'type': 'circle',
                'paint': {
                    "circle-opacity": 0,
                    "circle-stroke-width": 2,
                    "circle-stroke-color": '#F44336',
                    'circle-radius': 2
                }
            });


            map.addLayer({
                'id': '511NotZero',
                'source': '511NotZero',
                'type': 'circle',
                'paint': {
                    "circle-color": '#F44336',
                    "circle-stroke-width": 2,
                    "circle-stroke-color": '#F44336',
                    'circle-radius': ['case',
                        ['<', ['get', 'crash_count_900ft'], 2], 2,
                        ['<', ['get', 'count'], 4], 4, 8]
                }
            });
        }
       else{
            map.setLayoutProperty('511zero', 'visibility', 'visible');
            map.setLayoutProperty('511NotZero', 'visibility', 'visible');
        }
    }
    else{
        map.setLayoutProperty('segment', 'visibility', 'visible');
        map.setLayoutProperty('node', 'visibility', 'visible');
        map.setLayoutProperty('shortSegment', 'visibility', 'visible');
        map.setLayoutProperty('shortSegmentCentroid', 'visibility', 'visible');
        map.setLayoutProperty('shortSegmentCentroid_transparent', 'visibility', 'visible');
        map.setLayoutProperty('node_transparent', 'visibility', 'visible');
        map.setLayoutProperty('segment_transparent', 'visibility', 'visible');
        map.setLayoutProperty('511zero', 'visibility', 'none');
        map.setLayoutProperty('511NotZero', 'visibility', 'none');
        document.getElementById('map__legend-crash').style.display='flex';
        document.getElementById('map__legend-511').style.display='none';
    }
}
