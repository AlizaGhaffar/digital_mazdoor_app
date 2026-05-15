import React, { createContext, useState, useContext } from 'react';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [workflowContext, setWorkflowContext] = useState(null);
  const [traces, setTraces] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);

  const updateWorkflow = (data) => {
    setWorkflowContext(data.final_context);
    setTraces(data.all_traces);
    
    // Add to history if it's a new successful workflow
    if (data.final_context.workflow_id) {
      setHistory(prev => {
        const exists = prev.find(item => item.workflow_id === data.final_context.workflow_id);
        if (exists) return prev;
        return [data.final_context, ...prev];
      });
    }
  };

  return (
    <GlobalContext.Provider value={{
      workflowContext,
      traces,
      history,
      loading,
      setLoading,
      currentBooking,
      setCurrentBooking,
      updateWorkflow
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalContext);
