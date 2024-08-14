import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

const Header = () => {
  const { data: session } = useSession(); // Recupera la sessione corrente

  return (
    <header style={headerStyle}>
      <nav>
        <ul style={navListStyle}>
          <li style={navItemStyle}>
            <Link href="/">
              Home
            </Link>
          </li>
          <li style={navItemStyle}>
            <Link href="/activities">
              Attività Formative
            </Link>
          </li>
          {session && session.user.role === 'admin' && (
            <li style={navItemStyle}>
              <Link href="/admin/add-activity">
                Aggiungi Attività
              </Link>
            </li>
          )}
          {!session ? (
            <>
              <li style={navItemStyle}>
                <Link href="/login">
                  Login
                </Link>
              </li>
              <li style={navItemStyle}>
                <Link href="/signup">
                  Registrati
                </Link>
              </li>
            </>
          ) : (
            <>
              <li style={navItemStyle}>
                <Link href="/profile">
                  Profilo
                </Link>
              </li>
              <li style={navItemStyle}>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  style={logoutButtonStyle}
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

const headerStyle = {
  padding: '10px',
  backgroundColor: '#f8f8f8',
  borderBottom: '1px solid #ddd',
};

const navListStyle = {
  display: 'flex',
  listStyle: 'none',
  padding: 0,
  margin: 0,
};

const navItemStyle = {
  marginRight: '20px',
};

const logoutButtonStyle = {
  background: 'none',
  border: 'none',
  color: '#0070f3',
  cursor: 'pointer',
  textDecoration: 'underline',
  padding: 0,
};

export default Header;