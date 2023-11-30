import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'
import './index.css';
import Wrapped from './Wrapped';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId={process.env.REACT_APP_googleClientId}>
    <BrowserRouter>
      <Wrapped />
    </BrowserRouter>
  </GoogleOAuthProvider>
);
