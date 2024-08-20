// components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer>
      <div className="footer">
        <img src="/images/stripe.png" alt="Parole O_Stili" />
        <p>Ideato da Parole O_Stili. Progettato da SpazioUau</p>
        <p>&copy; {new Date().getFullYear()} #AncheIoInsegno All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
