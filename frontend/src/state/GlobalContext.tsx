import React, { createContext, useReducer, useMemo, ReactNode } from 'react';

import { reducer, initialState, TodoState } from './TodoReducer';

export interface GlobalContextType {
    state: TodoState;
    dispatch: React.Dispatch<any>; // Use specific action type if available
}

export const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode} ) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);
  
    return (
      <GlobalContext.Provider value={value}>
        {children}
      </GlobalContext.Provider>
    );
};