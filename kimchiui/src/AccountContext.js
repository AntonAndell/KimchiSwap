import React, { createContext, useState } from "react";

export const AccountContext = createContext();

// This context provider is passed to any component requiring the context
export const AccountProvider = ({ children }) => {
    const [address, setAddress] = useState("");

  return (
    <AccountContext.Provider
      value={{
          address,
          
          setAddress,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};
