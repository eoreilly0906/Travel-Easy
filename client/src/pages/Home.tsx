import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';

import ThoughtList from '../components/ThoughtList/index.tsx';
import ThoughtForm from '../components/ThoughtForm/index.tsx';

import { QUERY_THOUGHTS } from '../utils/queries.ts';
import { Link } from 'react-router-dom';

const Home = () => {
  const { loading, data } = useQuery(QUERY_THOUGHTS);
  const thoughts = data?.thoughts || [];

  return (
    <main>
      <div className="flex-row justify-center">
        <div
          className="col-12 col-md-10 mb-3 p-3"
          style={{ border: '1px dotted #1a1a1a' }}
        >

          <Link to="/thingstodo" className="btn btn-primary mb-3" style={{ display: 'block', width: '100%' }}>
            Things to Do
          </Link>

<ThoughtForm />

          <Link to="/flights" className="btn btn-primary mb-3" style={{ display: 'block', width: '100%' }}>
            Search Flights
          </Link>
          <ThoughtForm />

        </div>
        <div className="col-12 col-md-8 mb-3">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <ThoughtList
              thoughts={thoughts}
              title="Some Feed for Thought(s)..."
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default Home;
