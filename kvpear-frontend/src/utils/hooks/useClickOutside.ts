import { useEffect, useRef } from 'react';

function useClickOutside(callback: () => void) {
  const ref = useRef<any>(null);

  const handleClickOutside = (event: any) => {
    if (ref.current && !ref.current.contains(event.target)) {
      console.log('You clicked outside of me!')
      callback();
    }
  };

  useEffect(() => {
    // Bind the event listener
    if (ref.current) {
      document.addEventListener('click', handleClickOutside);
      return () => {
        // Unbind the event listener on cleanup
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [callback]);

  return ref;
}

export default useClickOutside;
