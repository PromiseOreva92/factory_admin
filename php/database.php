<?php
include_once 'db.php';

class Database {

    private $pdo;
    
    
    public function __construct() {
        $dbc = new DBConnector();
        $this->pdo = $dbc->ConnectDB();
    }

    // Insert Data into tables
    public function insert($table, $data) {
        $keys = implode(', ', array_keys($data));
        $values = implode(', ', array_map(function($value) { return ":$value"; }, array_keys($data)));
        $sql = "INSERT INTO $table ($keys) VALUES ($values)";
        $stmt = $this->pdo->prepare($sql);
        foreach ($data as $key => $value) {
            $stmt->bindValue(":$key", $value);
        }
           return $stmt->execute();
    }
    
     // Insert into multiple tables
    public function insertT($tablesData) {
        try {
            $this->pdo->beginTransaction();
            foreach ($tablesData as $table => $data) {
                $keys = implode(', ', array_keys($data));
                $values = implode(', ', array_map(function($value) { return ":$value"; }, array_keys($data)));
                $sql = "INSERT INTO $table ($keys) VALUES ($values)";
                $stmt = $this->pdo->prepare($sql);
                foreach ($data as $key => $value) {
                    $stmt->bindValue(":$key", $value);
                }
                $stmt->execute();
            }
            $this->pdo->commit();
            return true;
        } catch(PDOException $e) {
            $this->pdo->rollBack();
            return false;
        }
    }

    public function update($table, $data, $where) {
        $set = implode(', ', array_map(function($key) { return "$key=:$key"; }, array_keys($data)));
        $sql = "UPDATE $table SET $set WHERE $where";
        $stmt = $this->pdo->prepare($sql);
        foreach ($data as $key => $value) {
            $stmt->bindValue(":$key", $value);
        }
        return $stmt->execute();
    }

    public function delete($table, $where) {
        $sql = "DELETE FROM $table WHERE $where";
        return $this->pdo->exec($sql);
    }

    public function select($table, $where = "", $fields = "*") {
        $sql = "SELECT $fields FROM $table";
        if (!empty($where)) {
            $sql .= " WHERE $where";
        }
        $stmt = $this->pdo->query($sql);
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }
    
   public function fetchPaginatedData($table, $page, $limit) {
        $start = ($page - 1) * $limit;
        
        $sql = "SELECT * FROM $table LIMIT :start, :limit";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':start', $start, PDO::PARAM_INT);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Getting total number of records
        $total = $this->pdo->query("SELECT COUNT(*) FROM $table")->fetchColumn();
        $totalPages = ceil($total / $limit);
       
        // Prepare data array
        return [
            'items' => $items,
            'totalPages' => $totalPages,
            'currentPage' => $page,
            'totalItems' => $total
        ]; 
    }
    
    public function fetchPaginatedDataFk($table, $page, $limit, $foreignKeyDetails = []) {
        $start = ($page - 1) * $limit;
        // Assume $foreignKeyDetails = ['foreignKey' => 'user_id', 'foreignTable' => 'users', 'replaceWith' => 'name', 'as' => 'userName']
    // $foreignKey = $foreignKeyDetails['foreignKey'];
    // $foreignTable = $foreignKeyDetails['foreignTable'];
    // $replaceWith = $foreignKeyDetails['replaceWith'];
    // $as = $foreignKeyDetails['as'];

    // Modify the SELECT part of the query to include the joined table's name column instead of the foreign key
    // $sql = "SELECT $table.*, $foreignTable.$replaceWith AS $as FROM $table 
    //         LEFT JOIN $foreignTable ON $table.$foreignKey = $foreignTable.id 
    //         LIMIT :start, :limit";
        
       $sql = "SELECT * FROM $table LIMIT :start, :limit";
        $stmt = $this->pdo->prepare($sql);
        $stmt->bindValue(':start', $start, PDO::PARAM_INT);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Getting total number of records
        $total = $this->pdo->query("SELECT COUNT(*) FROM $table")->fetchColumn();
        $totalPages = ceil($total / $limit);
       
        // Prepare data array
        return [
            'items' => $items,
            'totalPages' => $totalPages,
            'currentPage' => $page,
            'totalItems' => $total
        ]; 
    }
}

?>