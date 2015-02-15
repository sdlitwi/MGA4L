	var csvDocumentPath = "data/Progress Summary by Team.csv";

	//CSV Header Names
	var teamNameColumn = "TeamName1";
	var teamActivityPoints = "Textbox161";
	var teamActivityPointsGoal = "Textbox172";

    var standingsContext = {};

	var teamStandingsChart = {};
	var goalPieChart = {}

	var csvData = {};

    //get canvas element contexts
    function getCanvasContexts(){
        standingsContext = document.getElementById("jumbotron_chart").getContext("2d");
    }

    function getCsvDocumentData(csvDocumentPath){
    	Papa.parse(csvDocumentPath, {
    	                download: true,
    	                header: true,
                      	complete: function(results) {
                      		csvData = results.data;
                      		console.log(csvData);
                      	}
                      });
    }

    function getTeamNames(){

    }

	//team standings bar chart data
    var teamStandingsData = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
                label: "Team Standings",//get team names
                fillColor: "rgba(159, 207, 103,0.5)",
                strokeColor: "rgba(159, 207, 103,0.8)",
                highlightFill: "rgba(159, 207, 103,0.75)",
                highlightStroke: "rgba(159, 207, 103,1)",
                data: [65, 59, 80, 81, 56, 55, 40]//get team activity minutes
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

	setChartSize();
	});
