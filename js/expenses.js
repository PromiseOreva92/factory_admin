    // Call functions
    $(document).ready(function() {

        var currentPage = 1;
        var pageSize = 20; // Number of items per page
    // Initial data load
       fetchPaginatedData(currentPage, pageSize);
       

 // Fetch Page with Pagination
 function fetchPaginatedData(page, limit) {
     $.ajax({
         url: 'php/expenses.php',
         type: 'GET',
          data: { page: page, limit: limit},
         dataType: 'json',
         success: function(response) {
            console.log(response)
             displayData(response.items);
             renderPagination(response.totalPages);
          // updatePaginationControls(response.page, response.totalPages);
             
          //   updatePaginationControls(1, 10);
         },
         error: function(xhr, status, error) {
             console.error(xhr.responseText);
         }
     });
 }
 
 // Display data on Table
 function displayData(items) {
     var tableBody = $('#tableBody');
     tableBody.empty(); // Clear existing data

     $.each(items, function(index, item) {
         var row = '<tr>';
         row += '<td>' + item.id + '</td>';
         row += '<td>' + item.purpose + '</td>';
         row += '<td>' + item.amount + '</td>';
         row += '</tr>';
         tableBody.append(row);
     });
 }

// Render Pagnation
 function renderPagination(totalPages) {
 var pagination = $('#pagination');
 pagination.empty(); // Clear existing pagination controls

 var startPage = 1;
 var endPage = Math.min(totalPages, 10); // Limit to 10 visible pages

 // Previous link
 var prevLink = $('<a>').addClass('page-link').text('Previous');
 prevLink.click(function() {
     if (currentPage > 1) {
         currentPage--;
         renderPagination(totalPages); // Re-render pagination
         fetchPaginatedData(currentPage, pageSize);
     }
 });
 pagination.append(prevLink);

 for (var i = startPage; i <= endPage; i++) {
     var pageLink = $('<a>').addClass('page-link').text(i);
     
     // Add active class to the current page
     if (i === currentPage) {
         pageLink.addClass('active');
     }

     pageLink.click(function() {
         currentPage = parseInt($(this).text());
         renderPagination(totalPages); // Re-render pagination
         fetchPaginatedData(currentPage, pageSize);
     });
     pagination.append(pageLink);
 }

 // Next link
 var nextLink = $('<a>').addClass('page-link').text('Next');
 nextLink.click(function() {
     if (currentPage < totalPages) {
         currentPage++;
         renderPagination(totalPages); // Re-render pagination
         fetchPaginatedData(currentPage, pageSize);
     }
 });
 pagination.append(nextLink);
}

// Show modal when "Add" button is clicked
 $('#addButton').click(function() {
     $('#addModal').css('display', 'block');
 });

 // Close the modal when close button is clicked
 $('.btn-close').click(function() {
    // $('#myModal').css('display', 'none');
    $('#addModal').hide();
    
 });

 // Add new user when form is submitted
 $('#addForm').submit(function(e) {
     e.preventDefault();
     var purpose = $('#purpose').val().trim();
     var amount = $('#amount').val().trim();
     $.ajax({
         url: 'php/expenses.php',
         type: 'POST',
         data: { purpose: purpose, amount: amount },
         success: function() {

             $('#addModal').css('display', 'none');
            //  console.log(response)
             fetchPaginatedData(currentPage, pageSize);
         }
     });
 });


 // Row click event to toggle selection
 var selectedRow = null;
$('#myTable tbody').on('click', 'tr', function() {
     if(selectedRow){
         selectedRow.removeClass('selected');
     }
     selectedRow = $(this);
     selectedRow.addClass('selected');
 });

 // Update button click event to open the modal
 $('#updateButton').click(function() {
     if (!selectedRow) {
       alert('Please select a LGA to update.');
     }
     
     var Id = selectedRow.find("td:eq(0)").text(); 
     var Name = selectedRow.find("td:eq(1)").text(); 
     var StataId = selectedRow.find("td:eq(2)").text(); 
     $('#updateModal #Id').val(Id);
     $('#updateModal #Name').val(Name);
     $('#updateModal #StateId').val(state_Id);
     $('#updateModal').show();
    
 });
 // Close modal
 $('.btn-close').click(function() {
     $('#updateModal').hide();
 });

 // Form submission for update
 $('#updateForm').submit(function(e) {
     e.preventDefault();
     var Id = $('#updateModal #Id').val();
     var Name = $('#updateModal #Name').val();
     var StateId = $('#updateModal #StateId').val();
     // Perform AJAX request to update user data
         $.ajax({
         url: 'php/expenses.php',
         type: 'PUT',
         data: { id: Id, name: Name, state_Id: state_Id },
         success: function() {
            $('#updateModal').hide();
            fetchPaginatedData(currentPage, pageSize); 
         }
     });
 });

  // Delete button click event
 $('#deleteButton').click(function() {
     if(!selectedRow){
         alert('Please select a user to delete.');
         return;
     }
     
    var userId = selectedRow.find("td:eq(0)").text(); 
     
     if (confirm('Are you sure you want to delete this LGA?')) {
         // Perform your AJAX request to delete the user
           $.ajax({
             url: 'php/expenses.php',
             type: 'DELETE',
             data: { id: Id },
             success: function() {
                 fetchPaginatedData(currentPage, pageSize);
             }
         }); 

         // Assuming deletion is successful, remove the row
         selectedRow.remove();
         selectedRow = null; // Reset selection
     }
 });
 
}); 