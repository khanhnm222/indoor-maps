import { Route, Routes } from 'react-router-dom'

function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-gray-900">Indoor Maps</h1>
      <p className="mt-4 text-lg text-gray-600">
        React 19 · TypeScript · TailwindCSS v4 · Vite
      </p>
    </main>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  )
}
