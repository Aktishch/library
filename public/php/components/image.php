<?php
  function render_image($src, $format = null, $className = null, $data = null, $alt = null) {
    $loading = null;
    $source = null;

    if ($format === 'jpg'):
      $loading = 'lazy';
    elseif ($format === 'png'):
      $loading = 'eager';
    endif;

    if ($src === '#'):
      $source = '#';
    elseif ($src !== ''):
      $source = $src . '.' . $format;
    endif;
?>
  <img <?= $className ? 'class="' . $className . '"' : null ?> <?= $data ? $data : null ?> <?= $loading ? 'loading="' . $loading . '"' : null ?> <?= $source ? 'src="' . $source . '"' : null ?> draggable="false" <?= $alt ? 'alt="' . $alt . '"' : null ?> />
<?php } ?>