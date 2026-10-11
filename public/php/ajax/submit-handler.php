<?php
  $chat_id = 179128970;
  $message = '';
  $data = [
    'Форма:' => isset($_POST['theme']) ? $_POST['theme'] : null,
    'Имя:' => isset($_POST['name']) ? $_POST['name'] : null,
    'Телефон:' => isset($_POST['tel']) ? $_POST['tel'] : null
  ];

  function t_me($tgText, $chats_id = ['-xxx']) {
    $token = '5793846411:AAFCaqozitrr8qP9Bcmuh2GOhFubV9mX4F4';
    $site = $_SERVER['SERVER_NAME'];

    foreach ($chats_id as $chat) {
      $url = 'https://api.telegram.org/bot' . $token . '/sendMessage';
      $arrayQuery = [
        'chat_id' => $chat,
        'text' => $site . "\n" . $tgText,
        'parse_mode' => 'html'
      ];

      ob_start();
      $ch = curl_init();
      curl_setopt($ch, CURLOPT_URL, $url);
      curl_setopt($ch, CURLOPT_POST, 1);
      curl_setopt($ch, CURLOPT_TIMEOUT, 10);
      curl_setopt($ch, CURLOPT_POSTFIELDS, $arrayQuery);
      $res = curl_exec($ch);
      curl_close ($ch);
      ob_get_clean();
      return $res;
    }
  }

  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    foreach($data as $key => $value) {
      if (isset($value) && !empty($value)) {
        $message .= '<b>' . $key . '</b> ' . $value . "\n";
      }
    }

    echo json_encode(['status' => t_me($message, [$chat_id])]);
  }
?>