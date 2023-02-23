// Chrome and Opera do not support browser. http://stackoverflow.com/a/37646525/1902598
const _browser = this._browser || this.browser || this.chrome;
const storage = _browser.storage.local;


function formatDate(dateStr) {
  if (typeof dateStr !== 'string') return '';
  const [yearIndex, monthIndex, dayIndex] = [0, 1, 2];
  textMonth = [
    'янв',
    'фев',
    'мар',
    'апр',
    'май',
    'июн',
    'июл',
    'авг',
    'сен',
    'окт',
    'ноя',
    'дек',
  ];
  const textWeek = [
    'вс',
    'пн',
    'вт',
    'ср',
    'че',
    'пя',
    'су',
  ];
  const partsDate = dateStr.split('-');
  const date = new Date(...partsDate);
console.log('[]',textMonth[partsDate[monthIndex]],partsDate[monthIndex], monthIndex);
  return [
    `[${textWeek[date.getDay()]}]`,
    partsDate[+dayIndex],
    textMonth[+partsDate[monthIndex]],
  ].join(' ');
}

const renderDialog = () => {
	storage.get(
		{
			history: [],
		},
		options => {
      const divListTasks = document.querySelector('.quiji-list');
      console.log('[divListTasks]', divListTasks);
      var a=1;
      divListTasks.innerHTML = options.history.map(task=>`
<tr>
  <td class="text title" title="${unescape(task.title)}">
    ${task.title}
  </td>
  <td class="text">
    ${formatDate(task.date)}
  </td>
  <td>
    ${task.count}
  </td>
  <td class="text">
    <a href="${task.url}" target="_blank">
      ${task.url}
    </a>
  </td>
</tr>
`).join('');

		}
	);
};

document.addEventListener('DOMContentLoaded', () => {
	renderDialog();
});

