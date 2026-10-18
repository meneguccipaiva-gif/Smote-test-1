import { Analytics } from '@vercel/analytics/react'
import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { trackPageView } from './engine/pixel'
import { Home } from './pages/Home'
import { QuizPage } from './pages/QuizPage'

function PixelPageView() {
  const { pathname } = useLocation()

  useEffect(() => {
    trackPageView()
  }, [pathname])

  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <PixelPageView />
      <Analytics />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:slug" element={<QuizPage />} />
      </Routes>
    </BrowserRouter>
  )
}
