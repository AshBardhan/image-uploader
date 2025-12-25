/* Detect if the user is on a mobile device */
export const isMobileDevice = (): boolean => {
  // Fallback: Check for touch support and screen size
  const hasTouchScreen =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

  const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;

  // Check user agent string as last resort
  const mobileRegex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const isMobileUA = mobileRegex.test(navigator.userAgent);

  return (hasTouchScreen && isSmallScreen) || isMobileUA;
};
