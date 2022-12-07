export async function searchGames(query) {
  const url = `https://gamefaqs.gamespot.com/search?game=${encodeURIComponent(query)}`;
  const data = await fetch(url).then((res) => res.text());

  return data;
}
