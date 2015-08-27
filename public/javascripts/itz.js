
$(document).ready(function () {
    $('#btnLogin').click(function () {
        //items.items.push({ 'url': $(this).find('.url').val(), 'name': $(this).find('.fieldname').val() });
        var items = [];
        items.push({ 'username': $('#txtusrname').val(), 'password': $('#txtpwd').val() });
        var admindetails = "{'MobNo:'" + $('#txtusrname').val() + "','Pwd:'" + $('#txtpwd').val() + "'}";
        callService('loginUser', items);
    });
});
function callService(method, inputparms) {
    //alert(JSON.stringify(inputparms));
    var baseurl = 'https://localhost:8000/';
    $.ajax({
        type: "POST",
        url: baseurl + method,
        contentType: "application/json",
        data: JSON.stringify(inputparms),
        dataType: "json",
        success: location.href = "https://localhost:8000/aa",
        error: AjaxFailed

    });
    function AjaxSucceeded(result) {
        
    }

    function AjaxFailed(result) {
        alert(result.status + ' ' + result.statusText);
    }
}