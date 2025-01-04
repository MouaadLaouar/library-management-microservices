import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Books from './pages/Books'

function App() {

  return (
    <>
    <Routes>
      <Route path='/:id' element={<Books />} />
      <Route path='/' element={<Home />} />
    </Routes>
    </>
  )
}

export default App
