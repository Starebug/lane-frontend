import { useState, useEffect } from "react"

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkIfMobile = () => {
        setIsMobile(window.innerWidth < 768) // 768px is the md breakpoint in Tailwind
      }

      checkIfMobile()

      window.addEventListener("resize", checkIfMobile)
      
      return () => window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  return isMobile
}
