
import { Link } from 'react-router-dom';
import Weather from '../components/Weather/index.tsx';



const Home = () => {
  return (
    <main>
      <div className="flex-row justify-center">
        <div
          className="col-12 col-md-10 mb-3 p-3"
          style={{ border: '1px dotted #1a1a1a' }}
        >
          <Weather />

          <Link to="/thingstodo" className="btn btn-primary mb-3" style={{ display: 'block', width: '100%' }}>
            Things to Do
          </Link>

          <Link to="/flights" className="btn btn-primary mb-3" style={{ display: 'block', width: '100%' }}>
            Search Flights
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Home;
