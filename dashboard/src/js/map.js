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
const crashZero511 = 'src/data/511_crash_not_occurred.geojson';
const crashNotZero511 = 'src/data/511_crash_occurred.geojson';

const colorArray = ['#81C784', '#FCBBA1', '#FC9272', '#FB6A4A', '#DE2D26', '#A50F15'];
const breakPointArray = ['0','1~10','11~20','21~30','31~40','40~'];

const popupTemplateCrash =
    '<div class="map__popup">\n' +
        '<h4>Street / Node Characteristic</h4>\n'+
        '<p>Number of Crashes: <span id="street-info__Crash"></span></p>\n' +
        '<p>Roadway Type: <span id="street-info__Roadway"></span></p>\n' +
        '<p>Posted Speed: <span id="street-info__Speed"></span></p>\n' +
        '<p>Street Width: <span id="street-info__Width"></span></p>\n' +
        '<p>Number of Lanes: <span id="street-info__Total"></span></p>\n' +
    '</div>';

const popupTemplate511 =
    '<div class="map__popup">\n' +
        '<h4>511 Event Characteristic</h4>\n'+
        '<p>Number of Crashes (within 900ft): <span id="511-info__Crash"></span></p>\n' +
        '<p>Created Time: <span id="511-info__CreateTime"></span></p>\n' +
        '<p>Closed Time: <span id="511-info__CloseTime"></span></p>\n' +
        '<p>Duration (hour): <span id="511-info__Duration"></span></p>\n' +
        '<p>Peak-time duration: <span id="511-info__PeakDuration"></span></p>\n' +
        '<p>Roadway Type: <span id="511-info__Roadway"></span></p>\n' +
        '<p>Posted Speed: <span id="511-info__Speed"></span></p>\n' +
        '<p>Street Width: <span id="511-info__Width"></span></p>\n' +
        '<p>Number of Lanes: <span id="511-info__Total"></span></p>\n' +
    '</div>';

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
        Array.from(document.getElementsByClassName('chart__message')).forEach(function(element){
            element.style.display = 'none';
        });
        let clicked_feature = e.features[0];
        const target = store['segment_attribute'].filter(d=>d.id === clicked_feature.id)[0];
        const lngArray = clicked_feature.geometry.coordinates.map(d=>d[0]);
        const latArray = clicked_feature.geometry.coordinates.map(d=>d[1]);
        const lngAverage = lngArray.reduce((a, b) => a + b) / lngArray.length;
        const latAverage = latArray.reduce((a, b) => a + b) / latArray.length;
        const description = 'test';
        //document.getElementById('street-info__Crash').innerText = clicked_feature.properties.count;
        //update_attribute(target);
        const monthlyCrash = JSON.parse(store['monthlyCrashSegment'].filter(d=>d.id === clicked_feature.id)[0]['count']);
        monthlyCrashChart(monthlyCrash);
        const hourlyCrash =  JSON.parse(store['hourlyCrashSegment'].filter(d=>d.id === clicked_feature.id)[0]['count']);
        hourlyCrashChart(hourlyCrash);
        const hourlyInjured = store['hourlyInjuredSegment'].filter(d=>d.id === clicked_feature.id)[0];
        hourlyInjuredChart(hourlyInjured);
        if(store['popup']!==undefined){
            store['popup'].remove();
        }
        store['popup'] = new mapboxgl.Popup()
                            .setLngLat([lngAverage,latAverage])
                            .setHTML(popupTemplateCrash)
                            .addTo(map);

        document.getElementById('street-info__Crash').innerText = clicked_feature.properties.count;
        update_attribute(target);
    });

    map.on('click', 'node', function (e) {
        Array.from(document.getElementsByClassName('chart__message')).forEach(function(element){
            element.style.display = 'none';
        });
        const clicked_feature = e.features[0];
        const target = store['node_attribute'].filter(d=>d.node_id === clicked_feature.id)[0];
        const monthlyCrash = JSON.parse(store['monthlyCrashNode'].filter(d=>d.id === clicked_feature.id)[0]['count']);
        monthlyCrashChart(monthlyCrash);
        const hourlyCrash =  JSON.parse(store['hourlyCrashNode'].filter(d=>d.id === clicked_feature.id)[0]['count']);
        hourlyCrashChart(hourlyCrash);
        const hourlyInjured = store['hourlyInjuredNode'].filter(d=>d.id === clicked_feature.id)[0];
        hourlyInjuredChart(hourlyInjured);

        if(store['popup']!==undefined){
            store['popup'].remove();
        }

        store['popup'] = new mapboxgl.Popup()
            .setLngLat(clicked_feature.geometry.coordinates)
            .setHTML(popupTemplateCrash)
            .addTo(map);
        document.getElementById('street-info__Crash').innerText = clicked_feature.properties.count;
        update_attribute(target);
    });

    map.on('click', 'shortSegmentCentroid', function (e) {
        Array.from(document.getElementsByClassName('chart__message')).forEach(function(element){
            element.style.display = 'none';
        });
        let clicked_feature = e.features[0];
        const target = store['segment_attribute'].filter(d=>d.id === clicked_feature.id)[0];
        const monthlyCrash = JSON.parse(store['monthlyCrashShort'].filter(d=>d.id === clicked_feature.id)[0]['count']);
        monthlyCrashChart(monthlyCrash);
        const hourlyCrash =  JSON.parse(store['hourlyCrashShort'].filter(d=>d.id === clicked_feature.id)[0]['count']);
        hourlyCrashChart(hourlyCrash);
        const hourlyInjured = store['hourlyInjuredShort'].filter(d=>d.id === clicked_feature.id)[0];
        hourlyInjuredChart(hourlyInjured);

        if(store['popup']!==undefined){
            store['popup'].remove();
        }

        store['popup'] = new mapboxgl.Popup()
            .setLngLat(clicked_feature.geometry.coordinates)
            .setHTML(popupTemplateCrash)
            .addTo(map);

        document.getElementById('street-info__Crash').innerText = clicked_feature.properties.count;
        update_attribute(target);
    });

    map.on('click', '511zero', function (e) {
        Array.from(document.getElementsByClassName('chart__message')).forEach(function(element){
            element.style.display = 'none';
        });
        const clicked_feature = e.features[0];
        const target = store['511_attribute'].filter(d=>+d.event_id === clicked_feature.id)[0];

        const hourlyCrash =  JSON.parse(store['hourlyCrash511'].filter(d=>+d.event_id === clicked_feature.id)[0]['crash_by_hour']);
        hourly511Chart(hourlyCrash);

        if(store['popup']!==undefined){
            store['popup'].remove();
        }

        store['popup'] = new mapboxgl.Popup()
            .setLngLat(clicked_feature.geometry.coordinates)
            .setHTML(popupTemplate511)
            .addTo(map);

        update_attribute_511(target);
    });

    map.on('click', '511NotZero', function (e) {
        Array.from(document.getElementsByClassName('chart__message')).forEach(function(element){
            element.style.display = 'none';
        });
        let clicked_feature;
        if(e.features.length>1){
            clicked_feature = Array.from(e.features).sort((a,b)=>d3.descending(a.properties['crash_count_900ft'], b.properties['crash_count_900ft']))[0];
        } else{
            clicked_feature = e.features[0];
        }
        console.log(clicked_feature.id);
        const target = store['511_attribute'].filter(d=>+d.event_id === clicked_feature.id)[0];
        const hourlyCrash =  JSON.parse(store['hourlyCrash511'].filter(d=>+d.event_id === clicked_feature.id)[0]['crash_by_hour']);
        hourly511Chart(hourlyCrash);

        if(store['popup']!==undefined){
            store['popup'].remove();
        }

        store['popup'] = new mapboxgl.Popup()
            .setLngLat(clicked_feature.geometry.coordinates)
            .setHTML(popupTemplate511)
            .addTo(map);

        update_attribute_511(target);
    });

});

// this function is for the dropbox menu
function changeMap(source){
    if(store['popup']!==undefined){
        store['popup'].remove();
    }
    Array.from(document.getElementsByClassName('chart__message')).forEach(function(element){
        element.style.display = 'block';
    });
    if(source.value==='511'){
        map.setLayoutProperty('segment', 'visibility', 'none');
        map.setLayoutProperty('node', 'visibility', 'none');
        map.setLayoutProperty('shortSegment', 'visibility', 'none');
        map.setLayoutProperty('shortSegmentCentroid', 'visibility', 'none');
        map.setLayoutProperty('segment_transparent', 'visibility', 'none');
        document.getElementById('map__legend-crash').style.display='none';
        document.getElementById('map__legend-511').style.display='flex';
        document.getElementById('chart__street').style.display='none';
        document.getElementById('chart__511').style.display='flex';
        if(map.getLayer('511zero')=== undefined){
            map.addSource('511zero', {type: 'geojson', data: crashZero511, 'promoteId': 'event_id'});
            map.addSource('511NotZero', {type: 'geojson', data: crashNotZero511, 'promoteId': 'event_id'});

            map.addLayer({
                'id': '511zero',
                'source': '511zero',
                'type': 'circle',
                'paint': {
                    "circle-opacity": 0,
                    "circle-stroke-width": 1,
                    "circle-stroke-opacity":0.6,
                    "circle-stroke-color": ['case',
                        ['==', ['get', 'cluster'], 0], "#F44336",
                        ['==', ['get', 'cluster'], 1], "#2196F3",
                        ['==', ['get', 'cluster'], 2], "#4CAF50",
                        "#FFC107"],
                    'circle-radius': 3
                }
            });


            map.addLayer({
                'id': '511NotZero',
                'source': '511NotZero',
                'type': 'circle',
                'paint': {
                    "circle-opacity": 0.6,
                    "circle-color": ['case',
                        ['==', ['get', 'cluster'], 0], "#F44336",
                        ['==', ['get', 'cluster'], 1], "#2196F3",
                        ['==', ['get', 'cluster'], 2], "#4CAF50",
                        "#FFC107"],
                    'circle-radius': ['+',1,['*',4,['^', ['get', 'crash_count_900ft'], 0.5]]]
                }
            });

            clusteringBarChart();
        }
       else{
            map.setLayoutProperty('511zero', 'visibility', 'visible');
            map.setLayoutProperty('511NotZero', 'visibility', 'visible');
        }
        store['monthlyChart'].destroy();
        store['hourlyChart'].destroy();
        store['hourlyInjuredChart'].destroy();
        store['monthlyChart'] = undefined;
        store['hourlyChart'] = undefined;
        store['hourlyInjuredChart'] = undefined;
    }
    else{
        map.setLayoutProperty('segment', 'visibility', 'visible');
        map.setLayoutProperty('node', 'visibility', 'visible');
        map.setLayoutProperty('shortSegment', 'visibility', 'visible');
        map.setLayoutProperty('shortSegmentCentroid', 'visibility', 'visible');
        map.setLayoutProperty('segment_transparent', 'visibility', 'visible');
        map.setLayoutProperty('511zero', 'visibility', 'none');
        map.setLayoutProperty('511NotZero', 'visibility', 'none');
        document.getElementById('map__legend-crash').style.display='flex';
        document.getElementById('map__legend-511').style.display='none';
        document.getElementById('chart__street').style.display='flex';
        document.getElementById('chart__511').style.display='none';
        store['hourly511Chart'].destroy();
        store['hourly511Chart'] = undefined;
    }
}
