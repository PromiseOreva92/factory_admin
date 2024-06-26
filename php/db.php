<?php

class DBConnector{

    public function ConnectDB(){
        $servername = "localhost";
        $username = "root";
        $password = "";
        $dbname = "industry";

        // // Create connection
        // $conn = new mysqli($servername, $username, $password, $dbname);

        // // Check connection
        // if ($conn->connect_error) {
        //     die("Connection failed: " . $conn->connect_error);
        // }
        // echo "Connected successfully";

        // Close the connection
        // $conn->close();


        $dsn = "mysql:host=$servername;dbname=$dbname";
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, // Enable exceptions
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, // Set default fetch mode to associative array
            PDO::ATTR_EMULATE_PREPARES => false, // Disable emulation of prepared statements
        ];
        
        $conn = new PDO($dsn, $username, $password, $options);

        return $conn;

    }
}