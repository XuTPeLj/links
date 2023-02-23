(() => {

  const _browser = this._browser || this.browser || this.chrome;
  const storage = _browser.storage.local;

  function getTitle() {
    let title = '';
    if (title = $('h1').text().trim())
      return title;
    if (title = document.title)
      return title;

  }

  console.log('[storage]', storage);
  if (storage && typeof storage.get === 'function') {
    console.log('[storage.get]', storage.get);
    storage.get(
      {
        history: [],
      },
      options => {
        console.log('[options]', options.history);
        // options.history = [];
        const currentLink = window.location.href;
        const findNom = options.history.findIndex(el => el.url === currentLink);
        if (findNom !== -1) {
          const findElement = options.history[findNom];
          options.history.splice(findNom, 1);
          options.history.unshift(findElement);

          findElement.count += 1;
          findElement.date = (date =>
              ['getFullYear', 'getMonth', 'getDate'].map(method => date[method]()).map(a => a < 10 ? `0${a}` : a).join('-')
          )(new Date());

          findElement.title = getTitle();
        } else {
          options.history.unshift({
            url: currentLink,
            // id: m[2],
            title: getTitle(),
            date: (date =>
                ['getFullYear', 'getMonth', 'getDate'].map(method => date[method]()).map(a => a < 10 ? `0${a}` : a).join('-')
            )(new Date()),
            count: 1,
          });
        }
        console.log('[options.history]', options.history);
        storage.set({
          history: options.history
        });
      }
    );
  }
})();
