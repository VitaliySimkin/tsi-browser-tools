var ext_url;

function getImagePath(imageFileName, isUrl) {
	var path = "chrome-extension://ihdfibhbifbonbiknkhaealcmgedoegd/features/work-shortcuts/images/" + imageFileName;
	return isUrl ? "url('" + path + "')" : path;
	
}

function initActivityShortcuts() {
	require(["ConfigurationConstants", "TagUtilitiesV2"], function(ConfigurationConstants) {

		var model = {

			viewModel: null,

			copiedTaskId: null,

			maskId: null,

			schedulerSelector: ".scheduler-area",

			selectionSelector: ".scheduler-area .schedule-edit-selection",

			selectedItemSelector: ".scheduler-area .scheduleritem-selected",

			filterPeriodSelector: ".filter-inner-container.fixed-filter-element-container-wrap" +
				".fixed-period-filter-element-container-wrap",

			chatRooms: {
				1: {
					value: "768aa9e5-2a11-4700-b1fe-97bd58002569",
					displayValue: "Переговорная 1"
				},
				2: {
					value: "f5c842fe-5ba5-42b9-bc5b-f6c884868a6e",
					displayValue: "Переговорная 2"
				},
				3: {
					value: "072411e2-dcfe-4748-9f64-a6f77810fcc0",
					displayValue: "Переговорная 3"
				},
				4: {
					value: "bd6106fa-a579-414f-91f0-5ee3227dd011",
					displayValue: "Переговорная 4"
				},
				5: {
					value: "682f0383-69c4-43d5-b657-9856070a1f75",
					displayValue: "Переговорная 5"
				},
				6: {
					value: "9784d8e4-f7c0-42a4-8a59-fc9b058d1ecf",
					displayValue: "Переговорная 6"
				},
				7: {
					value: "62c89bad-f9b4-483d-b87e-84a74be23c5a",
					displayValue: "Переговорная 7"
				},
			},

			getSchedulerControl: function() {
				return Ext.getCmp("ActivitySectionV2Scheduler");
			},

			getViewModel: function() {
				var schedulerControl = this.getSchedulerControl();
				return schedulerControl.model;
			},

			getSelectedTaskId: function() {
				var id;
				var viewModel = this.getViewModel();
				var selectedItems = viewModel.getSelectedItems();
				if (selectedItems.length) {
					id = selectedItems[0];
				} else {
					var message = "Сначала выберите задачу";
					Terrasoft.showInformation(message);
				}
				return id;
			},

			showMask: function(customConfig) {
				var config = {
					timeout: 0
				};
				Ext.apply(config, customConfig);
				this.maskId = Terrasoft.Mask.show(config);
				this.baseMaskShow = Terrasoft.Mask.show;
				Terrasoft.Mask.show = function() {};
			},

			hideMask: function() {
				Terrasoft.Mask.hide(this.maskId);
				Terrasoft.Mask.show = this.baseMaskShow;
			},

			addHotkeys: function() {
				var doc = Ext.getDoc();
				doc.on("keydown", this.onKeyDown, this);
			},

			onKeyDown: function(event) {
				if (!this.isSchedulerVisible()) {
					return;
				}
				if (event.ctrlKey && event.altKey && event.keyCode === event.T) {
					event.preventDefault();
					this.addTags();
					return false;
				}
				if (this.isMinipageEditOpened()) {
					if (event.altKey && event.keyCode === 13) {
						event.preventDefault();
						this.quickSave();
						return false;
					}
					return;
				}
				if (event.altKey && event.keyCode >= 48 && event.keyCode <= 57) {
					event.preventDefault();
					this.selectChatRoom(event.keyCode - 48);
					return false;
				}
				if (event.altKey && event.keyCode === event.D) {
					event.preventDefault();
					this.updateTask(ConfigurationConstants.Activity.Status.Done);
					return false;
				}
				if (event.altKey && event.keyCode === event.B) {
					event.preventDefault();
					this.bookToTsIntegration();
					return false;
				}
				if (event.altKey && event.keyCode === event.U) {
					event.preventDefault();
					this.updateTask(ConfigurationConstants.Activity.Status.NotStarted);
					return false;
				}
				if (event.altKey && event.keyCode === event.C) {
					event.preventDefault();
					this.copyTask();
					return false;
				}
				if (event.altKey && event.keyCode === event.V) {
					if (!this.copiedTaskId) {
						return;
					}
					event.preventDefault();
					this.pasteTask();
					return false;
				}
				if (!event.shiftKey && event.keyCode === event.DELETE) {
					event.preventDefault();
					this.deleteTask({
						silent: false
					});
					return false;
				}
				if (event.shiftKey && event.keyCode === event.DELETE) {
					event.preventDefault();
					this.deleteTask({
						silent: true
					});
					return false;
				}
				if (event.keyCode === event.INSERT) {
					event.preventDefault();
					this.addTask();
					return false;
				}
			},

			updateRecordByResponse: function(id, response) {
				var errorMessage;
				var viewModel = this.getViewModel();
				if (response.success) {
					if (id) {
						viewModel.loadGridDataRecord(id, function() {
							this.hideMask();
						}, this);
						return;
					}
				} else {
					errorMessage = response.errorInfo.message;
					viewModel.error(errorMessage);
				}
				if (!response.success && errorMessage) {
					Terrasoft.showInformation(errorMessage);
				}
				this.hideMask();
			},

			updateTask: function(status) {
				var id = this.getSelectedTaskId();
				if (!id) {
					return;
				}
				this.updateTaskLookupField("Status", status);
			},

			bookToTsIntegration: function() {
				var tsIntegrationId = "7a6f2144-a972-423b-8cc4-08a68a48ddba";//TsIntegration
				this.updateTaskLookupField("Account", tsIntegrationId);
			},

			updateTaskLookupField: function(filedName,fieldValue) {
				var id = this.getSelectedTaskId();
				if (!id) {
					return;
				}
				this.showMask({
					selector: this.selectedItemSelector,
					caption: "Обновление поля: " + filedName
				});
				var viewModel = this.getViewModel();
				var update = viewModel.Ext.create("Terrasoft.UpdateQuery", {
					rootSchemaName: "Activity"
				});
				var idFilter = update.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL, "Id", id);
				update.filters.add("IdFilter", idFilter);
				update.setParameterValue(filedName, fieldValue, Terrasoft.DataValueType.GUID);
				update.execute(function(response) {
					this.updateRecordByResponse(id, response);
				}, this);
			},

			copyTask: function() {
				this.copiedTaskId = this.getSelectedTaskId();
			},

			pasteTask: function() {
				var viewModel = this.getViewModel();
				var maskSelector, selection;
				if (document.querySelector(this.selectionSelector)) {
					maskSelector = this.selectionSelector;
					selection = viewModel.get("SchedulerSelection");
				} else {
					if (document.querySelector(this.selectedItemSelector)) {
						maskSelector = this.selectedItemSelector;
					} else {
						maskSelector = this.schedulerSelector;
					}
				}
				this.showMask({
					selector: maskSelector,
					caption: "Вставка задачи"
				});
				var baseBeforeLoadGridDataRecord = viewModel.beforeLoadGridDataRecord;
				viewModel.beforeLoadGridDataRecord = function() {};
				var activity = Ext.create(viewModel.getGridRowViewModelClassName(), {
					entitySchema: viewModel.entitySchema,
					columns: viewModel.getCloneableColumns()
				});
				activity.copyEntity(this.copiedTaskId, function(newActivity) {
					if (selection) {
						newActivity.set("DueDate", selection.dueDate);
						newActivity.set("StartDate", selection.startDate);
						newActivity.set("Owner", Terrasoft.SysValue.CURRENT_USER_CONTACT);
					}
					newActivity.saveEntity(function(response) {
						viewModel.beforeLoadGridDataRecord = baseBeforeLoadGridDataRecord;
						var id = response.id;
						if (response.success) {
							newActivity.values = newActivity.model.attributes;
							newActivity.set("Id", id);
						}
						this.updateRecordByResponse(id, response);
					}, this);
				}, this);
			},

			deleteTask: function(config) {
				if (this.getSelectedTaskId()) {
					if (config.silent) {
						this.silentDeleteTask();
					} else {
						var viewModel = this.getViewModel();
						viewModel.deleteItem();
					}
				}
			},

			silentDeleteTask: function() {
				this.showMask({
					selector: this.selectedItemSelector,
					caption: "Удаление..."
				});
				var id = this.getSelectedTaskId();
				var viewModel = this.getViewModel();
				var baseReloadGridData = viewModel.reloadGridData;
				viewModel.reloadGridData = function() {
					var data = viewModel.getGridData();
					data.removeByKey(id);
					this.hideMask();
					viewModel.reloadGridData = baseReloadGridData;
				}.bind(this);
				viewModel.onMultiDeleteAccept();
			},

			addTask: function() {
				var viewModel = this.getViewModel();
				viewModel.onSelectionKeyPress();
			},

			addTags: function() {
				var taskId = this.getSelectedTaskId();
				if (taskId) {
					var viewModel = this.getViewModel();
					var tagViewModel = Ext.create(this.getTagsViewModelName(), {
						entitySchema: viewModel.entitySchema,
						entitySchemaName: viewModel.entitySchemaName,
						sandbox: viewModel.sandbox,
						values: {
							Id: taskId
						}
					});
					tagViewModel.initTags(viewModel.entitySchemaName);
					tagViewModel.showTagModule();
				}
			},

			quickSave: function() {
				var miniPage = Ext.getCmp("ActivityMiniPageContainer") || {};
				var miniPageViewModel = miniPage.model;
				if (miniPageViewModel) {
					miniPageViewModel.save();
				}
			},

			isMinipageEditOpened: function() {
				return !!document.querySelector("#MiniPageContainer .base-minipage-edit-button-container");
			},

			isSchedulerVisible: function() {
				var scheduler = this.getSchedulerControl();
				return scheduler && scheduler.isVisible(true);
			},

			createTreeDaysPeriodFilterButton: function() {
				var id = "filter-period-button";
				if (document.querySelector("#" + id)) {
					return;
				}
				var button = document.createElement("button");
				button.id = id;
				button.title = "Вчера-сегодня-завтра";
				button.setAttribute("banza-extension", "work-shortcuts");
				button.className = "tree-days-period-button";

				var dayButton = document.querySelector(this.filterPeriodSelector + " [data-item-marker='day']");
				dayButton.parentNode.insertBefore(button, dayButton.nextSibling);
				button.addEventListener("click", this.onTreeDaysPeriodFilterButtonClick.bind(this), false);
			},

			onTreeDaysPeriodFilterButtonClick: function() {
				var filterPeriodContainer = document.querySelector(this.filterPeriodSelector);
				var filterModel = Ext.getCmp(filterPeriodContainer.id).model;
				var startDate = Terrasoft.startOfDay(Ext.Date.add(new Date(), "d", -1));
				var dueDate = Terrasoft.startOfDay(Ext.Date.add(new Date(), "d", 1));
				filterModel.suspendUpdate = true;
				filterModel.set("StartDate", startDate);
				filterModel.set("DueDate", dueDate);
				filterModel.suspendUpdate = false;
				if (filterModel.filterChanged) {
					filterModel.filterChanged();
				}
			},

			selectChatRoom: function(number) {
				var filterPeriodContainer = document.querySelector(this.filterPeriodSelector);
				var filterModel = Ext.getCmp(filterPeriodContainer.id).model;
				var chatRoom = this.getChatRoomByNumber(number);
				var filterName = "fixedFilter" + "Owner" + chatRoom.value;
				var selectedValues = filterModel.get(filterModel.getSelectedLookupValuesPropertyName("Owner"));

				if (selectedValues.contains(filterName)) {
					selectedValues.removeByKey(filterName);
					filterModel.filterChanged();
				} else {
					filterModel.addNonPeriodFilterValue("Owner", chatRoom);
				}
			},
			getChatRoomByNumber: function(number) {
				return this.chatRooms[number];
			},

			fixFilterValueCursor: function() {
				var labels = document.querySelectorAll(".t-label.filter-value-label.filter-element-with-right-space");
				labels.forEach(function(label) {
					label.style.cursor = "pointer";
				});
			},

			subscribeMouseWheel: function() {
				var doc = Ext.getDoc();
				doc.on("wheel", this.onMouseWheel.bind(this), false);
			},

			onMouseWheel: function(e) {
				var event = e.browserEvent;
				if (this.changingInterval || !event.ctrlKey || !event.target ||
					!Ext.get(event.target).parent(this.schedulerSelector)) {
					return true;
				}
				event.preventDefault();
				var timeIntervalEnum = [5, 10, 15, 30, 60];
				var viewModel = this.getViewModel();
				var profile = viewModel.get("Profile");
				var timeScale = profile.schedulerTimeScaleLookupValue;
				var interval = timeIntervalEnum.indexOf(timeScale);
				interval += (event.wheelDelta < 0) ? 1 : -1;
				timeScale = timeIntervalEnum[interval];
				if (!timeScale) {
					// TODO
					return;
				}
				this.changingInterval = true;
				this.showMask({
					selector: this.schedulerSelector,
					caption: "Масштабирование"
				});
				var scheduler = this.getSchedulerControl();
				var onSchedulerAfterReRender = function() {
					scheduler.un("afterrerender", onSchedulerAfterReRender, this);
					this.hideMask();
					this.changingInterval = false;
				};
				scheduler.on("afterrerender", onSchedulerAfterReRender, this);
				viewModel.changeInterval(timeScale);
			},

			getTagsViewModelName: function() {
				return "Terrasoft.WorkShortcutsExtension.TagViewModel";
			},

			initTags: function() {
				var viewModel = this.getViewModel();
				Ext.define(this.getTagsViewModelName(), {
					extend: viewModel.getGridRowViewModelClassName(),
					mixins: {
						TagUtilities: "Terrasoft.TagUtilities"
					},
					getCurrentRecordId: function() {
						return this.get("Id");
					}
				});
			},

			createHelpButton: function() {
				var id = "scheduler-shortcut-help-button";
				if (document.querySelector("#" + id)) {
					return;
				}
				var button = document.createElement("button");
				button.id = id;
				button.title = "Сочетания клавиш";
				button.setAttribute("banza-extension", "work-shortcuts");
				button.className = "keyboard-shortcuts";
				var container = document.querySelector(".separate-action-buttons-right-container-wrapClass");
				container.appendChild(button);
				button.addEventListener("click", this.onHelpButtonClick.bind(this), false);
			},

			onHelpButtonClick: function() {
				var commands = [
					{
					command: "Alt+B",
					description: "Прибилить к Тс интеграции"
				},{
					command: "Alt+D",
					description: "Отменить задачу как \"Выполнена\""
				}, {
					command: "Alt+U",
					description: "Отменить задачу как \"Не выполнена\""
				}, {
					command: "Alt+С",
					description: "Скопировать выделенную задачу"
				}, {
					command: "Alt+V",
					description: "Вставить задачу"
				}, {
					command: "Del",
					description: "Удалить задачу"
				}, {
					command: "Shift+Del",
					description: "Быстрое удаление задачи"
				}, {
					command: "Ins",
					description: "Добавить задачу"
				}, {
					command: "Ctrl+колесо мыши",
					description: "Изменение масштаба"
				}, {
					command: "Ctrl+Alt+T",
					description: "Добавить теги"
				}, {
					command: "Ctrl+Enter",
					description: "При открытой мини карточки сохраняет данные активности"
				}];
				var message = "";
				commands.forEach(function(value) {
					message += "\u25AA " + value.command + ": " + value.description + "\n";
				});
				Terrasoft.showInformation(message);
			},

			subscribeReInit: function() {
				// TODO
			},

			applyCustomization: function() {
				this.addHotkeys();
				this.subscribeMouseWheel();
				this.createHelpButton();
				this.initTags();
			}

		};

		var schedulerIntervalId = setInterval(function() {
			if (!document.querySelector(model.schedulerSelector)) {
				return;
			}
			clearInterval(schedulerIntervalId);
			model.applyCustomization();
			model.subscribeReInit();
		}, 1000);

		var filterPeriodIntervalId = setInterval(function() {
			if (!document.querySelector(model.filterPeriodSelector)) {
				return;
			}
			clearInterval(filterPeriodIntervalId);
			model.createTreeDaysPeriodFilterButton();
			model.fixFilterValueCursor();
		}, 1000);

	});
}


(async function() {

	var wait = (time) => new Promise(resolve => setTimeout(resolve, time));

	let waited = 0;
	await wait(1000);
	while (!Terrasoft.BaseEdit && waited < 10) {
		await wait(1000);
		waited++;
	}
	initActivityShortcuts();
})();