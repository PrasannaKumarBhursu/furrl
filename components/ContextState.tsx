  "use client"

  import React, { createContext, useState, useContext, useEffect } from "react";

  type ContextStateType = {
    Product: { [key: string]: string[] };
    setProduct: React.Dispatch<
      React.SetStateAction<{ [key: string]: string[] }>
    >;
  };

  const ContextState = createContext<ContextStateType | undefined>(
    undefined
  );

  let initialProduct:any = {};
      
  export const ProductProvider = ({ children }: any) => {
    const [Product, setProduct] = useState<any>(initialProduct);
    console.log("setproduct",Product);
    


    return (
      <ContextState.Provider value={{ Product, setProduct }}>
        {children}
      </ContextState.Provider>
    );
  };

  export const useProduct = () => {
      const contextValue = useContext(ContextState);
     
      
      if (!contextValue) {
        throw new Error("ProductContext must be used within a ProductProvider");
      }
      return contextValue;
    };