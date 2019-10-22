$(document).ready(function () {

  $(".get-articles").click(function(event){
    event.preventDefault();
    $.ajax(`/scrape`, {
        type: "GET"
      }).then(function () {
        location.reload();
      });
  })

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



  $(".saveNote").on("click",function () {
    event.preventDefault();
    var thisId = $(this).attr("data-id");
    const noteText = $("#noteText" + thisId).val();
    $.ajax(`/note/save/${thisId}`, {
      type: "POST",
      data: { text: $("#noteText" + thisId).val()}
    }).then(function (data) {
      console.log(data)
      $("#noteText" + thisId).val("");
      $('#noteModal'+thisId).modal('hide');
    })
  });

 

  $(".delete-btn").click(function (event) {
    event.preventDefault();
    //we get the data-id value from the button
    const id = $(this).attr("data-id");
    //we pass in the id from the data-attribute - we pass this to the server to change the saved value to true
    $.ajax(`/article/delete/${id
      }`, {
      type: "DELETE"
    }).then(function () {
      location.reload();
    });

  });

  $(".clear").click(function (event) {
    event.preventDefault();
    $.ajax("/articles/clear/", {
        type: "GET"
      }).then(function () {
        location.reload();
      });

  });


 

})