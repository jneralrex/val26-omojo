import { useState } from 'react';
import PasswordPage from './components/PasswordPage';
import ChocolatesPage from './components/ChocolatesPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <>
      {isAuthenticated ? (
        <ChocolatesPage />
      ) : (
        <PasswordPage onSuccess={handleSuccess} />
      )}
    </>
  );
}

export default App;
