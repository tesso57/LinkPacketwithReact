import React from 'react';
import { AuthProvider } from './utils/auth/AuthProvider';
import { Header } from './components/Layout/Header';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Header />
    </AuthProvider>
  )
}

export default App;
