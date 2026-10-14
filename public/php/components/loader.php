<?php require_once $_SERVER['DOCUMENT_ROOT'] . '/components/icon.php'; ?>

<?php function render_loader($className = null, $data = 'data-loader') { ?>
  <div class="loader <?= $className ? $className : null ?>" <?= $data ? $data : null ?>>
    <span class="loader-progress">
      <?php render_icon(id: 'loader', className: 'loader-icon icon'); ?>
    </span>
  </div>
<?php } ?>