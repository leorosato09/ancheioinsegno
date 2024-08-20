// components/Footer.js
import React from 'react';
import styles from '/styles/global.css';

const Footer = () => {
  return (
    <footer>
      <div className="footer">
        <p>&copy; {new Date().getFullYear()} My Awesome App. All rights reserved.</p>
        <p>Follow us on <a href="https://twitter.com">Twitter</a>, <a href="https://facebook.com">Facebook</a>, and <a href="https://instagram.com">Instagram</a>.</p>
      </div>
    </footer>
  );
};

export default Footer;
