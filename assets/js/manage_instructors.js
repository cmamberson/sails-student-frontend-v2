(function(){

  //function to delete record by settin id on form and then submitting the form
  //sets value of student id in hidden delete form and submits form
  //not completely ideal but wanted to take advantage of flash messages in sails
  $('#instructorTable').DataTable( {
     dom: 'Bfrtip',
     buttons: [
         'copy', 'csv', 'excel', 'pdf', 'print'
       ],
     colReorder: true,
     "scrollX": true
     } );


  function deleteRecord(record_id){
    $("#deleteformInstructor input[name=instructor_id]").val(record_id);
    $("#deleteformInstructor").submit();
  }

  function getInstructor(record_id){
    return $.get("http://localhost:1337/instructor/" + record_id, function(data){
      console.log("got instructor");
    })
  }

  $(function(){

    //initialize variables for items in the DOM we will work with
    let manageInstructorForm = $("#manageInstructorForm");
    let addInstructorButton = $("#addInstructorButton");

    //add student button functionality
    addInstructorButton.click(function(){
      document.getElementById("manageInstructorForm").reset();
      manageInstructorForm.find("input[name=instructor_id]").val("");
      manageInstructorForm.attr("action", "/create_instructor");
      manageInstructorForm.dialog({

        title: "Add Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          "Submit": function() {
            //function to delete record
            manageInstructorForm.submit()
          }
        }
      });
    })

  	$("#instructorTable").on("click", "#editButtonInstructor", function(e){
      let recordId = $(this).data("instructorid")
      manageInstructorForm.find("input[name=instructor_id]").val(recordId);
      manageInstructorForm.attr("action", "/update_instructor");
      let instructor = getInstructor(recordId);

      //populate form when api call is done (after we get student to edit)
      instructor.done(function(data){
        $.each(data, function(name, val){
            var $el = $('[name="'+name+'"]'),
                type = $el.attr('type');

            switch(type){
                case 'checkbox':
                    $el.attr('checked', 'checked');
                    break;
                case 'radio':
                    $el.filter('[value="'+val+'"]').attr('checked', 'checked');
                    break;
                default:
                    $el.val(val);
            }
        });
      })


      manageInstructorForm.dialog({
        title: "Add Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          Submit: function() {
            manageInstructorForm.submit()
          },
        }
      });
    })


    $("#instructorTable").on("click", "#deleteButtonInstructor", function(e){
      let recordId = $(this).data("instructorid")
      $("#deleteConfirmInstructor").dialog({
        title: "Confirm Delete",
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          "Delete Instructor": function() {
            //function to delete record
            deleteRecord(recordId);
          }
        }
      });
    })

  })

})();
