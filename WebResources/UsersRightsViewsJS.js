this.Constants = {
    MSG_NO_RECORS_FOUND: "No record found.",
    MSG_DELETE_CONFIRM: "Are your sute you want to delete selected views?",
    MSG_DELETE_SUCCESS: "Selected views deleted sucessfully.",
    MSG_ASSIGN_SUCCESS: "Selected views assigned to selected user sucessfully.",
    ODATA_ENDPOINT_VERSION: "/api/data/v9.1/"
};
$(document).ready(function () {
    debugger;
    getUsers();
    getSRoles();
    $("#UsersPicklist").change(getUserRoles);
    $("#UsersPicklist0").change(getUsersViews);
    $("#UsersPicklist2").change(getUsersViews2);
    $("#srolesddl").change(getUsersByRole);
    $("#selectAlltoggle").change(SelectDeselectAll);
    $("#executebtn").click(handleAssignDelete);
    //$("#swapimg").click(SwapUsers);
});

function getUsers() {

    var fxml = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='true'>";
    fxml += "<entity name='systemuser'>";
    fxml += "<attribute name='fullname' />";
    fxml += "<attribute name='systemuserid' />";
    fxml += "<order attribute='fullname' descending='false' />";
    fxml += "</entity>";
    fxml += "</fetch>";
    fxml = "?fetchXml=" + encodeURIComponent(fxml);

    window["ENTITY_SET_NAMES"] = window["ENTITY_SET_NAMES"] || JSON.stringify({
        "systemuser": "systemusers",
        "role": "roles",
        "userquery": "userqueries"
    });

    Xrm.WebApi.retrieveMultipleRecords("systemuser", fxml).then(
        function success(result) {
            if (result != null && result.entities.length > 0) {
                //var usersddl = document.getElementById("UsersPicklist");
                //var usersddl2 = document.getElementById("UsersPicklist2");
                for (var rolecount = 0; rolecount < result.entities.length; rolecount++) {
                    $("#UsersPicklist").append($("<option></option>").attr("value", result.entities[rolecount].systemuserid).text(result.entities[rolecount].fullname));
                    $("#UsersPicklist2").append($("<option></option>").attr("value", result.entities[rolecount].systemuserid).text(result.entities[rolecount].fullname));
                    $("#UsersPicklist0").append($("<option></option>").attr("value", result.entities[rolecount].systemuserid).text(result.entities[rolecount].fullname));
                    //var opt = document.createElement("option");
                    //opt.text = result.entities[rolecount].fullname;
                    //opt.value = result.entities[rolecount].systemuserid;
                    //usersddl.add(opt);
                    //usersddl2.add(opt);
                }
            }
        },
        function (error) {
            document.getElementById("userRoles").innerText = error.message;
        }
    );
}
function getSRoles() {
    debugger;
    var fxml = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='true'>";
    fxml += "<entity name='role'>";
    fxml += "<attribute name='name' />";
    fxml += "<attribute name='roleid' />";
    fxml += "<order attribute='name' descending='false' />";
    fxml += "</entity>";
    fxml += "</fetch>";
    fxml = "?fetchXml=" + encodeURIComponent(fxml);

    window["ENTITY_SET_NAMES"] = window["ENTITY_SET_NAMES"] || JSON.stringify({
        "systemuser": "systemusers",
        "role": "roles",
        "userquery": "userqueries"
    });

    Xrm.WebApi.retrieveMultipleRecords("role", fxml).then(
        function success(result) {
            if (result != null && result.entities.length > 0) {
                var usersddl = document.getElementById("srolesddl");
                for (var rolecount = 0; rolecount < result.entities.length; rolecount++) {
                    var opt = document.createElement("option");
                    opt.text = result.entities[rolecount].name;
                    opt.value = result.entities[rolecount].roleid;
                    usersddl.add(opt);
                }
            }
        },
        function (error) {
            document.getElementById("userRoles").innerText = error.message;
        }
    );
}
function getUserRoles() {
    $("#userRoles").empty();
    var usersddl = document.getElementById("UsersPicklist");
    var userRecordId = usersddl.options[usersddl.selectedIndex].value;

    var fxml = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='true'>";
    fxml += "<entity name='role'>";
    fxml += "<attribute name='name' />";
    fxml += "<attribute name='roleid' />";
    fxml += "<order attribute='name' descending='false' />";
    fxml += "<link-entity name='systemuserroles' from='roleid' to='roleid' visible='false' intersect='true'>";
    fxml += "<link-entity name='systemuser' from='systemuserid' to='systemuserid' alias='ab'>";
    fxml += "<filter type='and'>";
    fxml += "<condition attribute='systemuserid' operator='eq' value='" + userRecordId + "' />";
    fxml += "</filter>";
    fxml += "</link-entity>";
    fxml += "</link-entity>";
    fxml += "</entity>";
    fxml += "</fetch>";
    fxml = "?fetchXml=" + encodeURIComponent(fxml);
    window.top["ENTITY_SET_NAMES"] = window.top["ENTITY_SET_NAMES"] || JSON.stringify({
        "systemuser": "systemusers",
        "role": "roles",
        "userquery": "userqueries"
    });


    Xrm.WebApi.retrieveMultipleRecords("role", fxml).then(
        function success(result) {
            if (result != null && result.entities.length > 0) {
                var roles = "";
                //for (var rolecount = 0; rolecount < result.entities.length; rolecount++) {
                //    roles += result.entities[rolecount].name + "\n";
                //}
                //document.getElementById("userRoles").innerText = roles;
                for (var rolecount = 0; rolecount < result.entities.length; rolecount++) {
                    var optionText = result.entities[rolecount].name;
                    $("#userRoles").append($("<option></option>").attr("value", result.entities[rolecount].roleid).text(optionText));
                }
            }
            else {
                $("#userRoles").append($("<option></option>").attr("value", -1).text(Constants.MSG_NO_RECORS_FOUND));
            }
        },
        function (error) {
            $("#userRoles").append($("<option></option>").attr("value", -1).text(this.error.message));
        }
    );
    //getUsersViews();
}

function getUsersByRole() {
    debugger;
    $("#userResult").empty();
    var usersddl = document.getElementById("srolesddl");
    var sroleid = usersddl.options[usersddl.selectedIndex].value;

    var fxml = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='true'>";
    fxml += "<entity name='systemuser'>";
    fxml += "<attribute name='fullname' />";
    fxml += "<attribute name='systemuserid' />";
    fxml += "<order attribute='fullname' descending='false' />";
    fxml += "<link-entity name='systemuserroles' from='systemuserid' to='systemuserid' visible='false' intersect='true'>";
    fxml += "<link-entity name='role' from='roleid' to='roleid' alias='ac'>";
    fxml += "<filter type='and'>";
    fxml += "<condition attribute='roleid' operator='eq' value='" + sroleid + "' />";
    fxml += "</filter>";
    fxml += "</link-entity>";
    fxml += "</link-entity>";
    fxml += "</entity>";
    fxml += "</fetch>";
    fxml = "?fetchXml=" + encodeURIComponent(fxml);
    window.top["ENTITY_SET_NAMES"] = window.top["ENTITY_SET_NAMES"] || JSON.stringify({
        "systemuser": "systemusers",
        "role": "roles",
        "userquery": "userqueries"
    });


    Xrm.WebApi.retrieveMultipleRecords("systemuser", fxml).then(
        function success(result) {
            if (result != null && result.entities.length > 0) {
                var users = "";
                //for (var rolecount = 0; rolecount < result.entities.length; rolecount++) {
                //    users += result.entities[rolecount].fullname + "\n";
                //}
                //document.getElementById("userResult").innerText = users;
                for (var rolecount = 0; rolecount < result.entities.length; rolecount++) {
                    var optionText = result.entities[rolecount].fullname;
                    $("#userResult").append($("<option></option>").attr("value", result.entities[rolecount].systemuserid).text(optionText));
                }
            }
            else {
                $("#userResult").append($("<option></option>").attr("value", -1).text(Constants.MSG_NO_RECORS_FOUND));
            }
        },
        function (error) {
            //document.getElementById("userResult").innerText = error.message;
            $("#userResult").append($("<option></option>").attr("value", -1).text(this.error.message));
        }
    );
}
function getUsersViews() {
    debugger;
    $("#userviews").empty();
    var usersddl = document.getElementById("UsersPicklist0");
    var owner = usersddl.options[usersddl.selectedIndex].value;

    var fxml = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='true'>";
    fxml += "<entity name='userquery'>";
    fxml += "<attribute name='name'/>";
    fxml += "<attribute name='userqueryid'/>";
    fxml += "<attribute name='fetchxml'/>";
    fxml += "<order attribute='name' descending='false'/>";
    fxml += "<filter type='and'>";
    fxml += "<condition attribute='ownerid' operator='eq' value='" + owner + "'/>";
    fxml += "</filter>";
    fxml += "</entity>";
    fxml += "</fetch>";
    //fxml = "?fetchXml=" + encodeURIComponent(fxml);
    window.top["ENTITY_SET_NAMES"] = window.top["ENTITY_SET_NAMES"] || JSON.stringify({
        "systemuser": "systemusers",
        "role": "roles",
        "userquery": "userqueries"
    });

    var globalContext = Xrm.Utility.getGlobalContext();
    var clienturl = globalContext.getClientUrl();
    var req = new XMLHttpRequest();
    req.open("GET", clienturl + Constants.ODATA_ENDPOINT_VERSION + "userqueries?fetchXml=" + encodeURIComponent(fxml), true
    );
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("MSCRMCallerID", owner);

    req.onreadystatechange = function () {
        if (this.readyState === 4) {
            req.onreadystatechange = null;
            if (this.status === 200) {
                var results = JSON.parse(this.response);
                if (results != null && results.value.length > 0) {
                    for (var rolecount = 0; rolecount < results.value.length; rolecount++) {
                        var optionText = results.value[rolecount].name;
                        var fxml = results.value[rolecount].fetchxml;
                        var start = fxml.indexOf("entity name=") + 13;
                        var end = fxml.indexOf("\"", start);
                        var n = end - start;
                        var sbt = fxml.substr(start, n);
                        $("#userviews").append($("<option></option>").attr("value", results.value[rolecount].userqueryid).text(optionText + "  :" + sbt));
                    }
                }
                else {
                    $("#userviews").append($("<option></option>").attr("value", -1).text(Constants.MSG_NO_RECORS_FOUND));
                }
            } else {
                $("#userviews").append($("<option></option>").attr("value", -1).text(this.error.message));
            }
        }
    };
    req.send();
}
function getUsersViews2() {
    debugger;
    $("#userviews2").empty();
    var usersddl = document.getElementById("UsersPicklist2");
    var owner = usersddl.options[usersddl.selectedIndex].value;

    var fxml = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='true'>";
    fxml += "<entity name='userquery'>";
    fxml += "<attribute name='name' />";
    fxml += "<attribute name='userqueryid' />";
    fxml += "<attribute name='fetchxml'/>";
    fxml += "<order attribute='name' descending='false' />";
    fxml += "<filter type='and'>";
    fxml += "<condition attribute='ownerid' operator='eq' value='" + owner + "' />";
    fxml += "</filter>";
    fxml += "</entity>";
    fxml += "</fetch>";
    //fxml = "?fetchXml=" + encodeURIComponent(fxml);
    window.top["ENTITY_SET_NAMES"] = window.top["ENTITY_SET_NAMES"] || JSON.stringify({
        "systemuser": "systemusers",
        "role": "roles",
        "userquery": "userqueries"
    });

    var globalContext = Xrm.Utility.getGlobalContext();
    var clienturl = globalContext.getClientUrl();
    var req = new XMLHttpRequest();
    req.open("GET", clienturl + Constants.ODATA_ENDPOINT_VERSION + "userqueries?fetchXml=" + encodeURIComponent(fxml), true
    );
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("MSCRMCallerID", owner);

    req.onreadystatechange = function () {
        if (this.readyState === 4) {
            req.onreadystatechange = null;
            if (this.status === 200) {
                var results = JSON.parse(this.response);
                if (results != null && results.value.length > 0) {
                    for (var rolecount = 0; rolecount < results.value.length; rolecount++) {
                        var optionText = results.value[rolecount].name;
                        var fxml = results.value[rolecount].fetchxml;
                        var start = fxml.indexOf("entity name=") + 13;
                        var end = fxml.indexOf("\"", start);
                        var n = end - start;
                        var sbt = fxml.substr(start, n);
                        $("#userviews2").append($("<option></option>").attr("value", results.value[rolecount].userqueryid).text(optionText + "  :" + sbt));
                    }
                }
                else {
                    $("#userviews2").append($("<option></option>").attr("value", -1).text(Constants.MSG_NO_RECORS_FOUND));
                }
            } else {
                $("#userviews2").append($("<option></option>").attr("value", -1).text(this.error.message));
            }
        }
    };
    req.send();
}
function SwapUsers() {
    var ownerid = $("#UsersPicklist0").val();
    if (ownerid == null || ownerid == "") {
        showError("Please select source user.");
        return;
    }
    var Target = $("#UsersPicklist2").val();
    if (Target == null || Target == "") {
        showError("Please select Target user.");
        return;
    }
    //$("#UsersPicklist0").val(Target);
    //$("#UsersPicklist0 option[value='" + Target + "']").attr("selected", "selected");
    //$("#UsersPicklist2 option[value='" + ownerid + "']").attr("selected", "selected");
    var ddl1 = document.getElementById("UsersPicklist0");
    var ddl2 = document.getElementById("UsersPicklist2");
    ddl1.value = Target;
    ddl2.value = ownerid;
    getUsersViews();
    getUsersViews2();

}
function handleAssignDelete() {
    debugger;
    var ownerid = $("#UsersPicklist0").val();
    if (ownerid == null || ownerid == "") {
        showError("Please select a user to load views first.");
        return;
    }
    var viewselection = $("#userviews").val();
    if (viewselection.length > 0) {
        var radioValue = $("input[name='operation']:checked").val();
        if (radioValue == "assign") {

            var AssignToUserID = $("#UsersPicklist2").val();
            if (ownerid == AssignToUserID) {
                showError("Source and target user cannot be same ");
            }
            else if (AssignToUserID != null && AssignToUserID != "") {
                AssignViews(viewselection, ownerid, AssignToUserID);
            } else {
                showError("Please select target user to assing view(s) to. ");
            }

        } else if (radioValue == "delete") {
            var ownerid = $("#UsersPicklist0").val();
            if (ownerid != null && ownerid != "") {
                if (confirm("Are you sure you want to delete selected views?")) {
                    DeleteViews(viewselection, ownerid);
                }
            }

        } else { showError("please select an operation!"); }
    }
    else {
        showError("Please select view(s) first.");
    }
}

function AssignViews(views, owner, toUser) {
    var continu = true;
    $("#userMessages").text("Processing...");
    for (var i = 0; i < views.length; i++) {
        if (continu) {
            var odataurl = getContext().getClientUrl() + Constants.ODATA_ENDPOINT_VERSION + "userqueries(" + views[i] + ")";
            var record = { "ownerid@odata.bind": "/systemusers(" + toUser + ")" };
            var req = new XMLHttpRequest();
            req.open("PATCH", odataurl, true);
            req.setRequestHeader("Accept", "application/json");
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            req.setRequestHeader("MSCRMCallerID", owner);
            req.onreadystatechange = function () {
                if (this.readyState == 4 /* complete */) {
                    req.onreadystatechange = null;
                    if (this.status == 204) {
                        $("#userMessages").addClass('SuccessMessages');
                        $("#userMessages").text(Constants.MSG_ASSIGN_SUCCESS);
                        $("#userMessages").show().delay(2000).fadeOut("slow");
                        getUsersViews();
                        getUsersViews2();

                    }
                    else {
                        var error = JSON.parse(this.response).error;
                        showError(error.message);
                        continu = false;
                    }
                }
            };
            req.send(JSON.stringify(record));
        }
    }

}
function DeleteViews(views, ownerid) {
    var continu = true;
    $("#userMessages").text("Processing...");
    for (var i = 0; i < views.length; i++) {
        if (continu) {
            var odataurl = getContext().getClientUrl() + Constants.ODATA_ENDPOINT_VERSION + "userqueries(" + views[i] + ")";
            var req = new XMLHttpRequest();
            req.open("DELETE", odataurl, true);
            req.setRequestHeader("Accept", "application/json");
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            req.setRequestHeader("MSCRMCallerID", ownerid);
            req.onreadystatechange = function () {
                if (this.readyState == 4 /* complete */) {
                    req.onreadystatechange = null;
                    if (this.status == 204) {
                        getUsersViews();
                        $("#userMessages").addClass('SuccessMessages');
                        $("#userMessages").text(Constants.MSG_DELETE_SUCCESS);
                        $("#userMessages").show().delay(2000).fadeOut("slow");
                    }
                    else {
                        var error = JSON.parse(this.response).error;
                        showError(error.message);
                        continu = false;
                    }
                }
            };
            req.send();
        }
    }
}
function SelectDeselectAll() {
    if ($("#selectAlltoggle").is(":checked")) {
        $("#userviews > option").each(function () {
            $(this).attr("selected", "selected");
        });
    } else {
        $("#userviews > option").each(function () {
            $(this).attr("selected", null);
        });
    }

}

function getContext() {
    var result = null;
    if (typeof GetGlobalContext != "undefined") {
        result = GetGlobalContext();
    }
    else {
        if (typeof Xrm != "undefined") {
            result = Xrm.Page.context;
        }
        else {
            throw new Error("No Context");
        }
    }
    return result;
}
function showError(msg) {
    $("#userMessages").removeClass('SuccessMessages').addClass('ErrorMessages');
    $("#userMessages").text(msg);
    $("#userMessages").show().delay(2000).fadeOut("slow");
}