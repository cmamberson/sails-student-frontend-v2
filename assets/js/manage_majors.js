(function(){

  //function to delete record by settin id on form and then submitting the form
  //sets value of student id in hidden delete form and submits form
  //not completely ideal but wanted to take advantage of flash messages in sails
  $('#majorTable').DataTable( {
     dom: 'Bfrtip',
     buttons: [
         'copy', 'csv', 'excel', 'pdf', 'print'
       ],
     colReorder: true,
     "scrollX": true
     } );


  function deleteRecord(record_id){
    $("#deleteformMajor input[name=major_id]").val(record_id);
    $("#deleteformMajor").submit();
  }

  function getMajor(record_id){
    return $.get("http://localhost:1337/major/" + record_id, function(data){
      console.log("got major");
    })
  }

  $(function(){

    //initialize variables for items in the DOM we will work with
    let manageMajorForm = $("#manageMajorForm");
    let addMajorButton = $("#addMajorButton");

    //add student button functionality
    addMajorButton.click(function(){
      document.getElementById("manageMajorForm").reset();
      manageMajorForm.find("input[name=major_id]").val("");
      manageMajorForm.attr("action", "/create_major");
      manageMajorForm.dialog({

        title: "Add Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          "Submit": function() {
            //function to delete record
            manageMajorForm.submit()
          }
        }
      });
    })

  	$("#majorTable").on("click", "#editButtonMajor", function(e){
      let recordId = $(this).data("majorid")
      manageMajorForm.find("input[name=major_id]").val(recordId);
      manageMajorForm.attr("action", "/update_major");
      let major = getMajor(recordId);

      //populate form when api call is done (after we get student to edit)
      major.done(function(data){
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


      manageMajorForm.dialog({
        title: "Add Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          Submit: function() {
            manageMajorForm.submit()
          },
        }
      });
    })


    $("#majorTable").on("click", "#deleteButtonMajor", function(e){
      let recordId = $(this).data("majorid")
      $("#deleteConfirmMajor").dialog({
        title: "Confirm Delete",
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          "Delete Major": function() {
            //function to delete record
            deleteRecord(recordId);
          }
        }
      });
    })

  })

})();
