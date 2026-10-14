<?php
  $data = [
    'title' => 'Title',
    'status' => true
  ];

  require_once $_SERVER['DOCUMENT_ROOT'] . '/components/icon.php';

  ob_start();
?>

<?php $items = [1, 2, 3, 4]; ?>

<?php if ($data['status']): ?>
  <div>true</div>
<?php elseif ($data['status'] === null): ?>
  <div>null</div>
<?php else: ?>
  <div>false</div>
<?php endif; ?>

<?php for ($i = 0; $i < count($items); $i++): ?>
  <?php $item = $items[$i]; ?>
  <div><?= $item ?></div>
<?php endfor; ?>

<?php foreach ($items as $key => $item): ?>
  <div><?= $key ?></div>
<?php endforeach; ?>

<a href="/dialogs/feedback.php?<?= http_build_query(['theme' => $data['title']]) ?>">link</a>

<?php render_icon(id: 'icon', className: 'icon'); ?>

<form action="/ajax/submit-handler.php" method="POST">
  <input type="hidden" value="Тема" name="theme">
  <button type="submit">btn</button>
</form>

<?php
  $content = ob_get_clean();
  require_once $_SERVER['DOCUMENT_ROOT'] . '/layouts/base.php';
?>