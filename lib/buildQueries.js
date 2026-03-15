export function buildQueries(idea) {
  const cleanIdea = idea.trim();

  return {
    redditQuery: cleanIdea,
    googleQuery: `${cleanIdea} startup competitors market demand`,
    fundingQuery: `${cleanIdea} startup funding raised venture capital YC`,
  };
}
