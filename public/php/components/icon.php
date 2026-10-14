<?php function render_icon($id, $className = null, $data = null) { ?>
  <svg <?= $className ? 'class="' . $className . '"' : null ?> <?= $data ? $data : null ?>>
    <use href="/img/icons.svg#<?= $id ?>"></use>
  </svg>
<?php } ?>