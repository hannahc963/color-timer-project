import React, {useState, useEffect} from 'react';
import Timer from './Timer';
import Settings from './Settings';
import Login from './Login';
import Register from './Register';
import './App.css';

const App = () =>{ 
  const [settings, setSettings] = useState({ //object with timer duration and colors array
    duration: 60,
    colors: ["#c800ff", "#3e3bf5", "#2390fc", "#23fcbb", "#38ff26", "#d2ff40", "#ffcf40", "#ff8c40", "#ff5640", "#fa32b1",],
  });

  const [token, setToken] = useState(null); //auth token
  const [loadedPresets, setLoadedPresets] = useState([]); //presets loaded from backend
  const [guestMode, setGuestMode] = useState(false); //guest mode set to false default
  const [currentDuration, setCurrentDuration] = useState(settings.duration); //to keep consistency when applying presets

  const saveSettings = (newSettings)=>{ //updating settings, passed to Settings.js and used in handling submit
    setSettings(newSettings);
  };

  const savePreset = async (preset)=>{ //saving color preset to backend
    if (guestMode) {
      alert("Guests cannot save presets. Please register and login.");
      return;
    }

    const token = localStorage.getItem('token'); //fetches token from local storage
    const res = await fetch('http://localhost:5000/save-preset', { //POST request to backend to store preset
      method: 'POST', //HTTP method to use
      headers: {
        'Content-Type': 'application/json', //content type is JSON
      },
      body: JSON.stringify({token, preset}), //sends token and preset as JSON string
    });

    if (res.ok) { //if request successful then presets are refreshed
      loadPresets(); 
    } 
    else {
      const error = await res.json();
      console.error('Error saving preset:', error);
    }
  };

  const loadPresets = async () =>{ //loading presets from backend
    if (guestMode) return; //nothing loaded if guest

    const token = localStorage.getItem('token'); //fetches token from local storage
    const res = await fetch('http://localhost:5000/load-presets', { //POST request to backend to load presets
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({token}),
    });

    if (res.ok) { //if request successful takes presets loaded and sets them
      const presets = await res.json(); //parses response as JSON
      setLoadedPresets(presets);
    } 
    else {
      const error = await res.json();
      console.error('Error loading presets:', error);
    }
  };

  const deletePreset = async (presetId) => { //deleting a preset 
    if (guestMode) {
      alert("Guests cannot save presets. Please register and login.");
      return;
    }

    const token = localStorage.getItem('token'); //fetches token from local storage
    const res = await fetch('http://localhost:5000/delete-preset', { //POST request to delete preset
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, presetId }),
    });

    if (res.ok) { //if request sucessful refreshes presets
      loadPresets(); 
    } 
    else {
      const errorText = await res.text();
      console.error('Error deleting preset:', errorText);
    }
  };

  const applyPreset = (preset) =>{ //takes in preset and sets current colors to preset's colors
    setSettings((prevSettings)=>({
      ...prevSettings, //keeps time same
      colors: preset.colors, //changes colors
    }));
  };

  const handleGuestLogin = () =>{ //sets user to a guest and default token
    setGuestMode(true);
    setToken('GUEST');
  };

  useEffect(() =>{ //when token is changed and still exists, presets are loaded
    if (token) {
      loadPresets();
    }  
  }, [token]);

  useEffect(() => {
    setCurrentDuration(settings.duration);
  }, [settings.duration]);

  return (
    <div className="App">
      <h1>Color Timer</h1>
      {token ?( //if token exists then Timer, Settings, Color Presets list displayed
        <>
          <Timer 
          duration={settings.duration} 
          colors={settings.colors} 
          />
          <Settings
            saveSettings={saveSettings}
            savePreset={savePreset}
            settings={settings} 
          />
          <div>
            <h2>Saved Presets:</h2>
            <div className="preset-container">
              {loadedPresets.map((preset, index)=>(
                <div key={index} className="preset-item">
                  <button
                    onClick={()=>applyPreset(preset)}
                    className="preset-button"
                  > {preset.name}
                  </button>
                  <button
                    onClick={()=>deletePreset(preset._id)}
                    className="delete-button"
                  > Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : ( //if no token then Register, Login, Guest mode displayed 
        <>
          <Register/>
          <Login setToken={setToken} />
          <button onClick={handleGuestLogin} className="guest-button">
            Continue as Guest
          </button>
        </>
      )}
    </div>
  );
};

export default App;

//npm start