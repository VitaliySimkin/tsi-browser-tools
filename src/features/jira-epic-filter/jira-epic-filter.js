(function() {
	/**
	 * @class
	 * Класс добавляюший плюшки в jira
	 */
	var TsiJiraUtils = {
		_epicFilterBtn: null,
		_clearEpicFilterBtn: null,
		_epicsMenuCnt: null,
		_lastIssuesList: null,
		_lastEtag: null,
		_epicsFilterStyle: ``,

		_overridenMethods: {},
		_epics: [],

		/** Инициализация */
		init() {
			this.overrideSetPoolData();
			this.overrideInitializeWorkMode();
			this.initFilter();
		},

		overrideInitializeWorkMode() {
			if (!Boolean(GH && GH.WorkController && GH.WorkController.initializeWorkMode)) return
			let baseInitializeWorkMode = GH.WorkController.initializeWorkMode;
			GH.WorkController.initializeWorkMode = function() {
				let res = baseInitializeWorkMode.apply(GH.WorkController, arguments);
				TsiJiraUtils.initFilter();
				return res;
			}
		},

		initFilter() {
			if (document.getElementById("js-work-quickfilters")) {
				this.loadEpicList();
				this.addEpicFilterInput();
				this.addEpicFilterButton();
				this.initEpicMenuListCnt();
			}
		},

		/**
		 * Загрузить список епиков
		 * @param {Function} callback callback
		 * @param {Object} scope callback scope
		 */
		loadEpicList(callback, scope) {
			// #TODO #BUG Грузится вся информация по backlog. Нужно придумать как загружать только перечень епиков
			var u = {
				url: "/xboard/plan/backlog/data.json",
				data: {
					rapidViewId: window.GH.RapidBoard.State.data.rapidViewId,
					selectedProjectKey: window.GH.RapidBoard.projectKey
				}
			};
			window.GH.Ajax.get(u, "backlogDataModel").done(function(response) {
				TsiJiraUtils._epics = response.epicData.epics.filter(epic => !epic.hidden);
				callback && callback.call(scope, TsiJiraUtils._epics);
			});
		},

		/** Получить перечень выбраных епиков */
		getSelectedEpics() {
			return this._epics.filter(epic => epic.isTsiSelected);
		},

		/** Получить перечень выбраных епиков */
		getSelectedEpicsId() {
			return this.getSelectedEpics().map(epic => epic.key);
		},

		overrideSetPoolData() {
			try {
				this._overridenMethods.setPoolData = window.GH.WorkController.setPoolData;
				window.GH.WorkController.setPoolData = this.setPoolData;
			} catch(err) {}
		},

		setPoolData() {
			if (TsiJiraUtils._lastEtag === arguments[0].etagData.etag) {
				arguments[0].issuesData.issues = TsiJiraUtils._lastIssuesList;
			} else {
				TsiJiraUtils._lastEtag = arguments[0].etagData.etag;
				TsiJiraUtils._lastIssuesList = arguments[0].issuesData.issues;
			}
			if (TsiJiraUtils.getSelectedEpicsId().length > 0) {
				arguments[0].issuesData.issues = arguments[0].issuesData.issues.filter(
					issue => TsiJiraUtils.getSelectedEpicsId().includes(issue.epic));
			}
			TsiJiraUtils.filterByInput(arguments[0]);
			TsiJiraUtils._overridenMethods.setPoolData.apply(window.GH.RapidBoard.State, arguments);
		},

		reloadSprintIssues() {
			window.GH.WorkController.reload();
		},

		toggleEpicFilter(epic) {
			this.setEpicIsSelected(epic, !epic.isTsiSelected);
			this.saveSelectedEpics();
			this.reloadSprintIssues();
		},

		setEpicIsSelected(epic, isSelected) {
			let activeFilterClass = "tsi-jira-epics-filterActive";
			epic.isTsiSelected = Boolean(isSelected);
			this.saveSelectedEpics();
			epic.isTsiSelected ?
				epic.domEl.classList.add(activeFilterClass) :
				epic.domEl.classList.remove(activeFilterClass);
			this.updateEpicFilterBtnStyle();
		},

		getStorageKey() {
			return `tsi-help-utils-selected-epics-${window.GH.RapidBoard.projectKey}`;
		},

		saveSelectedEpics() {
			window.localStorage.setItem(this.getStorageKey(), this.getSelectedEpicsId());
		},

		loadSelectedEpics() {
			return (window.localStorage.getItem(this.getStorageKey()) || "").split(",");
		},

		addEpicFilterButton() {
			var epicCnt = document.createElement("dd");
			this._epicFilterBtn = document.createElement("button");
			this._epicFilterBtn.classList.value = "tsi-jira-epics-filter-btn";
			this._epicFilterBtn.innerText = "Epics";
			this._clearEpicFilterBtn = document.createElement("span");
			this._clearEpicFilterBtn.className = "aui-icon aui-icon-small aui-iconfont-remove";
			this._epicFilterBtn.appendChild(this._clearEpicFilterBtn)
			epicCnt.appendChild(this._epicFilterBtn);
			let quickfilters = document.getElementById("js-work-quickfilters");
			quickfilters.insertBefore(epicCnt, quickfilters.firstChild.nextSibling);
		},

		initEpicMenuListCnt() {
			this.loadEpicList(function() {
				this.addEpicMenuListCnt();
				this.updateIsSelectedFromStorage();
			}, this);
		},

		updateIsSelectedFromStorage() {
			let selectedIds = this.loadSelectedEpics();
			selectedIds.forEach(selectedId => {
				let epic = this._epics.find(item => item.key === selectedId);
				epic && this.setEpicIsSelected(epic, true);
			}, this);
			if (selectedIds.length > 0) {
				this.reloadSprintIssues();
			}
		},

		addEpicMenuListCnt() {
			this._epicsMenuCnt = document.createElement("div");
			this._epicsMenuCnt.classList.value = "tsi-jira-epics-filterdown-content";
			this._epicsMenuCnt.id = "tsi-jira-epics-filterdown-content";
			this._epics.forEach(epic => {
				this.createEpicDocEl(epic);
				this._epicsMenuCnt.appendChild(epic.domEl);
			});
			document.getElementsByTagName("body")[0].appendChild(this._epicsMenuCnt);
			this._epicFilterBtn.onclick = this.onEpicFilterClick;
			this._clearEpicFilterBtn.onclick = this.onClearEpicFilterClick;
			this._epicsMenuCnt.style.display = "none";
		},

		createEpicDocEl(epic) {
			epic.domEl = document.createElement("span");
			epic.domEl.innerText = epic.summary;
			epic.domEl.onclick = this.toggleEpicFilter.bind(this, epic);
		},

		updateEpicFilterBtnStyle() {
			let activeFilterClass = "tsi-jira-epics-filterActive";
			var isAnyEpicSelected = this.getSelectedEpics().length > 0;
			var filterMenuIsShowed =  TsiJiraUtils._epicsMenuCnt.style.display === "block";
			var haveClass = this._epicFilterBtn.classList.contains(activeFilterClass);
			if (isAnyEpicSelected || filterMenuIsShowed) {
				!haveClass && this._epicFilterBtn.classList.add(activeFilterClass);
			} else {
				haveClass && this._epicFilterBtn.classList.remove(activeFilterClass);
			}
		},

		onEpicFilterClick() {
			if (!TsiJiraUtils._epicsMenuCnt) {
				return;
			}
			let btnClientRect = TsiJiraUtils._epicFilterBtn.getBoundingClientRect();
			var top = btnClientRect.top + btnClientRect.height + "px";
			var left = btnClientRect.left + "px";
			var isDisplayed = TsiJiraUtils._epicsMenuCnt.style.display === "block"; 
			TsiJiraUtils._epicsMenuCnt.style.display = isDisplayed ? "none" : "block";
			TsiJiraUtils._epicsMenuCnt.style.top = top;
			TsiJiraUtils._epicsMenuCnt.style.left = left;
			TsiJiraUtils.updateEpicFilterBtnStyle();
			isDisplayed || setTimeout(TsiJiraUtils.handleDocumentClick, 0);
		},

		/**
		 * 
		 * @param {MouseEvent} event 
		 */
		onClearEpicFilterClick(event) {
			event.stopPropagation();
			TsiJiraUtils._epics.map(epic => TsiJiraUtils.setEpicIsSelected(epic, false));
			TsiJiraUtils.saveSelectedEpics();
			TsiJiraUtils.reloadSprintIssues();
		},

		handleDocumentClick() {
			let onClick = function() {
				let clickedInsidePage = !!(event.target.closest("#tsi-jira-epics-filterdown-content"));
				if (clickedInsidePage) {
					return;
				}
				document.removeEventListener("click", onClick);
				TsiJiraUtils.onEpicFilterClick.call(TsiJiraUtils);
			};
			document.addEventListener("click", onClick);
		},

		addEpicFilterInput() {
			let filterDD = document.createElement("dd");
			let filterCnt = document.createElement("div");
			filterCnt.className = "tsi-jira-filter-cnt";
			let input = document.createElement("input");
			TsiJiraUtils.addInputListeners(input);
			input.id = "tsi-jira-filter-input";
			input.placeholder = "Пошук...";
			filterCnt.appendChild(input);
			filterDD.appendChild(filterCnt);
			let quickfilters = document.getElementById("js-work-quickfilters");
			quickfilters.insertBefore(filterDD, quickfilters.firstChild.nextSibling);
		},
		addInputListeners(input) {
			input.addEventListener("keyup", (event) => {
				if (event.keyCode === 13) {
					event.preventDefault();
					TsiJiraUtils.reloadSprintIssues();
				}
			});
		},


		filterByInput({issuesData}) {
			/** @type string */
			let value = (document.getElementById("tsi-jira-filter-input") || {}).value || "";
			if (!value) {
				return;
			}
			let filter = issue => issue.summary.toLowerCase().includes(value.toLowerCase());
			if (value === "@flag") {
				filter = issue => issue.flagged;
			} else if (value === "@!flag") {
				filter = issue => !issue.flagged;
			}
			issuesData.issues = issuesData.issues.filter(filter);
		}
};

TsiJiraUtils.init();
})();