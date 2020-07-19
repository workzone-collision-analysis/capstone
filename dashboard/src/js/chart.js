const store = {};

Promise.all([
    d3.csv('src/data/shared_street_with_attribute.csv'),
    d3.csv('src/data/shared_node_with_attribute.csv'),
    d3.csv('src/data/month_array.csv'),
    d3.csv('src/data/crash_short_segment_monthly.csv'),
    d3.csv('src/data/crash_node_monthly.csv'),
    d3.csv('src/data/crash_segment_monthly.csv'),
    d3.csv('src/data/crash_short_segment_hourly.csv'),
    d3.csv('src/data/crash_node_hourly.csv'),
    d3.csv('src/data/crash_segment_hourly.csv'),
    d3.csv('src/data/crash_short_segment_hourly_injured.csv'),
    d3.csv('src/data/crash_node_hourly_injured.csv'),
    d3.csv('src/data/crash_segment_hourly_injured.csv'),
    d3.csv('src/data/511_with_null.csv'),
    d3.csv('src/data/511_hourly_crash.csv')
]).then(([segment, node, monthlyArray, monthlyCrashShort, monthlyCrashNode, monthlyCrashSegment,
          hourlyCrashShort, hourlyCrashNode, hourlyCrashSegment, hourlyInjuredShort, hourlyInjuredNode, hourlyInjuredSegment,
          event511, hourlyCrash511]) => {
    store['segment_attribute'] = segment;
    store['node_attribute'] = node;
    store['511_attribute'] = event511;
    store['monthArray'] = monthlyArray.map(d=>d3.timeParse('%Y-%m-%d')(d['0']));
    store['monthlyCrashShort'] = monthlyCrashShort;
    store['monthlyCrashNode'] = monthlyCrashNode;
    store['monthlyCrashSegment'] = monthlyCrashSegment;
    store['hourlyCrashShort'] = hourlyCrashShort;
    store['hourlyCrashNode'] = hourlyCrashNode;
    store['hourlyCrashSegment'] = hourlyCrashSegment;
    store['hourlyInjuredShort'] = hourlyInjuredShort;
    store['hourlyInjuredNode'] = hourlyInjuredNode;
    store['hourlyInjuredSegment'] = hourlyInjuredSegment;
    store['hourlyCrash511'] = hourlyCrash511;
});

function modal(){
    document.getElementById('modal').style.display='flex';
}

function modal_close(){
    document.getElementById('modal').style.display='none';
}

function update_attribute(target){
    document.getElementById('street-info__Roadway').innerText = (target['roadway_type']!=='-1')?target['roadway_type']:'-';
    document.getElementById('street-info__Speed').innerText = (target['posted_speed']!=='-1')?target['posted_speed']:'-';
    document.getElementById('street-info__Width').innerText = (target['street_width']!=='-1.0')?target['street_width']:'-';
    document.getElementById('street-info__Total').innerText = (target['number_total']!=='-1')?target['number_total']:'-';
}

function update_attribute_511(target){
    document.getElementById('511-info__Crash').innerText = (target['crash_count_900ft']!=='-1')?target['crash_count_900ft']:'-';
    document.getElementById('511-info__CreateTime').innerText = (target['create_time']!=='-1')?target['create_time']:'-';
    document.getElementById('511-info__CloseTime').innerText = (target['close_time']!=='-1.0')?target['close_time']:'-';
    document.getElementById('511-info__Duration').innerText = (target['duration']!=='-1')?Math.round(target['duration']*100)/100:'-';
    document.getElementById('511-info__PeakDuration').innerText = (target['peak_duration']!=='-1')?Math.round(target['peak_duration']*100)/100:'-';
    console.log(target['roadway_type']);
    document.getElementById('511-info__Roadway').innerText = (target['roadway_type']!=='-1.0')?target['roadway_type']:'-';
    document.getElementById('511-info__Speed').innerText = (target['posted_speed']!=='-1')?target['posted_speed']:'-';
    document.getElementById('511-info__Width').innerText = (target['street_width']!=='-1')?target['street_width']:'-';
    document.getElementById('511-info__Total').innerText = (target['number_total_lane']!=='-1')?target['number_total_lane']:'-';
}

function monthlyCrashChart(target){
    if(store['monthlyChart']!==undefined){
        store['monthlyChart'].data.datasets[0].data = target;
        store['monthlyChart'].update();
    }
    else{
        const canvas = document.getElementById('chart_month').getContext('2d');
        const data = {
            // Labels should be Date objects
            labels: store['monthArray'],
            datasets: [{
                fill: false,
                label: "# of Crashes",
                data: target,
                borderColor: '#2979FF',
                backgroundColor: '#2979FF',
                lineTension: 0,
            }]
        };
        const options = {
            type: 'line',
            data: data,
            options: {
                legend: {
                    display: false
                },
                fill: false,
                responsive: true,
                maintainAspectRatio: false,
                tooltips: {
                    callbacks: {
                        title: function(tooltipItems, data) {
                            return data.labels[tooltipItems[0].index].toLocaleString('default', { month: 'short', year:'numeric' });
                        }
                    }
                    },
                scales: {
                    xAxes: [{
                        type: "time",
                        time: {
                            unit: 'month',
                            displayFormats: {
                                'day': 'MMM DD'
                            }},
                        display: true,
                        scaleLabel: {
                            display: false,
                            labelString: "Month",
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                        },
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: "# of Crashes",
                        }
                    }]
                }
            }
        };
        store['monthlyChart'] = new Chart(canvas, options);
    }
}

function hourlyCrashChart(target){
    if(store['hourlyChart']!==undefined){
        store['hourlyChart'].data.datasets[0].data = target;
        store['hourlyChart'].update();
    }
    else{
        const canvas = document.getElementById('chart_hour').getContext('2d');
        const data = {
            // Labels should be Date objects
            labels: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
            datasets: [{
                fill: false,
                label: "# of Crashes",
                data: target,
                borderColor: '#969696',
                backgroundColor: '#969696',
                hoverBackgroundColor:  '#2979FF',
                hoverBorderColor:  '#2979FF',
                lineTension: 0,
            }]
        };

        const options = {
            type: 'bar',
            data: data,
            options: {
                legend: {
                    display: false
                },
                fill: false,
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    xAxes:[{
                        maxRotation: 0
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                        },
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: "# of Crashes",
                        }
                    }]
                }
            }
        };

        store['hourlyChart'] = new Chart(canvas, options);
    }
}

function hourlyInjuredChart(target){
    if(store['hourlyInjuredChart']!==undefined){
        store['hourlyInjuredChart'].data.datasets[0].data = JSON.parse(target['number_of_injured']);
        store['hourlyInjuredChart'].data.datasets[1].data = JSON.parse(target['number_of_killed']);
        store['hourlyInjuredChart'].update();
    }
    else{
        const canvas = document.getElementById('chart_injured').getContext('2d');
        const data = {
            // Labels should be Date objects
            labels: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
            datasets: [{
                fill: false,
                label: "injured",
                data: JSON.parse(target['number_of_injured']),
                borderColor: '#969696',
                backgroundColor: '#969696',
                lineTension: 0,
            },
            {
                fill: false,
                label: "killed",
                data: JSON.parse(target['number_of_killed']),
                borderColor: '#2979FF',
                backgroundColor: '#2979FF',
                lineTension: 0,
            }]
        };

        const options = {
            type: 'bar',
            data: data,
            options: {
                legend: {
                    display: true
                },
                fill: false,
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    xAxes: [{ stacked: true }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                        },
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: "# of People",
                        },
                        stacked:true
                    }]
                }
            }
        };
        store['hourlyInjuredChart'] = new Chart(canvas, options);
    }
}

function hourly511Chart(target){
    if(store['hourly511Chart']!==undefined){
        store['hourly511Chart'].data.datasets[0].data = target;
        store['hourly511Chart'].update();
    }
    else{
        const canvas = document.getElementById('511_hour').getContext('2d');
        const data = {
            // Labels should be Date objects
            labels: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
            datasets: [{
                fill: false,
                label: "# of Crashes",
                data: target,
                borderColor: '#969696',
                backgroundColor: '#969696',
                hoverBackgroundColor:  '#2979FF',
                hoverBorderColor:  '#2979FF',
                lineTension: 0,
            }]
        };

        const options = {
            type: 'bar',
            data: data,
            options: {
                legend: {
                    display: false
                },
                fill: false,
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    xAxes:[{
                        maxRotation: 0
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                        },
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: "# of Crashes",
                        }
                    }]
                }
            }
        };

        store['hourly511Chart'] = new Chart(canvas, options);
    }
}

function clusteringBarChart(){
        const canvas = document.getElementById('511_clusters').getContext('2d');
        const data = {
            // Labels should be Date objects
            labels: ['Type 1', 'Type 2', 'Type 3', 'Type 4', 'Type 5', 'Type 6'],
            datasets: [{
                fill: false,
                label: "Probability or vehicle collision",
                data: [50,40,30,20,40,30],
                borderColor: ["#F44336", "#2196F3","#4CAF50","#FFC107","#673AB7", "#795548"],
                backgroundColor: ["#F44336", "#2196F3","#4CAF50","#FFC107","#673AB7", "#795548"],
                lineTension: 0,
            }]
        };

        const options = {
            type: 'bar',
            data: data,
            options: {
                legend: {
                    display: false
                },
                fill: false,
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    xAxes:[{
                        maxRotation: 0
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            max:100
                        },
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: "Probability (%)",
                        }
                    }]
                }
            }
        };

        new Chart(canvas, options);

}