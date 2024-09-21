import { ApiPromise, ErrorResponse } from '@/types/api.types';
import { useCallback, useState } from 'react';

export const useApi = <T>() => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<ErrorResponse | null>(null);

    const callApi = useCallback(async (apiFunc: () => ApiPromise<T>): Promise<T | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiFunc();
            return response.data;
        } catch (err) {
            setError(err as ErrorResponse);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, error, callApi };
};