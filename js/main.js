	var csvDocumentPath = "data/Progress Summary by Team.csv";

    var standingsContext = {};

	var teamStandingsChart = {};
	var goalPieChart = {}
	
	var csvData = {};
	var teamNames = [];
	var teamActivity = [];

    function getCanvasContexts(){
        standingsContext = document.getElementById("jumbotron_chart").getContext("2d");
    }

	//load activity data from csv file
    function getCsvDocumentData(csvDocumentPath){
    	Papa.parse(csvDocumentPath, {
    	                download: true,
    	                header: true,
			skipEmptyLines: true,
                      	complete: function(results) {
                      		csvData = results.data;
                      		csvData.forEach(fillChartArrays);
							setChartSize();
                      	}
                      });
    }

    function fillChartArrays(element, index, array) {
        teamNames.push(element.TeamName1);
		teamActivity.push(parseInt(element.Textbox161.replace(/,/g,'')));
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

	//set chart size based on container
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

	//load activity data
    getCsvDocumentData(csvDocumentPath);

    //set up charts on document load
	$(function() {
		getCanvasContexts();
		teamStandingsChart = new Chart(standingsContext).Bar(teamStandingsData);
	});

