import { useEffect, useState } from 'react';

export function useApi(api, search) {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    if (search.length > 0) {
      setLoading(true);
      setError(undefined);
      setData(undefined);

      window.electronAPI[api](search)
        .then((res) => {
          setLoading(false);

          if (res.data) setData(res.data);
          if (res.error) setError({ message: res.error });
        })
        .catch((err) => {
          console.error(err);
          setError(err);
        });
    }
  }, [api, search]);

  return [data, loading, error];
}
