<?php $data = [
  'theme' => isset($_GET['theme']) ? $_GET['theme'] : null
]; ?>

<div><?= $data['theme'] ?></div>