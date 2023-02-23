/*
На текущий момент - попробовал внедрить и пришлось сделать
Цель была: сразу показать поля и дать возможность фильтровать
Отключил кнопку инициализации
1) До Таблицы вставить класс
	<body +class="filter-block" +checked="checked">
2) В таблице вставить класс
  <table +class="table">
3) для появления полей
<thead>
  <tr>
    <td +field="num">Номер</td>
4) Что ищет
   Ищет по <tbody
 */
$(function () {
  const config = {
    // Кнопка для показа(генерации) фильтров
    /*
    false
    true
    'auto-start'
    */
    'Кнопка показа фильтров Вкл?': 'auto-start',
    'Кнопка показа фильтров': '.js-filter-action',
    // Блок=Таблица. Ко всех областям - добавляются фильтры и применяют к данным текущего блока
    'Таблица для фильтров': 'table.table:not(.not-filter),div.table',
    //-----[не заменнённые]----
    'Шапка для полей фильтров': 'thead>tr,.t1list-thead>.t1list-tr',
  };

  if (config['Кнопка показа фильтров Вкл?'] === true) {
    $(config['Кнопка показа фильтров']).click(function () {
      if ($(this).attr('checked')) {
        $(this).attr('checked', false)
          .removeClass('btn-default')
          .addClass('btn-success');
      } else {
        $(this).attr('checked', true)
          .reoveClass('btn-success')
          .addClass('btn-default');
      }
      add_filter(this);
    });
  }

  var $tr_new_all = $();
  var $th;
  var add_filter_ch = 1;

  function add_filter_inBlock() {
    var $main = $(this);console.log('[this]',this);
    var $table = $main.find(config['Таблица для фильтров']).eq(0);console.log('[$table]', $table.get(0));
    if ($table.attr('filter-create')) return;
    $table.attr('filter-create', true);
    var H_tr = $table.find('thead>tr,.t1list-thead>.t1list-tr').get(0);
    var $H_tr = $(H_tr);console.log('[H_tr]',H_tr);

    var s = '';
    var ss = '<td><input type="search" class="find-td" style="width: 100%"></td>';
    var ssdn = '<td class="dn"><input type="search" class="find-td" style="width: 100%"></td>';

    for (var i in H_tr.children) {
      if (isNaN(i)) break;
      if ($(H_tr.children[i]).attr('field')) {
        if ($(H_tr.children[i]).hasClass('dn')) {
          s += ssdn;
        } else {
          s += ss;
        }

      } else {
        s += '<td></td>';
      }
    }
    if (s) {

      $tr_new = $('<tr>' + s + '</tr>');
      $tr_new.css('align', 'center');
      $tr_new.insertAfter($H_tr);
      $tr_new.find('input').on('input', hide_find);
      $tr_new_all = $tr_new_all.add($tr_new);
    }
  }

  function add_filter(th) {
    if (add_filter_ch) {
      $th = $(th);
      add_filter_ch = 0;
      var $main = $('.filter-block').each(add_filter_inBlock);
    }
    if ($th.attr('checked')) {
      $tr_new_all.css('display', '');
    } else {
      $tr_new_all.css('display', 'none');
    }
  }

  function select_rows(th, n) {
    if (th.parentElement.children[0].size == n)
      th.parentElement.children[0].size = 0;
    else th.parentElement.children[0].size = n;
  }

  function closest_table(th) {
    if (!th) return false;
    if (th.nodeName == 'THEAD') return false;
    if (th.nodeName == 'TBODY') return th;
    var thc = th.children, r;
    for (var i in thc) {
      if (isNaN(i)) break;
      if (r = closest_table(thc[i])) return r;
      ;
    }
    return false;
  }

  (function () {
    var array_table = {
      BODY: 1,
      TBODY: 1,
      TABLE: 1,
    };
    window.parent_table = function (th) {
      return array_table[th.nodeName] ? th : parent_table(th.parentElement);
    }
  })();

  function find_tbody(th) {
    return closest_table(parent_table(th));
  }

  function hide_find() {
    var th = this;
    var pa = find_tbody(th);
    var find_td = th.parentElement.parentElement.children;
    var find = {};
    var i;
    var v;
    for (i in find_td) {
      if (isNaN(i)) break;
      v = find_td[i].querySelector('input.find-td');
      if (!v) continue;
      v = v.value.toLowerCase();
      if (v) {
        find[i] = v;
      }
    }

    var len = pa.children.length;
    var row;
    var n;
    var j;

    for (i = 0; i < len; i++) {
      row = pa.children[i];
      if (row.className.indexOf('non-filter') != -1) continue;
      n = 0;
      for (j in find) {
        v = find[j];

        if (
          (
            $(row.children[j])
              .text()
            +
            $(row.children[j])
              .find('input:not([type=checkbox]),textarea')
              .val()
            +
            ($(row.children[j])
              .find('input[type=checkbox]')
              .prop("checked") ? 1 : 0)
          ).toLowerCase().indexOf(v) != -1) {

        } else {

          row.style.display = 'none';
          n++;
          break;
        }
      }
      if (!n)
        row.style.display = '';
    }
  }

  if (config['Кнопка показа фильтров Вкл?'] === 'auto-start') {
    add_filter($('.filter-block'));
  }
});
