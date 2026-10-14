<?php function render_picture($name, $className = null, $data = null, $media = 576, $alt = null) { ?>
  <picture>
    <source data-srcset="/img/pictures/<?= $name ?>-bg-desktop.jpg" media="(min-width: <?= $media ?>px)" />
    <img <?= $className ? 'class="' . $className . '"' : null ?> <?= $data ? $data : null ?> data-lazy data-src="/img/pictures/<?= $name ?>-bg-mobile.jpg" src="#" draggable="false" <?= $alt ? 'alt="' . $alt . '"' : null ?> />
  </picture>
<?php } ?>