import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

interface NavigationContextType {
  setLoading: (loading: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType>({
  setLoading: () => {},
});

export function NavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <NavigationContext.Provider value={{ setLoading }}>
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "white",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
      )}
      {!loading && children}
    </NavigationContext.Provider>
  );
}

export function useCustomNavigate() {
  const navigate = useNavigate();
  const { setLoading } = useContext(NavigationContext);

  return (to: string | number, options?: { replace?: boolean }) => {
    setLoading(true);

    setTimeout(() => {
      if (typeof to === "number") {
        navigate(to);
      } else {
        navigate(to, options);
      }

      setTimeout(() => setLoading(false), 400);
    }, 100);
  };
}
