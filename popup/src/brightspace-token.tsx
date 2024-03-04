import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "./store/slices/token";

// It exists in Firefox popup extensions
declare global {
  let browser: {
    storage: {
      sync: {
        get(value: string): Promise<any>;
      };
    };
  };
}

interface BrowserSyncToken {
  token: string; // representing [expires, token]
}

export enum State {
  LOADING,
  ERROR,
  OK,
}

export interface Token {
  state: State;
  error?: string;
  value?: string;
  expires?: number;
}

export const useBrightspaceToken = () => {
  const [t, setT] = useState<Token>({ state: State.LOADING });
  const dispatch = useDispatch();

  useEffect(() => {
    const onTokenChange = (token: Token): void => {
      if (token.value === t.value) return;
      setT(token);
      dispatch(setToken([token.expires ?? 0, token.value ?? ""]));
    };

    const onError = (c: number) => {
      if (c > 3)
        setT({
          state: State.ERROR,
          error: "Could not get token",
        });
      else setTimeout(() => getToken(c + 1), 250);
    };

    const validateToken = (obj: BrowserSyncToken, c: number) => {
      if (!obj) return onError(c);
      const vals = JSON.parse(obj.token);
      if (
        !vals ||
        vals.length !== 2 ||
        typeof vals[0] !== "number" ||
        typeof vals[1] !== "string"
      )
        return onError(c);
      const [expires, token] = vals;

      const healthyToken = new Date().getTime() < expires && token.length > 15;
      if (!healthyToken) return onError(c);
      onTokenChange({
        state: State.OK,
        value: token,
        expires: expires,
      });
    };

    const getToken = (c = 0) =>
      browser.storage.sync
        .get("token")
        .then((v) => validateToken(v, c))
        .catch(() => onError(c));

    const interv = setInterval(getToken, 750);
    return () => clearInterval(interv);
  }, [dispatch, setT, t]);

  return t;
};
