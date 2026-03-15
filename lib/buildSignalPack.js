export function buildSignalPack({ redditResults = [], googleResults = [] }) {
  const redditSignals = redditResults.map((item) => {
    const parts = [];
    if (item.title) parts.push(item.title);
    if (item.subreddit) parts.push(`(${item.subreddit})`);
    return parts.join(" ");
  });

  const googleSignals = googleResults.map((item) => {
    const parts = [];
    if (item.title) parts.push(item.title);
    if (item.snippet) parts.push(`— ${item.snippet}`);
    return parts.join(" ");
  });

  const fundingHints = googleResults
    .filter((item) => {
      const text = `${item.title} ${item.snippet}`.toLowerCase();
      return (
        text.includes("raised") ||
        text.includes("series a") ||
        text.includes("series b") ||
        text.includes("seed round") ||
        text.includes("funding") ||
        text.includes("venture")
      );
    })
    .map((item) => `${item.title}${item.snippet ? ` — ${item.snippet}` : ""}`)
    .slice(0, 3);

  return {
    redditSignals,
    googleSignals,
    fundingHints,
  };
}
