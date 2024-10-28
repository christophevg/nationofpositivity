function notify_error(response) {
  var msg = response.responseJSON.message;
  app.$notify({
    group: "notifications",
    title: "Whoops...",
    text:  "Daar ging iets mis :-(<br><br>\n" + msg,
    type:  "error",
    duration: 10000
  });
}

function put(resource, data, success, error) {
  $.ajax( {
    url: resource,
    type: "PUT",
    data: JSON.stringify(data),
    dataType: "json",
    contentType: "application/json",
    success: success,
    error: function(response) {
      notify_error(response);
      if(error) { error(response); }
    }
  });
}

function patch(resource, data, success, error) {
  $.ajax( {
    url: resource,
    type: "PATCH",
    data: JSON.stringify(data),
    dataType: "json",
    contentType: "application/json",
    success: success,
    error: function(response) {
      notify_error(response);
      if(error) { error(response); }
    }
  });
}
function post(resource, data, success, error) {
  $.ajax( {
    url: resource,
    type: "POST",
    data: JSON.stringify(data),
    dataType: "json",
    contentType: "application/json",
    success: success,
    error: function(response) {
      notify_error(response);
      if(error) { error(response); }
    }
  });
}
