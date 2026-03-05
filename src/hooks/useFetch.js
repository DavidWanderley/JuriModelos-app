import { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "../components/Toast";
import logger from "../utils/logger";

export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(options.initialData || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get(url);
        setData(response.data);
        setError(null);
        logger.debug(`useFetch: Dados carregados com sucesso de ${url}`);
      } catch (err) {
        setError(err);
        logger.error(`useFetch: Erro ao carregar dados de ${url}`, err);
        if (!options.silent) {
          toast.error(options.errorMessage || "Erro ao carregar dados");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  const refetch = async () => {
    try {
      setLoading(true);
      const response = await api.get(url);
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err);
      if (!options.silent) {
        toast.error(options.errorMessage || "Erro ao carregar dados");
      }
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch, setData };
};
