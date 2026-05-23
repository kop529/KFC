import * as React from "react"

const MOBILE_BREAKPOINT = 1024 // Using lg as the desktop cutoff for isolation, as requested: "Desktop views (lg: and above) will remain structurally untouched"

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    // We treat anything below lg (1024px) as mobile/tablet for structural splitting
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    const onChange = (e) => {
      setIsMobile(e.matches)
    }
    
    // Set initial value
    setIsMobile(mql.matches)
    
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isMobile
}
