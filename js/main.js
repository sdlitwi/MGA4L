var teamCSVDocumentPath = "data/Progress Summary by Team.csv";
var progressCSVDocumentPath = "data/Activity Trend.csv";

//settings
var chartNum = 1; //starting chart number
var chartTitles = ["Overall Team Standings", "Current Goal Achievement", "Total Activity Progress"]
var totalCharts = 3; //total number of charts (see getChartByChartNumber())
var rotationInterval = 30000 //interval to fade in/out

var chartContext = {};
var currentChart = {};

var teamNames = [];
var teamActivity = [];
var teamGoalActivity = [];
var teamWeeklyActivity = [0,0,0,0,0,0,0,0,0,0];

//load activity data from csv file
function getTeamCsvDocumentData(csvDocumentPath) {
    Papa.parse(csvDocumentPath, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
            var csvData = results.data;
            csvData.forEach(fillChartArrays);
        }
    });
}

function getTeamProgressCsvDocumentData(csvDocumentPath) {
    Papa.parse(csvDocumentPath, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
            var csvData = results.data;
            csvData.forEach(fillWeeklyActivity)
        }
    });
}

function fillChartArrays(element, index, array) {
    teamNames.push(element.TeamName1);
    teamActivity.push(parseInt(element.Textbox161.replace(/,/g, '')));
    teamGoalActivity.push(parseInt(element.Textbox172.replace(/,/g, '')));
}

function fillWeeklyActivity(element, index, array) {
    for (var i = 0; i < 10; i++) {
        if (parseInt(element.WeekNumber) - 1 == i)
            teamWeeklyActivity[i] += parseInt(element.SumOfTotalPlusBonusMinutes);
    }
}

function getTotalFromArray(array) {
    var total = 0;
    for (var i = 0; i < array.length; i++) {
        total += parseInt(array[i]);
    }
    return total;
}

function getPieData() {
    var pieData = [{
        value: getTotalFromArray(teamActivity),
        color: "#33a2ce",
        highlight: "#0093d0",
        label: "Total Logged Minutes"
    },
{
    value: getTotalFromArray(teamGoalActivity) - getTotalFromArray(teamActivity),
    color: "#efc031",
    highlight: "#edb100",
    label: "Goal Minutes Remaining"
}
    ];

    return pieData;
}

function getBarData() {
    //team standings bar chart data
    var barData = {
        labels: teamNames,
        datasets: [
            {
                label: chartTitles[0],
                fillColor: "rgba(159, 207, 103,0.5)",
                strokeColor: "rgba(159, 207, 103,0.8)",
                highlightFill: "rgba(159, 207, 103,0.75)",
                highlightStroke: "rgba(159, 207, 103,1)",
                data: teamActivity
            },
        ]
    };
    return barData;
}

function getLineData() {
    console.log(teamWeeklyActivity);
    var lineData = {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7", "Week 8", "Week 9", "Week 10"],
        datasets: [
            {
                label: chartTitles[2],
                fillColor: "rgba(0, 147, 208, 0.5)",
                strokeColor: "rgba(0, 147, 208, .8)",
                pointColor: "rgba(0, 147, 208, 1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: teamWeeklyActivity
            },
        ]
    };
    return lineData;
}

function cycleCharts() {
    fadeChart();
    if (chartNum >= totalCharts)
        chartNum = 1;
    else
        chartNum++;
}

function fadeChart() {
    $("#jumbotron_chart").fadeOut("slow", function () { });
    setTimeout(function () {
        setChart();
        $("#jumbotron_chart").fadeIn("slow", function () { });
    }, 1000)

}

function getChartByChartNumber(num) {
    var chart = {};
    switch (num) {
        case 1:
            chart = new Chart(chartContext).Bar(getBarData())
            break;
        case 2:
            chart = new Chart(chartContext).Pie(getPieData());
            break;
        case 3:
            chart = new Chart(chartContext).Line(getLineData());
    }
    return chart;
}

function setChart() {
    currentChart.destroy();
    document.getElementById('chartTitle').innerHTML = chartTitles[chartNum - 1];
    currentChart = getChartByChartNumber(chartNum);
}

//set chart size based on container
function setChartSize() {
    currentChart.destroy();
    setContainerSize();
    currentChart = getChartByChartNumber(chartNum);
}

function setContainerSize() {
    //get new container dimensions
    var c = $('#jumbotron_chart');
    c.attr('width', $("#jumbotron_container").width());
    c.attr('height', $("#jumbotron_container").height());
}

//event handler for window resize
$(window).resize(setChartSize);

//load activity data
getTeamCsvDocumentData(teamCSVDocumentPath);
getTeamProgressCsvDocumentData(progressCSVDocumentPath)

//set up charts on document load
$(function () {
    chartContext = document.getElementById("jumbotron_chart").getContext("2d");
    document.getElementById('chartTitle').innerHTML = chartTitles[chartNum - 1];
    setContainerSize();
    setTimeout(function(){currentChart = getChartByChartNumber(chartNum)},500);

    setInterval(function () {
        cycleCharts();
    }, rotationInterval);
});

