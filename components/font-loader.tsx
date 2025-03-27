"use client"

import { useEffect, useState } from "react"

export function FontLoader() {
  const [fontLoaded, setFontLoaded] = useState(false)

  useEffect(() => {
    // Check if the Alta font is loaded
    document.fonts.ready.then(() => {
      if (document.fonts.check("1em Alta")) {
        setFontLoaded(true)
        console.log("Alta font loaded successfully")
      } else {
        console.warn("Alta font not loaded. Please check font installation.")
      }
    })
  }, [])

  return (
    <>
      {!fontLoaded && (
        <div className="hidden">
          {/* This is a hidden element to preload the Alta font */}
          <span style={{ fontFamily: "Alta, sans-serif" }}>Font Preloader</span>
        </div>
      )}
    </>
  )
}

