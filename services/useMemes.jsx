import { useState, useEffect } from "react";

const useMemes = () => {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchMemes = (page) => {
    setLoading(true);
    fetch(`https://memes-api.grye.org/memes/?page=${page}&limit=10`)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setMemes((prevMemes) => [...prevMemes, ...data]);
        } else {
          setHasMore(false);
        }
      })
      .catch((error) => console.error("Error fetching memes:", error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMemes(page);
  }, [page]);

  const loadMoreMemes = () => {
    if (hasMore && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return { memes, loading, loadMoreMemes };
};

export default useMemes;
