export async function games(search) {
  try {
    const url = `https://gamefaqs.gamespot.com/search?game=${search}`;
    const data = await checkCache(url);

    const dom = new JSDOM(data);
    const results = Array.from(dom.window.document.querySelectorAll('.search_result'));

    const games = [];
    results.forEach((r) => {
      const title = r.querySelector('.sr_name').textContent.trim();
      const [genre, year] = r.querySelector('.sr_info').textContent.split(', ');
      const platforms = r.querySelector('.meta.float_r').textContent.split(', ');
      const url = 'https://gamefaqs.gamespot.com' + r.querySelector('.log_search').getAttribute('href');
      const id = basename(url);

      const game = { title, genre, year: Number.parseInt(year), platforms, url, id };
      games.push(game);
    });

    return { items: games };
  } catch (err) {
    return { items: [], err };
  }
}
