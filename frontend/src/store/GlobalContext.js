import React, { createContext, useState, useContext, useEffect } from 'react';
import * as Location from 'expo-location';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [workflowContext, setWorkflowContext] = useState(null);
  const [traces, setTraces] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [userLocation, setUserLocation] = useState({ name: 'Locating...', coords: null });

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setUserLocation({ name: 'Location Denied', coords: null });
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        let geocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });

        if (geocode && geocode.length > 0) {
          const place = geocode[0];
          const name = `${place.district || place.city || place.subregion || place.region}, ${place.country}`;
          setUserLocation({
            name: name,
            coords: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude
            }
          });
        } else {
          setUserLocation({
            name: 'Unknown Location',
            coords: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude
            }
          });
        }
      } catch (error) {
        console.error("Location error:", error);
        setUserLocation({ name: 'Gulshan-e-Iqbal, Karachi (Fallback)', coords: null });
      }
    })();
  }, []);

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
      updateWorkflow,
      userLocation
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalContext);
