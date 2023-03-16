import { useEffect, useState } from 'react';

export function useApi(api, arg1, arg2) {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    if (arg1 && arg1.length > 0) {
      setLoading(true);
      setError(undefined);
      setData(undefined);

      window.electronAPI[api](arg1, arg2)
        .then((res) => {
          setLoading(false);

          if (res.data) setData(res.data);
          if (res.error) setError(res.error);
        })
        .catch((err) => {
          console.error(err);
          setError(err);
        });
    }
  }, [api, arg1, arg2]);

  return [data, loading, error];
}
