import { FC, createContext, useContext, useState } from "react";

interface CurrencyContextProps {
  currency: string;
  updateCurrency: (value: string) => void;
}

const CurrencyContext = createContext<CurrencyContextProps>({
  currency: "",
  updateCurrency: () => {},
});

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};

export const CurrencyProvider: FC<{ children: any }> = ({ children }) => {
  const [currency, setCurrency] = useState<string>("USD");

  const changeCurrency = (newCurrency: string) => {
    setCurrency(newCurrency);
  };

  return (
    <CurrencyContext.Provider
      value={{ currency, updateCurrency: changeCurrency }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyContext;
