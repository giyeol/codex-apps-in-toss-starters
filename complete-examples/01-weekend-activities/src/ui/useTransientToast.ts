import { useCallback, useEffect, useRef, useState } from "react";

export function useTransientToast(duration = 2_000) {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setMessage(null);
  }, []);

  const show = useCallback(
    (nextMessage: string) => {
      if (timer.current) clearTimeout(timer.current);
      setMessage(nextMessage);
      timer.current = setTimeout(() => {
        timer.current = null;
        setMessage(null);
      }, duration);
    },
    [duration],
  );

  useEffect(() => clear, [clear]);

  return { clear, message, show };
}
