import {useState, useCallback} from 'react';

export const useLoader = () => {
  const [loaderCount, setLoaderCount] = useState(0);
  const increaseLoader = useCallback(() => {
    setLoaderCount(prevState => prevState + 1);
  }, [setLoaderCount]);
  const decreaseLoader = useCallback(() => {
    setLoaderCount(prevState => Math.max(0, prevState - 1));
  }, [setLoaderCount]);
  return [loaderCount !== 0, increaseLoader, decreaseLoader];
};
