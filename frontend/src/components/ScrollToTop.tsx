import { useLayoutEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import { scrollWindowToTop } from '../lib/scrollToTop'

// Remembers the scroll offset of each history entry so Back/Forward can restore
// it instead of jumping to the top.
const scrollPositions = new Map<string, number>()

/**
 * Scroll management for SPA navigation:
 *  - New page (PUSH/REPLACE, e.g. opening a product) → scroll to top.
 *  - Back/Forward (POP) → restore the position the user left that page at.
 */
export function ScrollToTop() {
  const location = useLocation()
  const navigationType = useNavigationType()

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return

    // We manage scroll ourselves — stop the browser from also trying.
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    const key = location.key

    // Continuously record where the user is on this page (so Back restores it).
    const record = () => scrollPositions.set(key, window.scrollY)
    window.addEventListener('scroll', record, { passive: true })

    let raf = 0

    if (navigationType === 'POP') {
      // Back/Forward → restore saved position. Re-apply for a few frames while
      // cached content / images settle and the page reaches its full height.
      const target = scrollPositions.get(key) ?? 0
      let tries = 0
      const restore = () => {
        window.scrollTo(0, target)
        tries += 1
        if (tries < 6) raf = window.requestAnimationFrame(restore)
      }
      raf = window.requestAnimationFrame(restore)
    } else {
      // Opening a new page → top.
      scrollWindowToTop()
      raf = window.requestAnimationFrame(scrollWindowToTop)
    }

    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener('scroll', record)
    }
  }, [location.key, navigationType])

  return null
}
