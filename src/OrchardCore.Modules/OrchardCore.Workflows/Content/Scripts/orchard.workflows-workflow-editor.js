/*
** NOTE: This file is generated by Gulp and should not be edited directly!
** Any changes made directly to this file will be overwritten next time its asset group is processed by Gulp.
*/

///<reference path="../Lib/jquery/typings.d.ts" />
///<reference path="../Lib/jsplumb/typings.d.ts" />
///<reference path="./workflow-models.ts" />
var WorkflowEditor = /** @class */ (function () {
    function WorkflowEditor(container, workflowDefinitionData) {
        var _this = this;
        this.container = container;
        this.serialize = function () {
            var allActivities = $(this.container).find(".activity");
            var workflow = {
                activities: [],
                connections: []
            };
            for (var i = 0; i < allActivities.length; i++) {
                var activity = $(allActivities[i]);
                var activityModel = activity.data("activity-model");
                var activityPosition = activity.position();
                workflow.activities.push({
                    id: activityModel.id,
                    x: activityPosition.left,
                    y: activityPosition.top
                });
            }
            var allConnections = this.jsPlumbInstance.getConnections();
            for (var i = 0; i < allConnections.length; i++) {
                var connection = allConnections[i];
                var sourceEndpoint = connection.endpoints[0];
                var sourceOutcomeName = sourceEndpoint.getParameters().outcome.name;
                var sourceActivity = $(connection.source).data("activity-model");
                var destinationActivity = $(connection.target).data("activity-model");
                workflow.connections.push({
                    sourceActivityId: sourceActivity.id,
                    destinationActivityId: destinationActivity.id,
                    sourceOutcomeName: sourceOutcomeName
                });
            }
            return JSON.stringify(workflow);
        };
        jsPlumb.ready(function () {
            var plumber = jsPlumb.getInstance({
                DragOptions: { cursor: 'pointer', zIndex: 2000 },
                ConnectionOverlays: [
                    ["Arrow", {
                            location: 1,
                            visible: true,
                            width: 11,
                            length: 11
                        }],
                    ["Label", {
                            location: 0.5,
                            id: "label",
                            cssClass: "connection-label"
                        }]
                ],
                Container: container
            });
            var getSourceEndpointOptions = function (outcome) {
                // The definition of source endpoints.
                return {
                    endpoint: "Dot",
                    anchor: "Continuous",
                    paintStyle: {
                        stroke: "#7AB02C",
                        fill: "#7AB02C",
                        radius: 7,
                        strokeWidth: 1
                    },
                    isSource: true,
                    connector: ["Flowchart", { stub: [40, 60], gap: 0, cornerRadius: 5, alwaysRespectStubs: true }],
                    connectorStyle: {
                        strokeWidth: 2,
                        stroke: "#999999",
                        joinstyle: "round",
                        outlineStroke: "white",
                        outlineWidth: 2
                    },
                    hoverPaintStyle: {
                        fill: "#216477",
                        stroke: "#216477"
                    },
                    connectorHoverStyle: {
                        strokeWidth: 3,
                        stroke: "#216477",
                        outlineWidth: 5,
                        outlineStroke: "white"
                    },
                    dragOptions: {},
                    overlays: [
                        ["Label", {
                                location: [0.5, 1.5],
                                //label: outcome.displayName,
                                cssClass: "endpointSourceLabel",
                                visible: true
                            }]
                    ],
                    parameters: {
                        outcome: outcome
                    }
                };
            };
            // Suspend drawing and initialize.
            plumber.batch(function () {
                // Listen for new connections; initialise them the same way we initialise the connections at startup.
                plumber.bind("connection", function (connInfo, originalEvent) {
                    var connection = connInfo.connection;
                    var outcome = connection.getParameters().outcome;
                    var label = connection.getOverlay("label");
                    label.setLabel(outcome.displayName);
                });
                // Initialize activities, endpoints and connectors from model.
                var test = workflowDefinitionData;
                var workflowModel = workflowDefinitionData;
                for (var _i = 0, _a = workflowModel.activities; _i < _a.length; _i++) {
                    var activityModel = _a[_i];
                    // Generate activity HTML element.
                    var activityNode = $("<div class=\"activity\" style=\"left:" + activityModel.x + "px; top:" + activityModel.y + "px;\"></div>");
                    var activityElement = activityNode[0];
                    // Add activity HTML element to the canvas.
                    $(container).append(activityNode);
                    // Make the activity draggable.
                    plumber.draggable(activityElement, { grid: [20, 20] });
                    // Configure the activity as a target.
                    plumber.makeTarget(activityElement, {
                        dropOptions: { hoverClass: "hover" },
                        anchor: "Continuous",
                        endpoint: ["Blank", { radius: 8 }]
                    });
                    // Add source endpoints.
                    var hasMultipleOutcomes = activityModel.outcomes.length > 1;
                    for (var _b = 0, _c = activityModel.outcomes; _b < _c.length; _b++) {
                        var outcome = _c[_b];
                        var sourceEndpointOptions = getSourceEndpointOptions(outcome);
                        var endpoint = plumber.addEndpoint(activityElement, sourceEndpointOptions);
                    }
                    $(activityElement).data("activity-model", activityModel);
                }
                plumber.bind("click", function (conn, originalEvent) {
                    //plumber.deleteConnection(conn);
                });
                plumber.bind("connectionDrag", function (connection) {
                    console.log("connection " + connection.id + " is being dragged. suspendedElement is ", connection.suspendedElement, " of type ", connection.suspendedElementType);
                });
                plumber.bind("connectionDragStop", function (connection) {
                    console.log("connection " + connection.id + " was dragged");
                });
                plumber.bind("connectionMoved", function (params) {
                    console.log("connection " + params.connection.id + " was moved");
                });
            });
            _this.jsPlumbInstance = plumber;
        });
    }
    return WorkflowEditor;
}());
$.fn.workflowEditor = function () {
    this.each(function (index, element) {
        var $element = $(element);
        var workflowDefinitionData = $element.data("workflow-definition");
        $element.data("workflowEditor", new WorkflowEditor(element, workflowDefinitionData));
    });
    return this;
};
$(document).ready(function () {
    var workflowEditor = $(".workflow-editor-canvas").workflowEditor().data("workflowEditor");
    $("#workflowEditorForm").on("submit", function (s, e) {
        var state = workflowEditor.serialize();
        $("#workflowStateInput").val(state);
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QyxjQUFjLEVBQUUsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztJQUU1RyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLFVBQUMsQ0FBQyxFQUFFLENBQUM7UUFDdkMsSUFBTSxLQUFLLEdBQUcsY0FBYyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3pDLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN4QyxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6Im9yY2hhcmQud29ya2Zsb3dzLXdvcmtmbG93LWVkaXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uL0xpYi9qcXVlcnkvdHlwaW5ncy5kLnRzXCIgLz5cclxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi4vTGliL2pzcGx1bWIvdHlwaW5ncy5kLnRzXCIgLz5cclxuLy8vPHJlZmVyZW5jZSBwYXRoPVwiLi93b3JrZmxvdy1tb2RlbHMudHNcIiAvPlxyXG5cclxuY2xhc3MgV29ya2Zsb3dFZGl0b3Ige1xyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBjb250YWluZXI6IEhUTUxFbGVtZW50LCB3b3JrZmxvd0RlZmluaXRpb25EYXRhOiBXb3JrZmxvd3MuV29ya2Zsb3cpIHtcclxuXHJcbiAgICAgICAganNQbHVtYi5yZWFkeSgoKSA9PiB7XHJcbiAgICAgICAgICAgIHZhciBwbHVtYmVyID0ganNQbHVtYi5nZXRJbnN0YW5jZSh7XHJcbiAgICAgICAgICAgICAgICBEcmFnT3B0aW9uczogeyBjdXJzb3I6ICdwb2ludGVyJywgekluZGV4OiAyMDAwIH0sXHJcbiAgICAgICAgICAgICAgICBDb25uZWN0aW9uT3ZlcmxheXM6IFtcclxuICAgICAgICAgICAgICAgICAgICBbXCJBcnJvd1wiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2aXNpYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogMTEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlbmd0aDogMTFcclxuICAgICAgICAgICAgICAgICAgICB9XSxcclxuICAgICAgICAgICAgICAgICAgICBbXCJMYWJlbFwiLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uOiAwLjUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBcImxhYmVsXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNzc0NsYXNzOiBcImNvbm5lY3Rpb24tbGFiZWxcIlxyXG4gICAgICAgICAgICAgICAgICAgIH1dXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgQ29udGFpbmVyOiBjb250YWluZXJcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgZ2V0U291cmNlRW5kcG9pbnRPcHRpb25zID0gZnVuY3Rpb24gKG91dGNvbWU6IFdvcmtmbG93cy5PdXRjb21lKTogRW5kcG9pbnRPcHRpb25zIHtcclxuICAgICAgICAgICAgICAgIC8vIFRoZSBkZWZpbml0aW9uIG9mIHNvdXJjZSBlbmRwb2ludHMuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGVuZHBvaW50OiBcIkRvdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGFuY2hvcjogXCJDb250aW51b3VzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgcGFpbnRTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJva2U6IFwiIzdBQjAyQ1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsOiBcIiM3QUIwMkNcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmFkaXVzOiA3LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJva2VXaWR0aDogMVxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgaXNTb3VyY2U6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgY29ubmVjdG9yOiBbXCJGbG93Y2hhcnRcIiwgeyBzdHViOiBbNDAsIDYwXSwgZ2FwOiAwLCBjb3JuZXJSYWRpdXM6IDUsIGFsd2F5c1Jlc3BlY3RTdHViczogdHJ1ZSB9XSxcclxuICAgICAgICAgICAgICAgICAgICBjb25uZWN0b3JTdHlsZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJva2VXaWR0aDogMixcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlOiBcIiM5OTk5OTlcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgam9pbnN0eWxlOiBcInJvdW5kXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dGxpbmVTdHJva2U6IFwid2hpdGVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0bGluZVdpZHRoOiAyXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBob3ZlclBhaW50U3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbDogXCIjMjE2NDc3XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZTogXCIjMjE2NDc3XCJcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbm5lY3RvckhvdmVyU3R5bGU6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3Ryb2tlV2lkdGg6IDMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cm9rZTogXCIjMjE2NDc3XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dGxpbmVXaWR0aDogNSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3V0bGluZVN0cm9rZTogXCJ3aGl0ZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBkcmFnT3B0aW9uczoge30sXHJcbiAgICAgICAgICAgICAgICAgICAgb3ZlcmxheXM6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgW1wiTGFiZWxcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9jYXRpb246IFswLjUsIDEuNV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2xhYmVsOiBvdXRjb21lLmRpc3BsYXlOYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3NzQ2xhc3M6IFwiZW5kcG9pbnRTb3VyY2VMYWJlbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XVxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRjb21lOiBvdXRjb21lXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIC8vIFN1c3BlbmQgZHJhd2luZyBhbmQgaW5pdGlhbGl6ZS5cclxuICAgICAgICAgICAgcGx1bWJlci5iYXRjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBMaXN0ZW4gZm9yIG5ldyBjb25uZWN0aW9uczsgaW5pdGlhbGlzZSB0aGVtIHRoZSBzYW1lIHdheSB3ZSBpbml0aWFsaXNlIHRoZSBjb25uZWN0aW9ucyBhdCBzdGFydHVwLlxyXG4gICAgICAgICAgICAgICAgcGx1bWJlci5iaW5kKFwiY29ubmVjdGlvblwiLCBmdW5jdGlvbiAoY29ubkluZm8sIG9yaWdpbmFsRXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb25uZWN0aW9uOiBDb25uZWN0aW9uID0gY29ubkluZm8uY29ubmVjdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBvdXRjb21lOiBXb3JrZmxvd3MuT3V0Y29tZSA9IGNvbm5lY3Rpb24uZ2V0UGFyYW1ldGVycygpLm91dGNvbWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxhYmVsOiBhbnkgPSBjb25uZWN0aW9uLmdldE92ZXJsYXkoXCJsYWJlbFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBsYWJlbC5zZXRMYWJlbChvdXRjb21lLmRpc3BsYXlOYW1lKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEluaXRpYWxpemUgYWN0aXZpdGllcywgZW5kcG9pbnRzIGFuZCBjb25uZWN0b3JzIGZyb20gbW9kZWwuXHJcbiAgICAgICAgICAgICAgICB2YXIgdGVzdCA9IHdvcmtmbG93RGVmaW5pdGlvbkRhdGE7XHJcbiAgICAgICAgICAgICAgICB2YXIgd29ya2Zsb3dNb2RlbDogV29ya2Zsb3dzLldvcmtmbG93ID0gd29ya2Zsb3dEZWZpbml0aW9uRGF0YTtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBhY3Rpdml0eU1vZGVsIG9mIHdvcmtmbG93TW9kZWwuYWN0aXZpdGllcykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEdlbmVyYXRlIGFjdGl2aXR5IEhUTUwgZWxlbWVudC5cclxuICAgICAgICAgICAgICAgICAgICBsZXQgYWN0aXZpdHlOb2RlID0gJChgPGRpdiBjbGFzcz1cImFjdGl2aXR5XCIgc3R5bGU9XCJsZWZ0OiR7YWN0aXZpdHlNb2RlbC54fXB4OyB0b3A6JHthY3Rpdml0eU1vZGVsLnl9cHg7XCI+PC9kaXY+YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGFjdGl2aXR5RWxlbWVudCA9IGFjdGl2aXR5Tm9kZVswXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQWRkIGFjdGl2aXR5IEhUTUwgZWxlbWVudCB0byB0aGUgY2FudmFzLlxyXG4gICAgICAgICAgICAgICAgICAgICQoY29udGFpbmVyKS5hcHBlbmQoYWN0aXZpdHlOb2RlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gTWFrZSB0aGUgYWN0aXZpdHkgZHJhZ2dhYmxlLlxyXG4gICAgICAgICAgICAgICAgICAgIHBsdW1iZXIuZHJhZ2dhYmxlKGFjdGl2aXR5RWxlbWVudCwgeyBncmlkOiBbMjAsIDIwXSB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQ29uZmlndXJlIHRoZSBhY3Rpdml0eSBhcyBhIHRhcmdldC5cclxuICAgICAgICAgICAgICAgICAgICBwbHVtYmVyLm1ha2VUYXJnZXQoYWN0aXZpdHlFbGVtZW50LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRyb3BPcHRpb25zOiB7IGhvdmVyQ2xhc3M6IFwiaG92ZXJcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmNob3I6IFwiQ29udGludW91c1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRwb2ludDogW1wiQmxhbmtcIiwgeyByYWRpdXM6IDggfV1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQWRkIHNvdXJjZSBlbmRwb2ludHMuXHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGhhc011bHRpcGxlT3V0Y29tZXMgPSBhY3Rpdml0eU1vZGVsLm91dGNvbWVzLmxlbmd0aCA+IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgb3V0Y29tZSBvZiBhY3Rpdml0eU1vZGVsLm91dGNvbWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzb3VyY2VFbmRwb2ludE9wdGlvbnMgPSBnZXRTb3VyY2VFbmRwb2ludE9wdGlvbnMob3V0Y29tZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlbmRwb2ludCA9IHBsdW1iZXIuYWRkRW5kcG9pbnQoYWN0aXZpdHlFbGVtZW50LCBzb3VyY2VFbmRwb2ludE9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJChhY3Rpdml0eUVsZW1lbnQpLmRhdGEoXCJhY3Rpdml0eS1tb2RlbFwiLCBhY3Rpdml0eU1vZGVsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBwbHVtYmVyLmJpbmQoXCJjbGlja1wiLCBmdW5jdGlvbiAoY29ubiwgb3JpZ2luYWxFdmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vcGx1bWJlci5kZWxldGVDb25uZWN0aW9uKGNvbm4pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcGx1bWJlci5iaW5kKFwiY29ubmVjdGlvbkRyYWdcIiwgZnVuY3Rpb24gKGNvbm5lY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImNvbm5lY3Rpb24gXCIgKyBjb25uZWN0aW9uLmlkICsgXCIgaXMgYmVpbmcgZHJhZ2dlZC4gc3VzcGVuZGVkRWxlbWVudCBpcyBcIiwgY29ubmVjdGlvbi5zdXNwZW5kZWRFbGVtZW50LCBcIiBvZiB0eXBlIFwiLCBjb25uZWN0aW9uLnN1c3BlbmRlZEVsZW1lbnRUeXBlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHBsdW1iZXIuYmluZChcImNvbm5lY3Rpb25EcmFnU3RvcFwiLCBmdW5jdGlvbiAoY29ubmVjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiY29ubmVjdGlvbiBcIiArIGNvbm5lY3Rpb24uaWQgKyBcIiB3YXMgZHJhZ2dlZFwiKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHBsdW1iZXIuYmluZChcImNvbm5lY3Rpb25Nb3ZlZFwiLCBmdW5jdGlvbiAocGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJjb25uZWN0aW9uIFwiICsgcGFyYW1zLmNvbm5lY3Rpb24uaWQgKyBcIiB3YXMgbW92ZWRcIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmpzUGx1bWJJbnN0YW5jZSA9IHBsdW1iZXI7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBqc1BsdW1iSW5zdGFuY2U6IGpzUGx1bWJJbnN0YW5jZTtcclxuXHJcbiAgICBwdWJsaWMgc2VyaWFsaXplID0gZnVuY3Rpb24gKCk6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgYWxsQWN0aXZpdGllcyA9ICQodGhpcy5jb250YWluZXIpLmZpbmQoXCIuYWN0aXZpdHlcIik7XHJcbiAgICAgICAgY29uc3Qgd29ya2Zsb3c6IGFueSA9IHtcclxuICAgICAgICAgICAgYWN0aXZpdGllczogW10sXHJcbiAgICAgICAgICAgIGNvbm5lY3Rpb25zOiBbXVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWxsQWN0aXZpdGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgYWN0aXZpdHkgPSAkKGFsbEFjdGl2aXRpZXNbaV0pO1xyXG4gICAgICAgICAgICB2YXIgYWN0aXZpdHlNb2RlbDogV29ya2Zsb3dzLkFjdGl2aXR5ID0gYWN0aXZpdHkuZGF0YShcImFjdGl2aXR5LW1vZGVsXCIpO1xyXG4gICAgICAgICAgICB2YXIgYWN0aXZpdHlQb3NpdGlvbiA9IGFjdGl2aXR5LnBvc2l0aW9uKCk7XHJcblxyXG4gICAgICAgICAgICB3b3JrZmxvdy5hY3Rpdml0aWVzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgaWQ6IGFjdGl2aXR5TW9kZWwuaWQsXHJcbiAgICAgICAgICAgICAgICB4OiBhY3Rpdml0eVBvc2l0aW9uLmxlZnQsXHJcbiAgICAgICAgICAgICAgICB5OiBhY3Rpdml0eVBvc2l0aW9uLnRvcFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGFsbENvbm5lY3Rpb25zID0gdGhpcy5qc1BsdW1iSW5zdGFuY2UuZ2V0Q29ubmVjdGlvbnMoKTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFsbENvbm5lY3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBjb25uZWN0aW9uID0gYWxsQ29ubmVjdGlvbnNbaV07XHJcbiAgICAgICAgICAgIHZhciBzb3VyY2VFbmRwb2ludDogRW5kcG9pbnQgPSBjb25uZWN0aW9uLmVuZHBvaW50c1swXTtcclxuICAgICAgICAgICAgdmFyIHNvdXJjZU91dGNvbWVOYW1lID0gc291cmNlRW5kcG9pbnQuZ2V0UGFyYW1ldGVycygpLm91dGNvbWUubmFtZTtcclxuICAgICAgICAgICAgdmFyIHNvdXJjZUFjdGl2aXR5OiBXb3JrZmxvd3MuQWN0aXZpdHkgPSAkKGNvbm5lY3Rpb24uc291cmNlKS5kYXRhKFwiYWN0aXZpdHktbW9kZWxcIik7XHJcbiAgICAgICAgICAgIHZhciBkZXN0aW5hdGlvbkFjdGl2aXR5OiBXb3JrZmxvd3MuQWN0aXZpdHkgPSAkKGNvbm5lY3Rpb24udGFyZ2V0KS5kYXRhKFwiYWN0aXZpdHktbW9kZWxcIik7XHJcblxyXG4gICAgICAgICAgICB3b3JrZmxvdy5jb25uZWN0aW9ucy5wdXNoKHtcclxuICAgICAgICAgICAgICAgIHNvdXJjZUFjdGl2aXR5SWQ6IHNvdXJjZUFjdGl2aXR5LmlkLFxyXG4gICAgICAgICAgICAgICAgZGVzdGluYXRpb25BY3Rpdml0eUlkOiBkZXN0aW5hdGlvbkFjdGl2aXR5LmlkLFxyXG4gICAgICAgICAgICAgICAgc291cmNlT3V0Y29tZU5hbWU6IHNvdXJjZU91dGNvbWVOYW1lXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkod29ya2Zsb3cpO1xyXG4gICAgfVxyXG59XHJcblxyXG4kLmZuLndvcmtmbG93RWRpdG9yID0gZnVuY3Rpb24gKHRoaXM6IEpRdWVyeSk6IEpRdWVyeSB7XHJcbiAgICB0aGlzLmVhY2goKGluZGV4LCBlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgdmFyICRlbGVtZW50ID0gJChlbGVtZW50KTtcclxuICAgICAgICB2YXIgd29ya2Zsb3dEZWZpbml0aW9uRGF0YTogV29ya2Zsb3dzLldvcmtmbG93ID0gJGVsZW1lbnQuZGF0YShcIndvcmtmbG93LWRlZmluaXRpb25cIik7XHJcblxyXG4gICAgICAgICRlbGVtZW50LmRhdGEoXCJ3b3JrZmxvd0VkaXRvclwiLCBuZXcgV29ya2Zsb3dFZGl0b3IoZWxlbWVudCwgd29ya2Zsb3dEZWZpbml0aW9uRGF0YSkpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbn07XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25zdCB3b3JrZmxvd0VkaXRvcjogV29ya2Zsb3dFZGl0b3IgPSAkKFwiLndvcmtmbG93LWVkaXRvci1jYW52YXNcIikud29ya2Zsb3dFZGl0b3IoKS5kYXRhKFwid29ya2Zsb3dFZGl0b3JcIik7XHJcblxyXG4gICAgJChcIiN3b3JrZmxvd0VkaXRvckZvcm1cIikub24oXCJzdWJtaXRcIiwgKHMsIGUpID0+IHtcclxuICAgICAgICBjb25zdCBzdGF0ZSA9IHdvcmtmbG93RWRpdG9yLnNlcmlhbGl6ZSgpO1xyXG4gICAgICAgICQoXCIjd29ya2Zsb3dTdGF0ZUlucHV0XCIpLnZhbChzdGF0ZSk7XHJcbiAgICB9KTtcclxufSk7Il19