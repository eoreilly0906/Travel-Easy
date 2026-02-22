import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-primary text-white text-center py-3 mt-auto">
      <Container>
        <p className="mb-0">&copy; {new Date().getFullYear()} Travel Easy. All rights reserved.</p>
      </Container>
    </footer>
  );
};

export default Footer;
