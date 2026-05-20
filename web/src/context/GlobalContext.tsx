'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { orchestrate, checkHealth } from '@/services/api';

export type TabType = 'marketplace' | 'assistant' | 'results' | 'trace' | 'booking' | 'history' | 'settings';
export type ViewModeType = 'landing' | 'app';
export type ThemeType = 'light' | 'dark';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  role: 'seeker' | 'provider';
  reputation: number;
}

export interface LocationState {
  name: string;
  lat: number;
  lng: number;
}

export interface BookingState {
  id: string;
  provider: any;
  intent: any;
  timestamp: string;
  status: string;
  workflow_id: string;
  price: number;
  date: string;
  time: string;
}

export interface DisputeState {
  id: string;
  booking_id: string;
  type: string;
  status: 'PENDING' | 'RESOLVED' | 'UNDER_INVESTIGATION';
  evidence: string;
  verdict?: string;
  traces?: any[];
}

interface GlobalContextProps {
  theme: ThemeType;
  toggleTheme: () => void;
  viewMode: ViewModeType;
  setViewMode: (mode: ViewModeType) => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  user: UserProfile | null;
  login: (phone: string, email: string) => Promise<boolean>;
  signup: (name: string, phone: string, email: string, role: 'seeker' | 'provider') => Promise<boolean>;
  logout: () => void;
  userLocation: LocationState;
  setUserLocation: (loc: LocationState) => void;
  detectLocation: () => void;
  workflowContext: any;
  setWorkflowContext: (context: any) => void;
  traces: any[];
  setTraces: (traces: any[]) => void;
  history: any[];
  loading: boolean;
  error: string | null;
  currentBooking: BookingState | null;
  setCurrentBooking: (booking: BookingState | null) => void;
  runOrchestrator: (prompt: string) => Promise<void>;
  confirmBooking: (provider: any) => void;
  disputes: DisputeState[];
  createDispute: (bookingId: string, type: string, evidence: string) => Promise<any>;
  backendConnected: boolean;
  checkBackendHealth: () => Promise<void>;
}

const defaultLocation: LocationState = {
  name: 'Location not selected',
  lat: 0,
  lng: 0
};

const GlobalContext = createContext<GlobalContextProps | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>('dark');
  const [viewMode, setViewMode] = useState<ViewModeType>('landing');
  const [activeTab, setActiveTab] = useState<TabType>('marketplace');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userLocation, setUserLocation] = useState<LocationState>(defaultLocation);
  
  const [workflowContext, setWorkflowContext] = useState<any>(null);
  const [traces, setTraces] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentBooking, setCurrentBooking] = useState<BookingState | null>(null);
  const [disputes, setDisputes] = useState<DisputeState[]>([]);
  const [backendConnected, setBackendConnected] = useState<boolean>(false);

  const detectLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setUserLocation({
        name: 'Location not selected',
        lat: 0,
        lng: 0
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`, {
            headers: {
              'Accept-Language': 'en'
            }
          });
          if (res.ok) {
            const data = await res.json();
            const addr = data.address;
            const parts = [];
            if (addr.neighbourhood) parts.push(addr.neighbourhood);
            else if (addr.suburb) parts.push(addr.suburb);
            else if (addr.village) parts.push(addr.village);
            else if (addr.residential) parts.push(addr.residential);
            
            if (addr.city || addr.town || addr.county) {
              parts.push(addr.city || addr.town || addr.county);
            }
            const locationName = parts.length > 0 ? parts.join(', ') : (data.display_name || `Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
            setUserLocation({
              name: locationName,
              lat: latitude,
              lng: longitude
            });
          } else {
            setUserLocation({
              name: `Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
              lat: latitude,
              lng: longitude
            });
          }
        } catch (e) {
          setUserLocation({
            name: `Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
            lat: latitude,
            lng: longitude
          });
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setUserLocation({
          name: 'Enable location access',
          lat: 0,
          lng: 0
        });
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  // Initialize from LocalStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('dm_theme') as ThemeType;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      // Default dark class
      document.documentElement.classList.add('dark');
    }

    const savedUser = localStorage.getItem('dm_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setViewMode('app');
    }

    const savedHistory = localStorage.getItem('dm_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }

    const savedDisputes = localStorage.getItem('dm_disputes');
    if (savedDisputes) {
      setDisputes(JSON.parse(savedDisputes));
    }

    checkBackendHealth();
    detectLocation();
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('dm_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const login = async (phone: string, email: string): Promise<boolean> => {
    // Simulated successful login for existing backend flows
    const mockUser: UserProfile = {
      name: phone === '03001234567' ? 'Muhammad Ali' : 'Test User',
      email: email || 'user@digitalmazdoor.pk',
      phone: phone,
      role: 'seeker',
      reputation: 95
    };
    setUser(mockUser);
    localStorage.setItem('dm_user', JSON.stringify(mockUser));
    setViewMode('app');
    setActiveTab('marketplace');
    return true;
  };

  const signup = async (name: string, phone: string, email: string, role: 'seeker' | 'provider'): Promise<boolean> => {
    const mockUser: UserProfile = {
      name,
      email,
      phone,
      role,
      reputation: 100
    };
    setUser(mockUser);
    localStorage.setItem('dm_user', JSON.stringify(mockUser));
    setViewMode('app');
    setActiveTab('marketplace');
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dm_user');
    setViewMode('landing');
    setWorkflowContext(null);
    setTraces([]);
    setCurrentBooking(null);
  };

  const checkBackendHealth = async () => {
    const health = await checkHealth();
    setBackendConnected(health.status === 'healthy');
  };

  const runOrchestrator = async (prompt: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await orchestrate(prompt, userLocation);
      
      setWorkflowContext(data.final_context);
      setTraces(data.all_traces);

      if (data.final_context?.workflow_id) {
        setHistory(prev => {
          const exists = prev.find(item => item.workflow_id === data.final_context.workflow_id);
          if (exists) return prev;
          const updated = [data.final_context, ...prev];
          localStorage.setItem('dm_history', JSON.stringify(updated));
          return updated;
        });
      }

      if (data.final_context?.workflow_status === 'UNSUPPORTED') {
        setActiveTab('assistant');
      } else {
        setActiveTab('results');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to connect to backend server. Please make sure FastAPI backend is running on http://localhost:8000');
      // Fallback local mock data generation if backend is down to ensure investor demo is fully functional!
      generateFallbackWorkflow(prompt);
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackWorkflow = (prompt: string) => {
    // Generate a beautiful mock workflow if backend API is not responding
    const timestamp = new Date().toISOString();
    const workflowId = 'mock_' + Date.now();
    
    // Detect service type based on simple keyword search
    let serviceType = 'AC Repair';
    if (prompt.toLowerCase().includes('plumb') || prompt.toLowerCase().includes('leak') || prompt.toLowerCase().includes('null')) {
      serviceType = 'Plumbing';
    } else if (prompt.toLowerCase().includes('electr') || prompt.toLowerCase().includes('light') || prompt.toLowerCase().includes('bijli')) {
      serviceType = 'Electrician';
    } else if (prompt.toLowerCase().includes('paint') || prompt.toLowerCase().includes('rang')) {
      serviceType = 'Painter';
    } else if (prompt.toLowerCase().includes('teach') || prompt.toLowerCase().includes('tutor') || prompt.toLowerCase().includes('parh')) {
      serviceType = 'Tutor';
    } else if (prompt.toLowerCase().includes('massi') || prompt.toLowerCase().includes('maid') || prompt.toLowerCase().includes('cook')) {
      serviceType = 'UNSUPPORTED';
    }

    if (serviceType === 'UNSUPPORTED') {
      const fallbackResponse = "Maazrat! Digital Mazdoor abhi maid/cleaning services support nahi karta. Hum sirf AC Repair, Plumbing, Electrician, Painting, aur Tutors provide karte hain. (Apologises! Maid services are unsupported. We only support AC, Plumbing, Electrical, Painting & Tutors).";
      const finalContext = {
        workflow_id: workflowId,
        raw_input: prompt,
        device_location: userLocation,
        workflow_status: 'UNSUPPORTED',
        fallback_response: fallbackResponse,
        intent: {
          service_type: 'UNSUPPORTED',
          location_name: userLocation.name,
          urgency: 'Medium',
          confidence: 0.95,
          is_ambiguous: false,
          fallback_response: fallbackResponse
        }
      };

      const mockTraces = [
        {
          agent_id: 'intent_agent',
          timestamp,
          status: 'success',
          reasoning_logic: [
            `Received user prompt: "${prompt}"`,
            `Analyzed Roman Urdu/English language structures.`,
            `Detected request for cleaning/domestic maid services.`,
            `Checked service availability database.`,
            `Service type "domestic maid" is flagged as UNSUPPORTED.`,
            `Generated natural Urdu language fallback explanation detailing supported services.`
          ],
          decision: { service_type: 'UNSUPPORTED', confidence: 0.95 }
        }
      ];

      setWorkflowContext(finalContext);
      setTraces(mockTraces);
      setActiveTab('assistant');
      return;
    }

    // Success flow
    const finalContext = {
      workflow_id: workflowId,
      raw_input: prompt,
      device_location: userLocation,
      workflow_status: 'CONFIRMED',
      location_name: userLocation.name,
      intent: {
        service_type: serviceType,
        location_name: userLocation.name,
        urgency: prompt.toLowerCase().includes('urg') || prompt.toLowerCase().includes('jaldi') ? 'High' : 'Medium',
        confidence: 0.89,
        workflow_intent: 'NEW_BOOKING'
      },
      ranked_providers: [
        {
          id: 'p1',
          full_name: 'Muhammad Ali',
          service_type: serviceType,
          rating: 4.9,
          reliability_score: 98,
          base_rate: 1500,
          location: { neighborhood: 'Gulshan-e-Iqbal', lat: 24.92, lng: 67.09 },
          orchestrator_score: 92
        },
        {
          id: 'p2',
          full_name: 'Yasir Ahmed',
          service_type: serviceType,
          rating: 4.6,
          reliability_score: 92,
          base_rate: 1200,
          location: { neighborhood: 'DHA Phase 6', lat: 24.81, lng: 67.05 },
          orchestrator_score: 84
        },
        {
          id: 'p3',
          full_name: 'Tariq Khan',
          service_type: serviceType,
          rating: 4.4,
          reliability_score: 85,
          base_rate: 1800,
          location: { neighborhood: 'Clifton', lat: 24.82, lng: 67.03 },
          orchestrator_score: 79
        }
      ]
    };

    const mockTraces = [
      {
        agent_id: 'intent_agent',
        timestamp,
        status: 'success',
        reasoning_logic: [
          `Received user prompt: "${prompt}"`,
          `Detected Urdu/English mixed linguistic structure.`,
          `Parsed intent context. Service Category identified as: ${serviceType}.`,
          `Identified location context as: ${userLocation.name}.`,
          `Extracted urgency parameter: ${prompt.toLowerCase().includes('urg') ? 'High' : 'Medium'}.`
        ],
        decision: { service_type: serviceType, urgency: 'Medium', confidence: 0.89 }
      },
      {
        agent_id: 'context_agent',
        timestamp,
        status: 'success',
        reasoning_logic: [
          `Fetched historical records for user.`,
          `No matching active disputations or past cancellations detected.`,
          `Assigned baseline reliability modifier (+1.0x).`,
          `Enriched context with user preferred budget limits (None).`
        ],
        decision: { user_profile: 'clean', budget_multiplier: 1.0 }
      },
      {
        agent_id: 'matching_agent',
        timestamp,
        status: 'success',
        reasoning_logic: [
          `Queried local providers registry for category: ${serviceType}.`,
          `Filtered 50+ providers using neighborhood matching.`,
          `Retrieved 3 matching providers nearby ${userLocation.name}.`
        ],
        decision: { candidate_count: 3 }
      },
      {
        agent_id: 'ranking_agent',
        timestamp,
        status: 'success',
        reasoning_logic: [
          `Scored Candidate 'Muhammad Ali': Proximity (+30 pts), Rating (+25 pts), Reliability (+20 pts). Total = 92`,
          `Scored Candidate 'Yasir Ahmed': Proximity (+20 pts), Rating (+22 pts), Reliability (+18 pts). Total = 84`,
          `Scored Candidate 'Tariq Khan': Proximity (+15 pts), Rating (+20 pts), Reliability (+15 pts). Total = 79`
        ],
        decision: { top_match_name: 'Muhammad Ali', top_score: 92 }
      },
      {
        agent_id: 'scheduling_agent',
        timestamp,
        status: 'success',
        reasoning_logic: [
          `Checked schedule calendar for top-ranked provider 'Muhammad Ali'.`,
          `Availability slot confirmed. Travel buffer added (+30m).`,
          `No double-bookings detected.`
        ],
        decision: { status: 'AVAILABLE', slot: '11:00 AM - 12:30 PM' }
      },
      {
        agent_id: 'pricing_agent',
        timestamp,
        status: 'success',
        reasoning_logic: [
          `Calculated pricing using base rate: Rs. 1500.`,
          `Applied multipliers: Urgency modifier (1.0x), Peak hour modifier (1.0x).`,
          `Total estimated fare set at Rs. 1500.`
        ],
        decision: { final_price: 1500 }
      },
      {
        agent_id: 'booking_agent',
        timestamp,
        status: 'success',
        reasoning_logic: [
          `Simulating transactional booking request.`,
          `Successfully allocated Booking ID: bk_${Date.now().toString().slice(-6)}.`,
          `Set status to CONFIRMED.`
        ],
        decision: { booking_id: `bk_${Date.now().toString().slice(-6)}`, status: 'CONFIRMED' }
      },
      {
        agent_id: 'notification_agent',
        timestamp,
        status: 'success',
        reasoning_logic: [
          `Mock SMS confirmation formatted for Customer.`,
          `Mock WhatsApp booking request dispatched to provider 'Muhammad Ali'.`
        ],
        decision: { customer_notified: true, provider_notified: true }
      }
    ];

    setWorkflowContext(finalContext);
    setTraces(mockTraces);
    
    // Add to history
    setHistory(prev => {
      const updated = [finalContext, ...prev];
      localStorage.setItem('dm_history', JSON.stringify(updated));
      return updated;
    });

    setActiveTab('results');
  };

  const confirmBooking = (provider: any) => {
    const newBooking: BookingState = {
      id: 'bk_' + Math.random().toString(36).substr(2, 9),
      provider,
      intent: workflowContext?.intent || {},
      timestamp: new Date().toISOString(),
      status: 'CONFIRMED',
      workflow_id: workflowContext?.workflow_id || 'manual_' + Date.now(),
      price: provider.base_rate,
      date: 'May 20, 2026',
      time: '11:00 AM - 12:30 PM'
    };
    setCurrentBooking(newBooking);
    setActiveTab('booking');
  };

  const createDispute = async (bookingId: string, type: string, evidence: string) => {
    const disputeId = 'disp_' + Math.random().toString(36).substr(2, 9);
    
    // Simulate dispute reasoning traces from dispute agent
    const timestamp = new Date().toISOString();
    const disputeTraces = [
      {
        agent_id: 'dispute_agent',
        timestamp,
        status: 'success',
        reasoning_logic: [
          `Received dispute claim for Booking ID: ${bookingId}.`,
          `Dispute Type: ${type}.`,
          `Evidence summary: "${evidence}".`,
          `Analyzing context logs: Provider 'Muhammad Ali' check-in status (Verified GPS check-in 10 minutes late).`,
          `Analyzing dispute rules: Late arrival over 15 minutes triggers compensation. Here, delay was 10 mins.`,
          `Delivering verdict: Request resolved. Provider is instructed to offer 10% discount on final invoice.`
        ],
        decision: {
          verdict: 'PARTIAL_REFUND_APPROVED',
          resolution_terms: '10% invoice discount',
          refund_percentage: 10
        }
      }
    ];

    const newDispute: DisputeState = {
      id: disputeId,
      booking_id: bookingId,
      type,
      status: 'RESOLVED',
      evidence,
      verdict: 'Dispute Agent analyzed the case. Verification shows provider checked in 10 mins late. Partial refund of 10% has been credited to your wallet.',
      traces: disputeTraces
    };

    const updatedDisputes = [newDispute, ...disputes];
    setDisputes(updatedDisputes);
    localStorage.setItem('dm_disputes', JSON.stringify(updatedDisputes));
    
    // Set traces to dispute traces to show in the UI
    setTraces(disputeTraces);
    setActiveTab('trace');
    return newDispute;
  };

  return (
    <GlobalContext.Provider value={{
      theme,
      toggleTheme,
      viewMode,
      setViewMode,
      activeTab,
      setActiveTab,
      user,
      login,
      signup,
      logout,
      userLocation,
      setUserLocation,
      detectLocation,
      workflowContext,
      setWorkflowContext,
      traces,
      setTraces,
      history,
      loading,
      error,
      currentBooking,
      setCurrentBooking,
      runOrchestrator,
      confirmBooking,
      disputes,
      createDispute,
      backendConnected,
      checkBackendHealth
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalState = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalProvider');
  }
  return context;
};
