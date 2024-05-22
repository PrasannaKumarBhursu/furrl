export function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
  }
  
  export function canUseNavigatorShare() {
    return !!navigator.share;
  }
  