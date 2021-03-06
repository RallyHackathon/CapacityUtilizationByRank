//this custom tree item shows the name and the object id of a story.
 Ext.define('MyTreeItem', {
     extend: 'Rally.ui.tree.TreeItem',
     alias: 'widget.mytreeitem',

     // override the function to create a new template for the pill
     getPillTpl: function(){
         return Ext.create('Ext.XTemplate',
         '<div class="pill">',
             '{FormattedID} -',
             ' Plan Est: {PlanEstimate}',
             ' Schedule State: {Schedule State}',
             ' Task Est: {TaskEstimateTotal}',
             ' Task Actual: {TaskActualTotal}',
             ' Task Remaining: {TaskRemainingTotal}',
             ' {Name}',
             ' {Rank}',
         '</div>'
         );
     }
 });

Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    
    launch: function() {
        this.add({
            xtype: 'panel',
            layout: 'hbox',
            width: 'stretch',
            defaults: {
                flex: 1
            },
            items: [
                {
                    xtype: 'rallydatefield',
                    itemId: 'reportStartDate',
                    fieldLabel: 'Start Date',
                    value: new Date(2012, 7, 1)
                },
                {
                    xtype: 'rallydatefield',
                    itemId: 'reportEndDate',
                    fieldLabel: 'End Date',
                    value: new Date(2012, 7, 31)
                }
            ]
        });

        this.add({
            xtype: 'panel',
            title: 'Capacity Utilization by Rank',
            layout: 'hbox',
            width: 'stretch',
            items: [
                {
                xtype: 'panel',
                flex: 1,
                defaultType: 'textfield',
                defaults: {
                    padding: 10
                },
                items: [
                    {
                        xtype: 'rallytree',
                        itemId: 'rallyTree',
                        fieldLabel: 'Filter By Epic Story',
                        listeners: {
                            itemselected: this._userStorySelected,
                            scope: this
                        },
                        topLevelStoreConfig: {
                            sorters: [
                                {
                                    property: 'Rank'
                                }
                            ],
                            pageSize: 30
                        },
                        treeItemConfigForRecordFn: function(record){
                            //only use the new tree item for stories
                            if(record.get('_type') === 'hierarchicalrequirement'){
                                return {
                                    xtype: 'mytreeitem',
                                    selectable: true
                                };
                            } else {
                                return {
                                    selectable: true
                                };
                            }

                        }
                    }
                    // {
                    //     xtype: 'textarea',
                    //     fieldLabel: 'Query',
                    //     itemId: 'queryField',
                    //     height: 100,
                    //     value:  '{\n'+
                    //             '    "State": "Completed",\n'+
                    //             '    "Actuals": {$gte: 0},\n' +
                    //             '    "_TypeHierarchy": -51009,\n' +
                    //             '    "_ValidTo": "9999-01-01T00:00:00.000Z"\n' +
                    //             '}'
                    // },
                ]
           },
           {
            xtype: 'panel',
            itemId: 'gridHolder',
            flex: 2
            }
        ]});
    },

    _getCapacity: function() {
        //TODO: should we exclude non-working days?
        var numOfDays = Rally.util.DateTime.getDifference(this._getEndDate(), this._getStartDate(), 'day');
        var people = 5;
        var hoursPerPoint = 3;
        
       return numOfDays*people*hoursPerPoint;
    },
    
    _userStorySelected: function(treeItem){
        var query = {
            State: "Completed",
            Actuals: {$gte: 0},
            _TypeHierarchy: -51009
        };
    
        var startDate = this._getStartDate();
        var endDate = this._getEndDate();
        // query._ValidFrom = {$gte:startDate,$lt:endDate};
        query.__At = endDate;
        query._ItemHierarchy = treeItem.getRecord().get('ObjectID');

        var capacity = this._getCapacity(startDate, endDate);
        
        this._doSearch(Ext.JSON.encode(query));
    },
    
    _doSearch: function(query){     
        Ext.create('Rally.data.lookback.SnapshotStore', {
            context: {
                workspace: this.context.getWorkspace(),
                project: this.context.getProject()
            },
            fetch:  ["ObjectID", "_ValidFrom", "_UnformattedID", "Name", "Actuals"],
            rawFind: query,
            pageSize: 200,
            autoLoad: true,
            listeners: {
                scope: this,
                load: this.processSnapshots
            }
        });
    },

    _getStartDate: function() {
        return this.down('#reportStartDate').getValue(); 
    },

    _getEndDate: function() {
        return this.down('#reportEndDate').getValue();
    },
    
    processSnapshots: function(store, records){
        var snapshots = [];
        store.each(function(record) {
            snapshots.push(record.data);
        });
            
        var capacity = this._getCapacity();
        var totalActuals = Rally.data.util.Transform.aggregate(snapshots, [{field: 'Actuals', f: '$sum'}]);
        
        var snapshotGrid = Ext.create('Rally.ui.grid.Grid', {
            title: 'Time Spent on What',
            store: store,
            columnCfgs: [
                {
                    text: 'ObjectID', 
                    dataIndex: 'ObjectID'
                },
                {
                    text: 'Name', 
                    dataIndex: 'Name',
                    flex: 1
                },
                {
                    text: 'Actuals', 
                    dataIndex: 'Actuals'
                },
                {
                    text: 'Project',
                    dataIndex: 'Project' 
                },
                {
                    text: '_ValidFrom',
                    dataIndex: '_ValidFrom',
                    flex: 1
                },
                {
                    text: '_ValidTo',
                    dataIndex: '_ValidTo', 
                    flex: 1
                }
            ],
            height: 400
        });
        
        var gridHolder = this.down('#gridHolder');
        gridHolder.removeAll(true);
        gridHolder.add({xtype: 'component', html: 'Total Actuals: ' + totalActuals.Actuals_$sum + ' Total Capacity: ' + capacity});
        gridHolder.add({xtype: 'rallypercentdone', percentDone: totalActuals.Actuals_$sum/capacity});
        gridHolder.add(snapshotGrid);
    }
});