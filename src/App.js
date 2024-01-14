import './App.css';
import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo'
import ImageLinkForm from './components/image-link-form/ImageLinkForm'
import Rank from './components/rank/Rank'
import ParticlesBg from 'particles-bg'

function App() {
  return (
    <div className="App">
      <ParticlesBg type="circle" num={200} bg={true} />
      <Navigation />
      <Logo/>
      <Rank/>
      <ImageLinkForm/>
      {/* 
      <FaceRecognition/>} */}
    </div>
  );
}

export default App;
