import { useEffect } from 'react'

import FingerprintJS from '@fingerprintjs/fingerprintjs'

export default function useFingerprint () {
  useEffect(() => {
    // get the unique visitor identifier
    const loadVisitorID = async () => {
      const fp = await FingerprintJS.load()
      const result = await fp.get()
      window.localStorage.setItem('visitorID', result.visitorId)
    }
    if (!window.localStorage.getItem('visitorID')) {
      loadVisitorID()
    }
  }, [])
}
