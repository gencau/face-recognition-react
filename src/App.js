import './App.css';
import Navigation from './components/navigation/Navigation';
import Logo from './components/logo/Logo'
import ImageLinkForm from './components/image-link-form/ImageLinkForm'
import Rank from './components/rank/Rank'
import FaceRecognition from './components/face-recognition/FaceRecognition'
import ParticlesBg from 'particles-bg'
import { Component } from 'react';

class App extends Component {
  constructor() {
    super();
    this.state = {
      input :'',
      imageUrl: '',
      box:{},
    }
  }

  calculateFaceLocation = (data)  => {
    // only using 1st face bounding box
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

  getRequestOptions = (imageUrl) =>  {
    const PAT = 'f2116ae04aef4f2cb1c301095c88a9fa'
    //Specify the correct user_id/app_id pairings
    //Since you're making inferences outside your app's scope
    const USER_ID = 'gcaumart'
    const APP_ID = 'face-recognition'
    //Change these to whatever model and image URL you want to use
    const IMAGE_URL = imageUrl;

    const raw = JSON.stringify({
      "user_app_id": {
          "user_id": USER_ID,
          "app_id": APP_ID
      },
      "inputs": [
          {
              "data": {
                  "image": {
                      "url": IMAGE_URL
                  }
              }
          }
      ]
    });
  
    const requestOptions = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Authorization': 'Key ' + PAT
      },
      body: raw
    };
    console.log(requestOptions);
    return requestOptions;
  }

  onButtonSubmit = () => {
    this.setState({imageUrl : this.state.input}); 

    fetch("https://api.clarifai.com/v2/models/" + "face-detection" + "/outputs", this.getRequestOptions(this.state.input))
    .then(response => response.json())
    .then(result => {
        this.displayFaceBox(this.calculateFaceLocation(result));
    })
    .catch(error => console.log('error', error));
  }

  render() {
  return (
    <div className="App">
      <ParticlesBg type="circle" num={200} bg={true} />
      <Navigation />
      <Logo/>
      <Rank/>
      <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
      <FaceRecognition imageUrl={this.state.imageUrl}/>
    </div>
  );}
}

export default App;
