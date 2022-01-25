(function() {
	const JIRA_API = {

		async callJiraService(methodName, dataSend = null, method = "GET") {
			let url = `https://${window.location.hostname}/rest/api/2/${methodName}`;
			let response = await fetch(url, {
				method: method,
				body: method === "POST" ? JSON.stringify(dataSend) : undefined
			});
			return response.json();

			/*const requestUrl = workspaceBaseUrl + "/rest/BnzDevJiraService/" + methodName;
			const requestConfig: Terrasoft.AjaxProvider.RequestConfig = {
				url: requestUrl,
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/json"
				},
				method: "POST",
				jsonData: Ext.encode(dataSend),
				scope: window
			};
			return new Promise((resolve, reject) => {
				const callback: Terrasoft.AjaxProvider.RequestCallback = function(request, success, response) {
					if (!success && response.status === 502) {
						deleteAuthData();
						return reject("Не вдалось авторизуватись в JIRA");
					}
					let result: string | ReturnType | object = response.responseText;
					try { result = JSON.parse(result);  } catch (err) {  }
					try { result = JSON.parse(result as string); } catch (err) {}
					success ? resolve(result as ReturnType) : reject(result as object);
				}
				requestConfig.callback = callback;
				Terrasoft.AjaxProvider.request(requestConfig);
			});*/
		},
	
		getAuthData() {
			return sessionStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
		},
		
		isAuthenticate() {
			return Boolean(getAuthData());
		},
		
		/** Получить перечень последних проектов
		 * @param count количество проектов для загрузки
		 */
		getRecentProjects(count) {
			return this.callJiraService(`project?recent=${count}`);
		},
	
		/** Получить текущие версии в проекте (для поставки)
		 * @param projectKeyOrId ключ или id проекта
		 */
		getUnReleasedVersions(projectKeyOrId) {
			return this.callJiraService(`project/${projectKeyOrId}/versions`);
		},
	
		getProjectData(projectKeyOrId) {
			return this.callJiraService("GetProjectData", { projectKeyOrId });
		},
	
		/** Получить типы задач доступных для выбора в проекте
		 * @param projectKeyOrId ключ или id проекта
		 */
		getIssueTypes(projectKeyOrId) {
			return this.callJiraService("GetIssueTypes", { projectKeyOrId });
		},
	
		/** Создать задачу
		 * @param issue задача
		 */
		createIssue(issue) {
			return this.callJiraService("CreateIssue", { issue });
		},
	
		/** Поиск задач
		 * @param jql запрос
		 */
		async search(jql, expand) {
			let expandParam = (expand == null || expand.Length == 0) ? "" : `&expand=${expand.join(",")}`;
			return (await this.callJiraService(`search?jql=${jql}${expandParam}`)).issues;
		},
	
		/** Получить текущие задачи пользователя */
		getCurrentIssues() {
			return this.search('status in ("ToDo","In Progress") AND assignee = currentUser()',
				["renderedFields"]);
		},
	
		/** Получить перечень активных эпиков в проекту
		 * @param projectKeyOrId ключ или id проекта
		 */
		getActiveEpics(projectKeyOrId) {
			return this.search(`project = ${ projectKeyOrId} AND issuetype = Epic AND 'Epic Status' != Done`);
		},
	
		/** Получить активные спринты в проекте
		 * @param projectKeyOrId ключ или id проекта
		 */
		getActiveProjectSprints(projectKeyOrId) {
			return this.callJiraService("GetActiveProjectSprints", { projectKeyOrId });
		},
	
		/** Включить таску в спринт
		 * @param issueKey таска
		 * @param sprintId спринт
		 */
		includeIssueToSprint(issueKey, sprintId) {
			return this.callJiraService("IncludeIssueToSprint", { issueKey, sprintId });
		},
	
		/** Получить доступные состояния для перехода
		 * @param issueKey таска
		 */
		getTransitions(issueKey) {
			return this.callJiraService("GetTransitions", { issueKey });
		},
	
		/** Выполнить перевод таски в другое состояние
		 * @param issueKey таска
		 * @param transitionId переход
		 */
		doTransition(issueKey, transitionId) {
			return this.callJiraService("DoTransition", { issueKey, transitionId });
		},
	
		/** Конвертировать markup в HTML
		 * @param unrenderedMarkup текст для отрисовки
		 */
		render(unrenderedMarkup) {
			return this.callJiraService("Render", { unrenderedMarkup });
		},
	
	
	}
	class BaseFilterManager {

		/** @type {HTMLButtonElement} */
		_filterBtn = null;

		/** @type {HTMLSpanElement} */
		_clearFilterBtn = null;

		/** @type {HTMLDivElement} */
		_menuCnt = null;

		_items = [];

		FILTER_BUTTON_CAPTION = "FILTER";

		KEY_PREFIX = null;

		KEY_COLUMN = "key";

		filterIssue(issue) {
			if (this.getSelectedItems().length === 0) return true;
			return this.innerFilterIssue(issue);
		}

		innerFilterIssue(issue) {
			throw new Error("Not implemented")
		}

		addFilterButton() {
			let cnt = document.createElement("dd");
			this._filterBtn = document.createElement("button");
			this._filterBtn.classList.value = "tsi-jira-epics-filter-btn";
			this._filterBtn.innerText = this.FILTER_BUTTON_CAPTION;
			this._clearFilterBtn = document.createElement("span");
			this._clearFilterBtn.className = "aui-icon aui-icon-small aui-iconfont-remove";
			this._filterBtn.appendChild(this._clearFilterBtn)
			cnt.appendChild(this._filterBtn);
			let quickfilters = document.getElementById("js-work-quickfilters");
			quickfilters.insertBefore(cnt, quickfilters.firstChild.nextSibling);
		}

		getFilterdownContentId() {
			return `tsi-jira-${this.KEY_PREFIX}-filterdown-content`;
		}

		addMenuListCnt() {
			this._menuCnt = document.createElement("div");
			this._menuCnt.classList.value = "tsi-jira-epics-filterdown-content";
			this._menuCnt.id = this.getFilterdownContentId();
			this._items.forEach(item => {
				this.createItemDocEl(item);
				this._menuCnt.appendChild(item.domEl);
			});
			document.getElementsByTagName("body")[0].appendChild(this._menuCnt);
			this._filterBtn.onclick = this.onItemFilterClick.bind(this);
			this._clearFilterBtn.onclick = this.onClearItemFilterClick.bind(this);
			this._menuCnt.style.display = "none";
		}

		createItemDocEl(item) {
			item.domEl = document.createElement("span");
			item.domEl.innerText = this.getItemCaption(item);
			item.domEl.onclick = this.toggleItemFilter.bind(this, item);
		}

		getItemCaption() {
			return item[this.KEY_COLUMN];
		}


		toggleItemFilter(item) {
			this.setItemIsSelected(item, !item.isTsiSelected);
			this.saveSelectedItems();
			this.reloadSprintIssues();
		}
		
		setItemIsSelected(item, isSelected) {
			let activeFilterClass = "tsi-jira-epics-filterActive";
			item.isTsiSelected = Boolean(isSelected);
			this.saveSelectedItems();
			item.isTsiSelected ?
				item.domEl.classList.add(activeFilterClass) :
				item.domEl.classList.remove(activeFilterClass);
			this.updateItemFilterBtnStyle();
		}

		getStorageKey() {
			return `tsi-help-utils-selected-${this.KEY_PREFIX}-${window.GH.RapidBoard.projectKey}`;
		}

		saveSelectedItems() {
			window.localStorage.setItem(this.getStorageKey(), this.getSelectedItemsId());
		}

		updateItemFilterBtnStyle() {
			let activeFilterClass = "tsi-jira-epics-filterActive";
			var isAnyItemSelected = this.getSelectedItems().length > 0;
			var filterMenuIsShowed =  this._menuCnt.style.display === "block";
			var haveClass = this._filterBtn.classList.contains(activeFilterClass);
			if (isAnyItemSelected || filterMenuIsShowed) {
				!haveClass && this._filterBtn.classList.add(activeFilterClass);
			} else {
				haveClass && this._filterBtn.classList.remove(activeFilterClass);
			}
		}

		
		/** Получить перечень выбраных епиков */
		getSelectedItems() {
			return this._items.filter(item => item.isTsiSelected);
		}

		/** Получить перечень выбраных епиков
		 * @returns {Array<string>}
		 */
		getSelectedItemsId() {
			return this.getSelectedItems().map(item => item[this.KEY_COLUMN]);
		}

		handleDocumentClick() {
			const scope = this;
			let onClick = function() {
				let clickedInsidePage = !!(event.target.closest("#" + scope.getFilterdownContentId()));
				if (clickedInsidePage) {
					return;
				}
				document.removeEventListener("click", onClick);
				scope.onItemFilterClick.call(scope);
			};
			document.addEventListener("click", onClick);
		}

		onItemFilterClick() {
			if (!this._menuCnt) {
				return;
			}
			let btnClientRect = this._filterBtn.getBoundingClientRect();
			var top = btnClientRect.top + btnClientRect.height + "px";
			var left = btnClientRect.left + "px";
			var isDisplayed = this._menuCnt.style.display === "block"; 
			this._menuCnt.style.display = isDisplayed ? "none" : "block";
			this._menuCnt.style.top = top;
			this._menuCnt.style.left = left;
			this.updateItemFilterBtnStyle();
			isDisplayed || setTimeout(this.handleDocumentClick.bind(this), 0);
		}

		/**
		 * Загрузить список епиков
		 * @returns {Promise}
		 */
		loadItemsList() {
			throw new Error("Not implemented")
		}

		getProjectKey() {
			return window.GH.RapidBoard.projectKey;
		}
		
		updateIsSelectedFromStorage() {
			let selectedIds = this.getSelectedItems();
			selectedIds.forEach(selectedId => {
				let item = this._items.find(item => item[this.KEY_COLUMN] === selectedId);
				item && this.setItemIsSelected(item, true);
			}, this);
			if (selectedIds.length > 0) {
				this.reloadSprintIssues();
			}
		}

		/** @param {MouseEvent} event  */
		onClearItemFilterClick(event) {
			event.stopPropagation();
			this._items.map(item => this.setItemIsSelected(item, false));
			this.saveSelectedItems();
			this.reloadSprintIssues();
		}

		saveSelectedItems() {
			window.localStorage.setItem(this.getStorageKey(), this.getSelectedItemsId());
		}

		
		async initMenuListCnt() {
			await this.loadItemsList();
			this.addMenuListCnt();
			this.updateIsSelectedFromStorage();
		}

		async initFilter() {
			await this.loadItemsList();
			this.addFilterButton();
			this.initMenuListCnt();
		}
		reloadSprintIssues() {
			TsiJiraUtils.reloadSprintIssues();
		}

	}


	class EpicFilterManager extends BaseFilterManager {
		
		FILTER_BUTTON_CAPTION = "Epics";
		
		KEY_PREFIX = "epics";

		async loadItemsList(response) {
			let activeEpics = await JIRA_API.getActiveEpics(this.getProjectKey());
			this._items = activeEpics;
		}

		innerFilterIssue(issue) {
			return this.getSelectedItemsId().includes(issue.epic)
		}

		getItemCaption(item) {
			return item.fields.summary;
		}



	}

	class VersionsFilterManager extends BaseFilterManager {

		FILTER_BUTTON_CAPTION = "Versions";

		KEY_PREFIX = "versions";

		KEY_COLUMN = "id";

		async loadItemsList(response) {
			let verisons = await JIRA_API.getUnReleasedVersions(this.getProjectKey());
			this._items = verisons;
		}
		getItemCaption(item) {
			return item.name;
		}

		
		/**
		 * 
		 * @param {{fixVersions:Array<number>}} issue 
		 * @returns 
		 */
		innerFilterIssue(issue) {
			let selectedItems = this.getSelectedItemsId().map(item => item.toString());
			let issueVersions = issue.fixVersions.map(item => item.toString());
			return issueVersions.some(item => selectedItems.includes(item));
		}

	}


	/**
	 * @class
	 * Класс добавляюший плюшки в jira
	 */
	var TsiJiraUtils = {

		/** @type {EpicFilterManager} */
		_epicFilterManager: null,

		/** @type {VersionsFilterManager} */
		_versionsFilterManager: null,

		_lastIssuesList: null,
		_lastEtag: null,

		_overridenMethods: {},

		/** Инициализация */
		init() {
			this._epicFilterManager = new EpicFilterManager();
			this._versionsFilterManager = new VersionsFilterManager();
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
				this.addTasksFilterInput();
				this._epicFilterManager.initFilter();
				this._versionsFilterManager.initFilter();
			}
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
			arguments[0].issuesData.issues = TsiJiraUtils.filterIssues(arguments[0].issuesData.issues);
			TsiJiraUtils._overridenMethods.setPoolData.apply(window.GH.RapidBoard.State, arguments);
		},

		filterIssues(issues) {
			return issues.filter(issue => this.filterIssue(issue));
		},

		filterIssue(issue) {
			let inputFilter = (document.getElementById("tsi-jira-filter-input") || {}).value || "";
			return this._epicFilterManager.filterIssue(issue) &&
				this._versionsFilterManager.filterIssue(issue) &&
				this.filterByInput(issue, inputFilter);
		},


		filterByInput(issue, filterValue) {
			if (!filterValue) return true;
			let filter = issue => issue.summary.toLowerCase().includes(value.toLowerCase());
			if (value === "@flag") {
				filter = issue => issue.flagged;
			} else if (value === "@!flag") {
				filter = issue => !issue.flagged;
			}
			return filter(issue);
		},

		reloadSprintIssues() {
			window.GH.WorkController.reload();
		},

		addTasksFilterInput() {
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
};

TsiJiraUtils.init();
})();