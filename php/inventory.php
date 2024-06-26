<?php
require_once 'database.php';

$db = new database();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  // Get `page` and `limit` from GET request
$page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
$limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 20;

  $foreignKeyDetails = [
    'foreignKey' => 'product_id', // Name of the foreign key column in the primary table
    'foreignTable' => 'production', // Name of the related table
    'replaceWith' => 'product',   // Name of the column in the related table to replace the foreign key
    'as' => 'product_name'         // Alias to use for the replaced column in the result set
];
    $pageData = $db->fetchPaginatedDataFk('inventories', $page, $limit, $foreignKeyDetails);
    $productData = $db->select('production');
    $arr = [
        "page_data" => $pageData,
        "product_data" => $productData
    ];
    
    // Return the result as JSON
header('Content-Type: application/json');
    echo json_encode($arr);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $product = $_POST['product'];
    $quantity = $_POST['quantity'];
    $price = $_POST['price'];
    $db->insert('inventories', [ 'product_id' => $product, 'quantity' => $quantity, 'price' => $price ]);
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