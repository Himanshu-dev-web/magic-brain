import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import 'tachyons';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition' ;
import Clarifai, { FACE_DETECT_MODEL } from 'clarifai';
import SignIn from './components/SignIn/SignIn';

const app = new Clarifai.App({
  apiKey: 'ec871ca55e364e79843c7d5e9c0eb41a'
 });

const particlesOption={
    particles: {
      line_linked: {
        shadow: {
          enable: true,
          color: "#3CA9D1",
          blur: 10
        }
      }
    } 
  }
  
  class App extends Component {
  constructor() {
    super();
    this.state = {
      input:'',
      imageUrl:'',
      box:{},
      route:'SignIn',
      isSignedIn:false,
    }
  }
  calculateFaceLocation =(data) => {
   const clarifaiFace= data.outputs[0].data.regions[0].region_info.bounding_box;
   const image=document.getElementById('inputImage');
   const width=Number(image.width);
   const height=Number(image.height);
   return {
     leftCol : clarifaiFace.left_col * width,
     topRow : clarifaiFace.top_row * height,
     rightCol : width - (clarifaiFace.right_col * width),
     bottomRow : height - (clarifaiFace.bottom_row * height)
   } 
   }

   displayFacebox = (box) => {
          this.setState({box: box})
   }
  onInputChange = (event) =>{
          this.setState({ input:event.target.value});
  }
  onButtonSubmit =()=>{
            this.setState({imageUrl:this.state.input});
            app.models
            .predict(FACE_DETECT_MODEL,this.state.input)
            .then(response => this.displayFacebox(this.calculateFaceLocation(response)))
            .catch(err => 
            console.log(err)); 
  }
  onRouteChange = (route) => {
    if(route === 'signout'){
            this.setState({isSignedIn : false})
    }
    else if (route === 'home'){
            this.setState({isSignedIn : true})
    }
            this.setState({route: route})
  }
    
  render() {

     return (
    <div className="App">
     <Particles className='Particles' params={particlesOption} />
      <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
      { this.state.route ==='home' ?
      <div> 
      
       <Logo/>
       <Rank/>
       <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
     
      
      <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
      </div>
      :
      (
        this.state.route === 'SignIn'
        ? <SignIn onRouteChange={this.onRouteChange}/>
        :<Register onRouteChange={this.onRouteChange}/>
              )
      }
    </div>
   )
    }
}

export default App;
