$(document).ready(function () {

  $(".save-btn").click(function (event) {
    event.preventDefault();
    //we get the data-id value from the button
    const id = $(this).attr("data-id");
    //we pass in the id from the data-attribute - we pass this to the server to change the saved value to true
    $.ajax(`/articles/save/${id
    }`, {
      type: "PUT"
    }).then(function () {
      location.reload();
    });

  });

  $(".delete-btn").click(function (event) {
    event.preventDefault();
    //we get the data-id value from the button
    const id = $(this).attr("data-id");
    //we pass in the id from the data-attribute - we pass this to the server to change the saved value to true
    $.ajax(`/articles/delete/${id
      }`, {
      type: "DELETE"
    }).then(function () {
      location.reload();
    });

  });

})