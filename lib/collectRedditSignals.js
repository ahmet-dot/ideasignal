export async function collectRedditSignals(query) {
  try {
    const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&limit=5&sort=relevance`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "IdeaSignal/1.0"
      }
    });

    if (!res.ok) return [];

    const data = await res.json();
    const posts = data?.data?.children || [];

    return posts
      .map((item) => {
        const p = item?.data;
        if (!p?.title) return null;

        return {
          title: p.title,
          subreddit: p.subreddit_name_prefixed || "",
          url: p.permalink ? `https://www.reddit.com${p.permalink}` : "",
        };
      })
      .filter(Boolean)
      .slice(0, 5);
  } catch {
    return [];
  }
}
