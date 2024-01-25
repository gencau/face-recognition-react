import './App.css';
import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo'
import ImageLinkForm from './components/image-link-form/ImageLinkForm'
import Rank from './components/rank/Rank'
import FaceRecognition from './components/face-recognition/FaceRecognition'
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import ParticlesBg from 'particles-bg'
import { Component } from 'react';

const initialState = {
  input :'',
  imageUrl: '',
  box:{},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email:'',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input :'',
      imageUrl: '',
      box:{},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email:'',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (data) => {
    this.setState({user: {
        id: data.id,
        name: data.name,
        email:data.email,
        entries: data.entries,
        joined: data.joined
    }})
  }

  calculateFaceLocation = (data)  => {
    // only using 1st face bounding box
    console.log(data.outputs[0].data.regions[0].region_info.bounding_box);
    const box = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    
    return {
      leftCol: box.left_col * width,
      topRow: box.top_row * height,
      rightCol: width - (box.right_col * width),
      bottomRow: height - (box.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box});
  }

  onInputChange=  (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl : this.state.input}); 

    // Fetch requestOptions from your endpoint
  fetch("http://localhost:3001/imageurl", {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ input: this.state.input })
  })
  .then(response => response.json())
  .then(response => {
    if (response) {
      fetch("http://localhost:3001/image", {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ id: this.state.user.id })
      })
      .then(response => response.json())
      .then(count => {
        this.setState(Object.assign(this.state.user, {entries: count}));
      })
      .catch(console.log);
    }
    this.displayFaceBox(this.calculateFaceLocation(response));
  })
  .catch(error => console.log('Error:', error));
}

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState);
    } else if (route === 'home') {
      this.setState({isSignedIn:true});
    }
    this.setState({route: route});
  }

  render() {
  const {isSignedIn, imageUrl, route, box} = this.state;
  return (
    <div className="App">
      <ParticlesBg type="circle" num={200} bg={true} />
      <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
      { route === 'home' 
        ?
          <div>
            <Logo/>
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
            <FaceRecognition box={box} imageUrl={imageUrl}/>
        </div>
        : (
            route === 'signin' 
            ?
              <Signin onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
            : 
              <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
          )
      }
    </div>
  );
}

}

export default App;
