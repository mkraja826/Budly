import { useEffect, useState } from 'react';
import { getActiveChildId } from './activeChildStore';

export function useActiveChildId() {
  const [childId, setChildId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void getActiveChildId()
      .then((id) => {
        if (active) setChildId(id);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { childId, loading };
}
