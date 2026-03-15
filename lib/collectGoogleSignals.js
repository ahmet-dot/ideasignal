export async function collectGoogleSignals(query) {
  try {
    if (!process.env.SERPER_API_KEY) return [];

    const res = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": process.env.SERPER_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: query,
        num: 5,
      }),
    });

    if (!res.ok) return [];

    const data = await res.json();
    const organic = data?.organic || [];

    return organic.slice(0, 5).map((item) => ({
      title: item.title || "",
      snippet: item.snippet || "",
      link: item.link || "",
    }));
  } catch {
    return [];
  }
}
