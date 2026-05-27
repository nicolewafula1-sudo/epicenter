import create from 'zustand';
import Cookies from 'js-cookie';

export const useAuthStore = create((set) => ({
  user: null,
  token: Cookies.get('token') || null,
  role: Cookies.get('role') || null,
  
  setUser: (user, token, role) => {
    Cookies.set('token', token, { expires: 7 });
    Cookies.set('role', role, { expires: 7 });
    set({ user, token, role });
  },
  
  logout: () => {
    Cookies.remove('token');
    Cookies.remove('role');
    set({ user: null, token: null, role: null });
  },
  
  isAuthenticated: () => {
    return Cookies.get('token') !== undefined;
  },
  
  hasRole: (requiredRole) => {
    const role = Cookies.get('role');
    return role === requiredRole || role === 'admin';
  },
}));

export const useFilterStore = create((set) => ({
  startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  endDate: new Date(),
  selectedPathogen: null,
  selectedCounty: null,
  minConfidence: 0,
  
  setStartDate: (date) => set({ startDate: date }),
  setEndDate: (date) => set({ endDate: date }),
  setPathogen: (pathogen) => set({ selectedPathogen: pathogen }),
  setCounty: (county) => set({ selectedCounty: county }),
  setMinConfidence: (confidence) => set({ minConfidence: confidence }),
  
  reset: () =>
    set({
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(),
      selectedPathogen: null,
      selectedCounty: null,
      minConfidence: 0,
    }),
}));

export const useMapStore = create((set) => ({
  center: [-1.2921, 36.8219], // Kenya center
  zoom: 6,
  heatmapEnabled: true,
  clusteringEnabled: true,
  
  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  toggleHeatmap: () => set((state) => ({ heatmapEnabled: !state.heatmapEnabled })),
  toggleClustering: () =>
    set((state) => ({ clusteringEnabled: !state.clusteringEnabled })),
}));
