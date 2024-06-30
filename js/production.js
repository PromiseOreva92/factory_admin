    // Call functions
    $(document).ready(function() {

        var currentPage = 1;
        var pageSize = 20; // Number of items per page
    // Initial data load
       fetchPaginatedData(currentPage, pageSize);
       

 // Fetch Page with Pagination
 function fetchPaginatedData(page, limit) {
     $.ajax({
         url: 'php/production.php',
         type: 'GET',
         data: { page: page, limit: limit},
         dataType: 'json',
         success: function(response) {
            // console.log(response.material_data)
             displayData(response.page_data.items,response.product_data,response.material_data);
             renderPagination(response.page_data.totalPages);
             fetchMaterials(response.material_data)
             fetchProducts(response.product_data) 
          // updatePaginationControls(response.page, response.totalPages);
             
          //   updatePaginationControls(1, 10);
         },
         error: function(xhr, status, error) {
             console.error(xhr.responseText);
         }
     });
 }

 function fetchMaterials(items) {
    var selectEl = $('#material_list');
    selectEl.empty(); // Clear existing data
    $.each(items, function(index, item) {
        var option = '<option value="'+item.id+'">';
        option += item.name + '</option>';
        selectEl.append(option);
    });
}

function fetchProducts(items) {
    var selectEl = $('#product_list');
    selectEl.empty(); // Clear existing data
    $.each(items, function(index, item) {
        var option = '<option value="'+item.id+'">';
        option += item.name + '</option>';
        selectEl.append(option);
    });
}


function hasValue(obj, value) {
    console.log(obj)
    for (let key in obj) {
        if (obj[key]["id"] === value) {
            
            // return true;
            return obj[key]["name"];
        }
    }
    return "Not Available";
}
 
 // Display data on Table
 function displayData(items,products,materials) {
     var tableBody = $('#tableBody');
     tableBody.empty(); // Clear existing data

     $.each(items, function(index, item) {
         var row = '<tr>';
         row += '<td>' + item.id + '</td>';
         row += '<td>' + hasValue(materials,item.material_id)  + '</td>';
         row += '<td>' + hasValue(products,item.product_id) + '</td>';
         row += '<td>' + item.input_tonnage + '</td>';
         row += '<td>' + item.output_tonnage + '</td>';
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
     var material_id = $('#material_list').val().trim();
     var product_id = $('#product_list').val().trim();
     var input_tonnage = $('#input_tonnage').val().trim();
     var output_tonnage = $('#output_tonnage').val().trim();
     $.ajax({
         url: 'php/production.php',
         type: 'POST',
         data: { material_id: material_id, product_id: product_id, input_tonnage: input_tonnage, output_tonnage: output_tonnage},
         success: function() {
             $('#addModal').css('display', 'none');
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
     var id = selectedRow.find("td:eq(0)").text(); 
     var input_tonnage = selectedRow.find("td:eq(3)").text(); 
     var output_tonnage = selectedRow.find("td:eq(4)").text(); 
     $('#updateModal #id').val(id);
     $('#updateModal #input_tonnage').val(input_tonnage);
     $('#updateModal #output_tonnage').val(output_tonnage);
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
     var input_tonnage = $('#updateModal #input_tonnage').val();
     var output_tonnage = $('#updateModal #output_tonnage').val();
     // Perform AJAX request to update user data
         $.ajax({
         url: 'php/production.php',
         type: 'PUT',
         data: { id: id, input_tonnage: input_tonnage, output_tonnage: output_tonnage },
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
     
    var id = selectedRow.find("td:eq(0)").text(); 
     
     if (confirm('Are you sure you want to delete this Production?')) {
         // Perform your AJAX request to delete the user
           $.ajax({
             url: 'php/production.php',
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