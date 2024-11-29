import { useState } from 'react'

export default function WarningBar() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible)
    return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-yellow-500 text-black text-center p-2 z-50">
      <p>Downloading a lot of posts can take time and may incur fees on cellular data. Consider using Wi-Fi.</p>
      <button onClick={() => setIsVisible(false)} className="absolute top-0 right-0 p-2" aria-label="Close" type="button">
        &#x2715;
      </button>
    </div>
  )
}
