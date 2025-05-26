import React, {useEffect} from 'react';
import { Panel, PanelHeader, PanelBody, PanelFooter } from './../../../../components/panel/panel.jsx';
import Chart from 'chart.js/auto';
import ApexChart from 'react-apexcharts';
const GraficosItem = () => {
	var chart1;
    function renderChart() {
		var teal = (getComputedStyle(document.body).getPropertyValue('--bs-teal')).trim();
		var tealRgb = (getComputedStyle(document.body).getPropertyValue('--bs-teal-rgb')).trim();
		var blue = (getComputedStyle(document.body).getPropertyValue('--bs-blue')).trim();
		var blueRgb = (getComputedStyle(document.body).getPropertyValue('--bs-blue-rgb')).trim();
		var componentBg = (getComputedStyle(document.body).getPropertyValue('--bs-component-bg')).trim();
		
		var bodyFontFamily = (getComputedStyle(document.body).getPropertyValue('--bs-body-font-family')).trim();
		var bodyFontWeight = (getComputedStyle(document.body).getPropertyValue('--bs-body-font-weight')).trim();
		var bodyColor = (getComputedStyle(document.body).getPropertyValue('--bs-body-color')).trim();
		var borderColor = (getComputedStyle(document.body).getPropertyValue('--bs-border-color')).trim();
		
		Chart.defaults.font.family = bodyFontFamily;
		Chart.defaults.font.size = 12;
		Chart.defaults.color = bodyColor;
		Chart.defaults.borderColor = borderColor;
		Chart.defaults.plugins.legend.display = true;
		Chart.defaults.plugins.tooltip.padding = { left: 8, right: 12, top: 8, bottom: 8 };
		Chart.defaults.plugins.tooltip.cornerRadius = 8;
		Chart.defaults.plugins.tooltip.titleMarginBottom = 6;
		Chart.defaults.plugins.tooltip.titleFont.family = bodyFontFamily;
		Chart.defaults.plugins.tooltip.titleFont.weight = bodyFontWeight;
		Chart.defaults.plugins.tooltip.footerFont.family = bodyFontFamily;
		Chart.defaults.plugins.tooltip.displayColors = true;
		Chart.defaults.plugins.tooltip.boxPadding = 6;
		Chart.defaults.scale.grid.color = borderColor;
		Chart.defaults.scale.beginAtZero = true;
		Chart.defaults.maintainAspectRatio = false;
		
		var chart1Container = document.getElementById('chart-1');
		if (chart1) {
			chart1.destroy();
		}
		if (chart1Container) {
			chart1Container.innerHTML = '<canvas id="lineChart"></canvas>';
			chart1 = new Chart(document.getElementById('lineChart'), {
				type: 'line',
				data: {
					labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
					datasets: [{
						label: '----',
						fill: false,
						lineTension: 0.1,
						backgroundColor: 'rgba('+ tealRgb +', 0.25)',
						borderColor: teal,
						borderWidth: 2,
						pointBorderColor: teal,
						pointBackgroundColor: componentBg,
						pointBorderWidth: 2,
						pointHoverRadius: 5,
						pointHoverBackgroundColor: componentBg,
						pointHoverBorderColor: teal,
						pointHoverBorderWidth: 3,
						pointRadius: 3,
						pointHitRadius: 10,
						data: [65, 59, 80, 81, 56, 55, 40, 59, 76, 94, 77, 82]
					},{
						label: '---',
						fill: false,
						lineTension: 0.1,
						backgroundColor: 'rgba('+ blueRgb +', 0.25)',
						borderColor: blue,
						borderWidth: 2,
						pointBorderColor: blue,
						pointBackgroundColor: componentBg,
						pointBorderWidth: 2,
						pointHoverRadius: 5,
						pointHoverBackgroundColor: componentBg,
						pointHoverBorderColor: blue,
						pointHoverBorderWidth: 3,
						pointRadius: 3,
						pointHitRadius: 10,
						data: [25, 29, 40, 45, 16, 15, 20, 39, 26, 44, 57, 32]
					}]
				}
			});
		}
	}

    useEffect(() => {   
		renderChart();		
		document.addEventListener('theme-reload', () => {		
			renderChart();
		});
		
		// eslint-disable-next-line
	}, []);

    var redColor = (getComputedStyle(document.body).getPropertyValue('--bs-red')).trim();
	var orangeColor = (getComputedStyle(document.body).getPropertyValue('--bs-orange')).trim();
	var tealColor = (getComputedStyle(document.body).getPropertyValue('--bs-teal')).trim();
	var blueColor = (getComputedStyle(document.body).getPropertyValue('--bs-blue')).trim();
	var gray500Color = (getComputedStyle(document.body).getPropertyValue('--bs-gray-500')).trim();
	var componentColor = (getComputedStyle(document.body).getPropertyValue('--bs-component-color')).trim();

    var sparklineData = [{ data: [789, 880, 676, 200, 890, 677, 900] }];
	var sparklineData2 = [{ data: [789, 880, 676, 200, 890, 677, 900] }];
	var sparklineData3 = [{ data: [789, 880, 676, 200, 890, 677, 900] }];
	var sparklineData4 = [{ data: [789, 880, 676, 200, 890, 677, 900] }];
	var sparklineData5 = [{ data: [789, 880, 676, 200, 890, 677, 900] }];
	var sparklineData6 = [{ data: [789, 880, 676, 200, 890, 677, 900] }];

    var sparkLineOptions = {
		chart: { sparkline: { enabled: true } },
		stroke: { width: 2 },
		colors: [redColor]
	};
	var sparkLineOptions2 = {
		chart: { sparkline: { enabled: true } },
		stroke: { width: 2 },
		colors: [orangeColor]
	};
	var sparkLineOptions3 = {
		chart: { sparkline: { enabled: true } },
		stroke: { width: 2 },
		colors: [tealColor]
	};
	var sparkLineOptions4 = {
		chart: { sparkline: { enabled: true } },
		stroke: { width: 2 },
		colors: [blueColor]
	};
	var sparkLineOptions5 = {
		chart: { sparkline: { enabled: true } },
		stroke: { width: 2 },
		colors: [gray500Color]
	};
	var sparkLineOptions6 = {
		chart: { sparkline: { enabled: true } },
		stroke: { width: 2 },
		colors: [componentColor]
	};

    return (<>
        <div className="row">
            <div className="col-xl-8">
                <Panel>
                    <PanelHeader>Items (*******En desarrollo******)</PanelHeader>
                    <PanelBody>
                        <div id="chart-1" className="h-300px"></div>
                    </PanelBody>
                </Panel>
            </div>
            <div className="col-xl-4">
                <Panel>
						<PanelHeader>*******En desarrollo******</PanelHeader>
						<PanelBody className="p-0">
							<div className="table-responsive">
								<table className="table table-panel align-middle mb-0">
									<thead>
										<tr>	
											<th>--</th>
											<th>--</th>
											<th>--</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td><label className="badge bg-danger">Unique Visitor</label></td>
											<td>13,203 <span className="text-success"><i className="fa fa-arrow-up"></i></span></td>
											<td className="align-middle">
												<div className="w-100px my-n1">
													<ApexChart type="line" height="20" options={sparkLineOptions} series={sparklineData} />
												</div>
											</td>
										</tr>
										<tr>
											<td><label className="badge bg-warning">Bounce Rate</label></td>
											<td>28.2%</td>
											<td className="align-middle">
												<div className="w-100px my-n1">
													<ApexChart type="line" height="20" options={sparkLineOptions2} series={sparklineData2} />
												</div>
											</td>
										</tr>
										<tr>
											<td><label className="badge bg-success">Total Page Views</label></td>
											<td>1,230,030</td>
											<td className="align-middle">
												<div className="w-100px my-n1">
													<ApexChart type="line" height="20" options={sparkLineOptions3} series={sparklineData3} />
												</div>
											</td>
										</tr>
										<tr>
											<td><label className="badge bg-blue">Avg Time On Site</label></td>
											<td>00:03:45</td>
											<td className="align-middle">
												<div className="w-100px my-n1">
													<ApexChart type="line" height="20" options={sparkLineOptions4} series={sparklineData4} />
												</div>
											</td>
										</tr>
										<tr>
											<td><label className="badge bg-gray-500">% New Visits</label></td>
											<td>40.5%</td>
											<td className="align-middle">
												<div className="w-100px my-n1">
													<ApexChart type="line" height="20" options={sparkLineOptions5} series={sparklineData5} />
												</div>
											</td>
										</tr>
										<tr>
											<td><label className="badge bg-inverse">Return Visitors</label></td>
											<td>73.4%</td>
											<td className="align-middle">
												<div className="w-100px my-n1">
													<ApexChart type="line" height="20" options={sparkLineOptions6} series={sparklineData6} />
												</div>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</PanelBody>
					</Panel>	
            </div>
        </div>
    </>);
}

export default GraficosItem;