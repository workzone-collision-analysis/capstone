const store = {};

Promise.all([
    d3.csv('src/data/shared_street_with_attribute.csv'),
    d3.csv('src/data/month_array.csv'),
    d3.csv('src/data/crash_short_segment_monthly.csv'),
    d3.csv('src/data/crash_node_monthly.csv'),
    d3.csv('src/data/crash_segment_monthly.csv'),
    d3.csv('src/data/crash_short_segment_hourly.csv'),
    d3.csv('src/data/crash_node_hourly.csv'),
    d3.csv('src/data/crash_segment_hourly.csv'),
    d3.csv('src/data/crash_short_segment_hourly_injured.csv'),
]).then(([segment, monthlyArray, monthlyCrashShort, monthlyCrashNode, monthlyCrashSegment,
          hourlyCrashShort, hourlyCrashNode, hourlyCrashSegment, hourlyInjuredShort]) => {
    store['segment_attribute'] = segment;
    store['monthArray'] = monthlyArray.map(d=>d3.timeParse('%Y-%m-%d')(d['0']));
    store['monthlyCrashShort'] = monthlyCrashShort;
    store['monthlyCrashNode'] = monthlyCrashNode;
    store['monthlyCrashSegment'] = monthlyCrashSegment;
    store['hourlyCrashShort'] = hourlyCrashShort;
    store['hourlyCrashNode'] = hourlyCrashNode;
    store['hourlyCrashSegment'] = hourlyCrashSegment;
    store['hourlyInjured'] = hourlyInjuredShort;
});

function update_attribute(target){
    document.getElementById('street-info__Roadway').innerText = (target['roadway_type']!=='-1')?target['roadway_type']:'-';
    document.getElementById('street-info__Speed').innerText = (target['posted_speed']!=='-1')?target['posted_speed']:'-';
    document.getElementById('street-info__Width').innerText = (target['street_width']!=='-1.0')?target['street_width']:'-';
    document.getElementById('street-info__Total').innerText = (target['number_total']!=='-1')?target['number_total']:'-';
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
        store['hourlyInjuredChart'].data.datasets[0].data = target.map(d=>+d['number_of_injured']);
        store['hourlyInjuredChart'].data.datasets[1].data = target.map(d=>+d['number_of_killed']);
        store['hourlyInjuredChart'].update();
    }
    else{
        const canvas = document.getElementById('chart_injured').getContext('2d');
        const data = {
            // Labels should be Date objects
            labels: target.map(d=>d.hour),
            datasets: [{
                fill: false,
                label: "# of injured",
                data: target.map(d=>+d['number_of_injured']),
                borderColor: '#969696',
                backgroundColor: '#969696',
                lineTension: 0,
            },
            {
                fill: false,
                label: "# of killed",
                data: target.map(d=>+d['number_of_killed']),
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