import { useState, useEffect } from "react";
import { Astronaut } from "../types";

interface FetchData {
  data: Astronaut[] | null;
  loading: boolean;
  error: Error | null;
}

export const useFetchAtronauts = (url: string): FetchData => {
  const [data, setData] = useState<Astronaut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        const data = await response.json();
        setData(data);
      } catch (err) {
        setError(new Error(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};
