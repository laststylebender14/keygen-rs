import { useEffect, useState } from 'react';
import {
  checkoutLicense,
  checkoutMachine,
  deactivate,
  getLicense,
  getLicenseKey,
  KeygenError,
  KeygenLicense,
  validateKey,
} from 'tauri-plugin-keygen-rs2-api';
import './App.css';

function App() {
  const [key, setKey] = useState('');
  const [license, setLicense] = useState<KeygenLicense | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getLicenseKey().then((key) => {
      if (key) {
        setKey(key);
      }
    });
    getLicense().then((license) => {
      if (license) {
        setLicense(license);
      }
    });
  }, []);

  const handleActivate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const license = await validateKey(key);
      setLicense(license);
    } catch (err) {
      setError((err as KeygenError).detail);
    }
  };

  const handleDeactivate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await deactivate();
      setLicense(null);
    } catch (err) {
      setError((err as KeygenError).detail);
    }
  };

  const handleCheckoutLicense = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await checkoutLicense();
    } catch (err) {
      setError((err as KeygenError).detail);
    }
  };

  const handleCheckoutMachine = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await checkoutMachine();
    } catch (err) {
      setError((err as KeygenError).detail);
    }
  };

  return (
    <div className="container">
      <div>
        <div>
          <input
            id="license-key"
            style={{ width: '400px' }}
            value={key}
            onChange={(e) => setKey(e.currentTarget.value)}
            disabled={license !== null}
            placeholder="Enter a license key..."
          />
          {license?.valid ? (
            <div className="row">
              <button onClick={handleDeactivate}>Deactivate</button>
              <button onClick={handleCheckoutLicense}>Checkout License</button>
              <button onClick={handleCheckoutMachine}>Checkout Machine</button>
            </div>
          ) : (
            <div className="row">
              <button onClick={handleActivate}>Activate</button>
            </div>
          )}
        </div>
        {error && <div className="error">{error}</div>}
      </div>
    </div>
  );
}

export default App;
