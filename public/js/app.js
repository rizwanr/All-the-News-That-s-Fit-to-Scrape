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

  $(".note-btn").click(function (event) {
    event.preventDefault();
    const id = $(this).attr("data-id");
    $('#article-id').text(id);
    $('#save-note').attr('data', id);
    $.ajax(`/articles/${id}`, {
      type: "GET"
    }).then(function (data) {
      console.log(data)
      $('.articles-available').empty();
      if (data[0].note.length > 0) {
        data[0].note.forEach(v => {
          $('.articles-available').append($(`<li class='list-group-item'>${v.text}<button type='button' class='btn btn-danger btn-sm float-right btn-deletenote' data='${v._id}'>X</button></li>`));
        })
      }
      else {
        $('.articles-available').append($(`<li class='list-group-item'>No notes for this article yet</li>`));
        console.log("Second ran!")
      }
    })
    $('#note-modal').modal('toggle');
  });

  $(".save-note").click(function (event) {
    event.preventDefault();
    const id = $(this).attr('data-id');
    const noteText = $('#note-input').val().trim();
    console.log(noteText)
    $('#note-input').val('');
    $.ajax(`/article/${id}`, {
      type: "POST",
      data: { text: noteText }
    }).then(function (data) {
      console.log(data)
    })
    $('#note-modal').modal('toggle');
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