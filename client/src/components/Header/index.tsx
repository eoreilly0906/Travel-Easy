import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-primary text-light mb-4 py-3 flex-row align-center">
      <div className="container flex-row justify-space-between-lg justify-center align-center">
        <div>
          <Link className="text-light" to="/">
            <h1 className="m-0">TravelEasy</h1>
          </Link>
          <p className="m-0">Your travel companion.</p>
        </div>
        <div>
          <Link className="btn btn-lg btn-info m-2" to="/parks">
            Parks
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
