import React, { useContext, useState } from 'react';
import { AppSettings } from './../../config/app-settings.js';

function ThemePanel() {
	const context = useContext(AppSettings);
	const [expand, setExpand] = useState(false);
	const [theme, setTheme] = useState((localStorage && typeof localStorage.appTheme !== 'undefined') ?  localStorage.appTheme : 'blue');
	const themeList = ['red','pink','orange','yellow','lime','green','teal','cyan','blue','purple','indigo','dark'];
	function handleDarkMode(e) {
		if (e.target.checked) {
			context.handleSetAppDarkMode(true);					
		} else {
			context.handleSetAppDarkMode(false);		
		}
	}
	
	// function handleHeaderFixed(e) {
	// 	if (e.target.checked) {
	// 		context.handleSetAppHeaderFixed(true);
	// 	} else {
	// 		context.handleSetAppHeaderFixed(false);
	// 	}
	// }
	
	function handleSidebarFixed(e) {
		if (e.target.checked) {
			context.handleSetAppSidebarFixed(true);
		} else {
			context.handleSetAppSidebarFixed(false);
		}
	}
	
	function handleHeaderInverse(e) {
		if (e.target.checked) {
			context.handleSetAppHeaderInverse(true);
		} else {
			context.handleSetAppHeaderInverse(false);
		}
	}
	
	function handleSidebarGrid(e) {
		if (e.target.checked) {
			context.handleSetAppSidebarGrid(true);
		} else {
			context.handleSetAppSidebarGrid(false);
		}
	}
	
	function handleGradientEnabled(e) {
		if (e.target.checked) {
			context.handleSetAppGradientEnabled(true);
		} else {
			context.handleSetAppGradientEnabled(false);
		}
	}
	
	function toggleExpand(e) {
		e.preventDefault();
		setExpand(!expand);
	}
	
	function toggleTheme(e, theme) {
		e.preventDefault();
		context.handleSetAppTheme(theme);
		setTheme(theme);
	}
	
	return (
		<AppSettings.Consumer>
			{({appDarkMode, appHeaderFixed, appHeaderInverse, appSidebarFixed, appSidebarGrid, appGradientEnabled}) => (
				<div className={'theme-panel ' + (expand ? 'active' : '')}>
					<a href="#0" onClick={ e => toggleExpand(e) } className="theme-collapse-btn"><i className="fa fa-cog"></i></a>
					<div className="theme-panel-content" data-scrollbar="true" data-height="100%">
						<h5>Personalizar Interfaz</h5>
			
						<div className="theme-list">
							{themeList.map((themeListItem, i) => (
								<div key={i} className={'theme-list-item '+ ((themeListItem === theme) ? 'active' : '')}>
									<a href="#0" onClick={ e => toggleTheme(e, themeListItem) } className={'theme-list-link bg-'+ themeListItem}>&nbsp;</a>
								</div>
							))}
						</div>
			
						<div className="theme-panel-divider"></div>
			
						<div className="row mt-10px">
							<div className="col-8 control-label text-dark fw-bold">
								<div>Modo oscuro </div>
								<div className="lh-14">
									<small className="text-dark opacity-50">
										Ajuste la apariencia para reducir el resplandor y darle un descanso a sus ojos.
									</small>
								</div>
							</div>
							<div className="col-4 d-flex">
								<div className="form-check form-switch ms-auto mb-0">
									<input type="checkbox" className="form-check-input" name="app-theme-dark-mode" onChange={handleDarkMode} id="appThemeDarkMode" checked={appDarkMode} value="1" />
									<label className="form-check-label" htmlFor="appThemeDarkMode">&nbsp; </label>
								</div>
							</div>
						</div>
			
						<div className="theme-panel-divider"></div>
			
						{/* <div className="row mt-10px align-items-center">
							<div className="col-8 control-label text-dark fw-bold">Header Fixed</div>
							<div className="col-4 d-flex">
								<div className="form-check form-switch ms-auto mb-0">
									<input type="checkbox" className="form-check-input" name="app-header-fixed" onChange={handleHeaderFixed} id="appHeaderFixed" value="1" checked={appHeaderFixed} />
									<label className="form-check-label" htmlFor="appHeaderFixed">&nbsp;</label>
								</div>
							</div>
						</div> */}
						<div className="row mt-10px align-items-center">
							<div className="col-8 control-label text-dark fw-bold">Encabezado oscuro</div>
							<div className="col-4 d-flex">
								<div className="form-check form-switch ms-auto mb-0">
									<input type="checkbox" className="form-check-input" name="app-header-inverse" onChange={handleHeaderInverse} id="appHeaderInverse" checked={appHeaderInverse} />
									<label className="form-check-label" htmlFor="appHeaderInverse">&nbsp;</label>
								</div>
							</div>
						</div>
						{/* <div className="row mt-10px align-items-center">
							<div className="col-8 control-label text-dark fw-bold">Sidebar Fixed</div>
							<div className="col-4 d-flex">
								<div className="form-check form-switch ms-auto mb-0">
									<input type="checkbox" className="form-check-input" name="app-sidebar-fixed" onChange={handleSidebarFixed} id="appSidebarFixed" checked={appSidebarFixed} />
									<label className="form-check-label" htmlFor="appSidebarFixed">&nbsp;</label>
								</div>
							</div>
						</div> */}
						<div className="row mt-10px align-items-center">
							<div className="col-8 control-label text-dark fw-bold">Rejilla lateral</div>
							<div className="col-4 d-flex">
								<div className="form-check form-switch ms-auto mb-0">
									<input type="checkbox" className="form-check-input" onChange={handleSidebarGrid} name="app-sidebar-grid" id="appSidebarGrid" checked={appSidebarGrid} />
									<label className="form-check-label" htmlFor="appSidebarGrid">&nbsp;</label>
								</div>
							</div>
						</div>
						{/* <div className="row mt-10px align-items-center">
							<div className="col-md-8 control-label text-dark fw-bold">Gradient Enabled</div>
							<div className="col-md-4 d-flex">
								<div className="form-check form-switch ms-auto mb-0">
									<input type="checkbox" className="form-check-input" name="app-gradient-enabled" onChange={handleGradientEnabled} id="appGradientEnabled" checked={appGradientEnabled} />
									<label className="form-check-label" htmlFor="appGradientEnabled">&nbsp;</label>
								</div>
							</div>
						</div> */}
			
						<div className="theme-panel-divider"></div>

						
					</div>
				</div>
			)}
		</AppSettings.Consumer>
	);
};

export default ThemePanel;
