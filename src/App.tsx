import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { DashboardPage } from './pages/DashboardPage'
import { CatalogPage } from './pages/CatalogPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { ReviewQueuePage } from './pages/ReviewQueuePage'
import { BatchUploadPage } from './pages/BatchUploadPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="catalog" element={<CatalogPage />} />
          <Route path="catalog/:id" element={<ProductDetailPage />} />
          <Route path="review" element={<ReviewQueuePage />} />
          <Route path="batch" element={<BatchUploadPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
