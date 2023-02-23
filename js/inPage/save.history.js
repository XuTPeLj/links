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

  if (storage && typeof storage.get === 'function') {
    storage.get(
      {
        history: [],
      },
      options => {
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

        storage.set({
          history: options.history
        });

        storage.get(
          {
            history: [],
          },
          options_ => {
            const findNom = options_.history.findIndex(el => el.url === currentLink);
            if (findNom === -1) {
              options.history.splice(options.history.length - 1, 1);

              storage.set({
                history: options.history
              });
            }
          });
      }
    );
  }
})();
