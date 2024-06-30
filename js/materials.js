    // Call functions
    $(document).ready(function() {

        var currentPage = 1;
        var pageSize = 20; // Number of items per page
    // Initial data load
       fetchPaginatedData(currentPage, pageSize);
       

 // Fetch Page with Pagination
 function fetchPaginatedData(page, limit) {
     $.ajax({
         url: 'php/materials.php',
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
         row += '<td>' + item.name + '</td>';
         row += '<td>' + item.price + '</td>';
         row += '<td>' + item.quantity + '</td>';
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
     var name = $('#name').val().trim();
     var price = $('#price').val().trim();
     var amount = $('#amount').val().trim();
     var quantity = $('#quantity').val().trim();
     $.ajax({
         url: 'php/materials.php',
         type: 'POST',
         data: { name: name, price: price, amount: amount, quantity:quantity },
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
       alert('Please select a Material to update.');
     }
     
     var id = selectedRow.find("td:eq(0)").text(); 
     var name = selectedRow.find("td:eq(1)").text(); 
     var price = selectedRow.find("td:eq(2)").text(); 
     var quantity = selectedRow.find("td:eq(3)").text(); 
     var amount = selectedRow.find("td:eq(4)").text(); 

     $('#updateModal #id').val(id);
     $('#updateModal #name').val(name);
     $('#updateModal #price').val(price);
     $('#updateModal #quantity').val(quantity);
     $('#updateModal #amount').val(amount);
     $('#updateModal').show();
    
 });
 // Close modal
 $('.btn-close').click(function() {
     $('#updateModal').hide();
 });

 // Form submission for update
 $('#updateForm').submit(function(e) {
     e.preventDefault();
     var id = $('#updateModal #id').val();
     var name = $('#updateModal #name').val();
     var price = $('#updateModal #price').val();
     var quantity = $('#updateModal #quantity').val();
     var amount = $('#updateModal #amount').val();
     // Perform AJAX request to update user data
         $.ajax({
         url: 'php/materials.php',
         type: 'PUT',
         data: { id: id, name: name, price: price, amount: amount, quantity:quantity },
         success: function(response) {
            console.log(response);
            $('#updateModal').hide();
            fetchPaginatedData(currentPage, pageSize); 
         }
     });
 });

  // Delete button click event
 $('#deleteButton').click(function() {
     if(!selectedRow){
         alert('Please select a Material to delete.');
         return;
     }
     
    var id = selectedRow.find("td:eq(0)").text(); 
     
     if (confirm('Are you sure you want to delete this Material?')) {
         // Perform your AJAX request to delete the user
           $.ajax({
             url: 'php/materials.php',
             type: 'DELETE',
             data: { id: id },
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