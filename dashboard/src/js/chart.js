const store = {};

Promise.all([
    d3.csv('src/data/shared_street_with_attribute.csv'),
    d3.csv('src/data/crash_short_segment_monthly.csv'),
    d3.csv('src/data/crash_short_segment_hourly.csv'),

]).then(([segment, monthlyCrash, houlyCrash]) => {
    store['segment_attribute'] = segment;
    store['monthlyCrash'] = monthlyCrash.map(d=>{
        d.month = d3.timeParse('%Y-%m-%d')(d.month);
        return d;
    });
    store['hourlyCrash'] = houlyCrash;
});

function update_attribute(target){
    document.getElementById('street-info__Roadway').innerText = target['roadway_type'];
    document.getElementById('street-info__Speed').innerText = target['posted_speed'];
    document.getElementById('street-info__Width').innerText = target['street_width'];
    document.getElementById('street-info__Total').innerText = target['number_total'];
    document.getElementById('street-info__Travel').innerText = target['number_travel'];
    document.getElementById('street-info__Park').innerText = target['number_park'];
}

function monthlyCrashChart(target){
    if(store['monthlyChart']!==undefined){
        store['monthlyChart'].data.datasets[0].data = target.map(d=>+d.count);
        store['monthlyChart'].update();
    }
    else{
        const canvas = document.getElementById('chart_month').getContext('2d');
        const data = {
            // Labels should be Date objects
            labels: target.map(d=>d.month),
            datasets: [{
                fill: false,
                label: "# of Crashes",
                data: target.map(d=>+d.count),
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
        store['hourlyChart'].data.datasets[0].data = target.map(d=>+d.count);
        store['hourlyChart'].update();
    }
    else{
        const canvas = document.getElementById('chart_hour').getContext('2d');
        const data = {
            // Labels should be Date objects
            labels: target.map(d=>d.hour),
            datasets: [{
                fill: false,
                label: "# of Crashes",
                data: target.map(d=>+d.count),
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