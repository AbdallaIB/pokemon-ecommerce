import Nav from '@components/nav';
import Routes from '@routes/index';
import './App.css';

const App = () => {
  return (
    <div className="flex flex-col items-center justify-start w-full h-full">
      <Nav />
      <Routes />
    </div>
  );
};

export default App;
