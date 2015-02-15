	var csvDocumentPath = "data/Progress Summary by Team.csv";

	//CSV Header Names
	var teamNameColumn = "TeamName1";
	var teamActivityPoints = "Textbox161";
	var teamActivityPointsGoal = "Textbox172";

    var standingsContext = {};

	var teamStandingsChart = {};
	var goalPieChart = {}

	var csvData = {};
	var teamNames = [];
	var teamActivity = [];

    //get canvas element contexts
    function getCanvasContexts(){
        standingsContext = document.getElementById("jumbotron_chart").getContext("2d");
    }

    function getCsvDocumentData(csvDocumentPath){
    	Papa.parse(csvDocumentPath, {
    	                download: true,
    	                header: true,
			skipEmptyLines: true,
                      	complete: function(results) {
                      		csvData = results.data;
                      		csvData.forEach(pushTeamName);
                      		csvData.forEach(pushTeamActivity);
							setChartSize();
                      	}
                      });
    }

    function pushTeamName(element, index, array) {
        teamNames.push(element.TeamName1);
    }

    function pushTeamActivity(element, index, array) {
        var stat = parseInt(element.Textbox161.replace(/,/g,''));
        teamActivity.push(stat);
    }

    function getTeamNames(){

    }

    //team standings bar chart data
    var teamStandingsData = {
        labels: teamNames,
        datasets: [
            {
                label: "Team Standings",
                fillColor: "rgba(159, 207, 103,0.5)",
                strokeColor: "rgba(159, 207, 103,0.8)",
                highlightFill: "rgba(159, 207, 103,0.75)",
                highlightStroke: "rgba(159, 207, 103,1)",
                data: teamActivity
            },
            ]
    };

    function setChartSize() {
    //initialize charts
    teamStandingsChart.destroy();

    //get new container dimensions
    var c = $('#jumbotron_chart');
        c.attr('width', jQuery("#jumbotron_container").width());
        c.attr('height', jQuery("#jumbotron_container").height());

    //redraw charts
    teamStandingsChart = new Chart(standingsContext).Bar(teamStandingsData);
    }

    //event handler for window resize
    $(window).resize(setChartSize);

    getCsvDocumentData(csvDocumentPath);

    //set up charts on load
	$(function() {
     getCanvasContexts();

	teamStandingsChart = new Chart(standingsContext).Bar(teamStandingsData);
	});

