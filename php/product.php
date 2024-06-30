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
    $pageData = $db->fetchPaginatedDataFk('products', $page, $limit);
    
    // Return the result as JSON
header('Content-Type: application/json');
    echo json_encode($pageData);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $product = $_POST['product'];
    $db->insert('products', ['name' => $product]);
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    parse_str(file_get_contents("php://input"), $_PUT);
    $id = $_PUT['id'];
    $name = $_PUT['name'];
    $stateId = $_PUT['StateId'];
    $db->update('lga', ['name' => $name, 'State_Id' => $stateId], "id = $id");
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str(file_get_contents("php://input"), $_DELETE); 
    $id = $_DELETE['id'];
    $db->delete('lga', "id = $id");
}
?>