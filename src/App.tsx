// src/App.tsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing          from './pages/Landing';
import Register         from './pages/auth/Register';
import MemberLogin      from './pages/member/MemberLogin';
import MemberDashboard  from './pages/member/MemberDashboard';
import AdminDashboard   from './pages/admin/AdminDashboard';
import PaymentPortal    from './pages/payment/PaymentPortal';
import ProtectedRoute   from './components/auth/ProtectedRoute';

import BoxingLayout    from './components/layout/BoxingLayout';
import BoxingHome      from './pages/boxing/BoxingHome';
import BoxingAbout     from './pages/boxing/BoxingAbout';
import BoxingEquipment from './pages/boxing/BoxingEquipment';
import BoxingPlans     from './pages/boxing/BoxingPlans';
import BoxingGallery   from './pages/boxing/BoxingGallery';
import BoxingContact   from './pages/boxing/BoxingContact';

import NishaLayout    from './components/layout/NishaLayout';
import NishaHome      from './pages/nisha/NishaHome';
import NishaAbout     from './pages/nisha/NishaAbout';
import NishaEquipment from './pages/nisha/NishaEquipment';
import NishaPlans     from './pages/nisha/NishaPlans';
import NishaGallery   from './pages/nisha/NishaGallery';
import NishaContact   from './pages/nisha/NishaContact';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"    element={<Landing />} />
        <Route path="/pay" element={<PaymentPortal />} />

        <Route path="/boxing" element={<BoxingLayout />}>
          <Route index            element={<BoxingHome />} />
          <Route path="about"     element={<BoxingAbout />} />
          <Route path="equipment" element={<BoxingEquipment />} />
          <Route path="plans"     element={<BoxingPlans />} />
          <Route path="gallery"   element={<BoxingGallery />} />
          <Route path="contact"   element={<BoxingContact />} />
        </Route>

        <Route path="/nisha" element={<NishaLayout />}>
          <Route index            element={<NishaHome />} />
          <Route path="about"     element={<NishaAbout />} />
          <Route path="equipment" element={<NishaEquipment />} />
          <Route path="plans"     element={<NishaPlans />} />
          <Route path="gallery"   element={<NishaGallery />} />
          <Route path="contact"   element={<NishaContact />} />
        </Route>

        <Route path="/register"         element={<Register />} />
        <Route path="/member/login"     element={<MemberLogin />} />
        <Route path="/member/dashboard" element={
          <ProtectedRoute><MemberDashboard /></ProtectedRoute>
        } />
        <Route path="/admin"            element={<AdminDashboard />} />
        <Route path="*"                 element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
