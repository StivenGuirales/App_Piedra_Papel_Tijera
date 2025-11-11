<?php
// CORS (para que el frontend pueda comunicarse)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Responder a peticiones OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Archivo donde se guardarán las estadísticas
$dataFile = '/var/www/html/data/stats.json';
$dataDir = dirname($dataFile);

// Crear directorio si no existe
if (!is_dir($dataDir)) {
    mkdir($dataDir, 0777, true);
}

// Crear archivo si no existe
if (!file_exists($dataFile)) {
    file_put_contents($dataFile, json_encode([]));
}

// Obtener la ruta de la petición
$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Remover el prefijo /api/ si existe
$path = str_replace('/api/', '', $requestUri);
$path = trim($path, '/');

// Dividir la ruta en partes
$pathParts = explode('/', $path);

// Rutas de la API
if ($pathParts[0] === 'stats' && isset($pathParts[1])) {
    $username = $pathParts[1];
    
    if ($requestMethod === 'GET') {
        // Obtener estadísticas de un usuario
        getStats($username, $dataFile);
    } elseif ($requestMethod === 'POST') {
        // Guardar estadísticas de un usuario
        saveStats($username, $dataFile);
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
    }
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Ruta no encontrada']);
}



function getStats($username, $dataFile) {
    $data = json_decode(file_get_contents($dataFile), true);
    
    if (isset($data[$username])) {
        echo json_encode($data[$username]);
    } else {
        // Si no existe, devolver estadísticas en 0
        echo json_encode([
            'wins' => 0,
            'losses' => 0,
            'ties' => 0
        ]);
    }
}

function saveStats($username, $dataFile) {
    // Leer datos actuales
    $data = json_decode(file_get_contents($dataFile), true);
    
    // Obtener datos del cuerpo de la petición
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Datos inválidos']);
        return;
    }
    
    // Guardar estadísticas
    $data[$username] = [
        'wins' => isset($input['wins']) ? (int)$input['wins'] : 0,
        'losses' => isset($input['losses']) ? (int)$input['losses'] : 0,
        'ties' => isset($input['ties']) ? (int)$input['ties'] : 0
    ];
    
    // Guardar en el archivo
    file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT));
    
    echo json_encode(['success' => true, 'data' => $data[$username]]);
}
?>