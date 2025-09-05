export const ROUTES = {
    LANDING: "/",
    AUTH: "/auth",
    HOME: "/home",
    MYPLANS: "/myplans",
    PLANFORM: (tech: string) => `/plan/${tech}`,
    PREVIEW: (tech: string) => `/plan/${tech}/preview`,
    PLAN: (planId: string) => `/myplans/${planId}`,
    LOGOUT: "/logout"
  };

  