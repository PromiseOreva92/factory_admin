<?php
require_once 'database.php';

$db = new database();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  // Get `page` and `limit` from GET request
$page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
$limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 20;

  $foreignKeyDetails = [
    'foreignKey' => 'material_id', // Name of the foreign key column in the primary table
    'foreignTable' => 'materials', // Name of the related table
    'replaceWith' => 'name',   // Name of the column in the related table to replace the foreign key
    'as' => 'material_name'         // Alias to use for the replaced column in the result set
];
    $pageData = $db->fetchPaginatedDataFk('production', $page, $limit, $foreignKeyDetails);
    $materialsData = $db->select('materials');
    $productsData = $db->select('products');
    $arr = [
        "page_data" => $pageData,
        "material_data" => $materialsData,
        "product_data" => $productsData
    ];
    
    // Return the result as JSON
header('Content-Type: application/json');
    echo json_encode($arr);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $material_id = $_POST['material_id'];
    $product_id = $_POST['product_id'];
    $input_tonnage = $_POST['input_tonnage'];
    $output_tonnage = $_POST['output_tonnage'];
    $db->insert('production', ['material_id' => $material_id, 'product_id' => $product_id, 'input_tonnage' => $input_tonnage, 'output_tonnage' => $output_tonnage, ]);
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    parse_str(file_get_contents("php://input"), $_PUT);
    $id = $_PUT['id'];
    $input_tonnage = $_PUT['input_tonnage'];
    $output_tonnage = $_PUT['output_tonnage'];
    $db->update('production', ['input_tonnage' => $input_tonnage, 'output_tonnage' => $output_tonnage], "id = $id");
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str(file_get_contents("php://input"), $_DELETE); 
    $id = $_DELETE['id'];
    $db->delete('production', "id = $id");
}
?>