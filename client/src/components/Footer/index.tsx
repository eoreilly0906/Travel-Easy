import { useLocation, useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleGoBack = () => {
    if(window.history.length > 1) { //Check if there is a previous page in the history stack
      navigate(-1);
    } else {
      navigate('/');
    }
  }

  return (
    <footer className="w-100 mt-auto p-4" style={{ background: 'linear-gradient(135deg, #2d3e50 0%, #1a1a1a 100%)' }}>
      <div className="container text-center mb-5">
        {location.pathname !== '/' && (
          <button
            className="btn btn-dark mb-3"
            onClick={handleGoBack}
          >
            &larr; Go Back
          </button>
        )}
        <h4>
          Made with{' '}
          <span
            className="emoji"
            role="img"
            aria-label="heart"
            aria-hidden="false"
          >
            ❤️
          </span>{' '}
          by the team that brought you HoroScoop and MunchMap!
        </h4>
      </div>
    </footer>
  );
};

export default Footer;
