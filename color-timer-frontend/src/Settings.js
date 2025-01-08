import React, {useState, useEffect} from 'react';

const Settings = ({saveSettings, savePreset, settings}) => { //passes in 2 functions and settings object
  const [minutes, setMinutes] = useState(Math.floor(settings.duration/60)); //calculates minutes from seconds
  const [seconds, setSeconds] = useState(settings.duration%60); //remaining seconds
  const [colors, setColors] = useState(settings.colors); //default colors from passed in settings
  const [presetName, setPresetName] = useState('New Preset'); //default input New Preset for name

  useEffect(() =>{ //initializes minutes, seconds, and colors array if settings changes
    setMinutes(Math.floor(settings.duration/60));
    setSeconds(settings.duration %60);
    setColors(settings.colors);
  },[settings]);

  const handleColorChange = (index, value) => { //passes in index of color array
    const newColors =[...colors]; //creates copy of colors array
    newColors[index] = value; //changes correct element
    setColors(newColors); //ensures React picks up on change in colors
  };

  const handleDeleteColor = () => { //deletes last color
    const newColors = colors.slice(0, -1); //new array without the last element
    setColors(newColors); //ensures React picks up on change in colors
  };

  const handleSubmit = (e) => { //form submission
    e.preventDefault(); //precents default event
    const totalDuration = parseInt(minutes,10)*60 + parseInt(seconds,10); //math for total time
    saveSettings({duration: totalDuration, colors }); //updating settings with new duration and colors
  };

  const handleSavePreset = () => { 
    if (presetName.trim()) { //if presetName exists then saves
      savePreset({name: presetName, colors});
      setPresetName('New Preset'); //reverts input value to default
    } else {
      alert('Please enter a preset name.');
    }
  };

  const handleAddColor = () => { //adds new white color at end of list
    const newColors = [...colors, "#ffffff"]; //copy with added element to end
    setColors(newColors); //ensures React picks up on change
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Minutes:
          <input type="number" value={minutes} onChange={(e) => setMinutes(e.target.value)} required />
        </label>
        <label>
          Seconds:
          <input type="number" value={seconds} onChange={(e) => setSeconds(e.target.value)} required />
        </label>
        <button type="submit">Apply Settings</button>
      </div>

      <div>
        {colors.map((color, index) => ( //map over colors array to display each color input field
          <div key={index}>
            <label>
              Color {index + 1}:
              <input type="color" value={color} onChange={(e) => handleColorChange(index, e.target.value)} required />
            </label>
          </div>
        ))}
      </div>
      <button type="button" onClick={handleAddColor}>Add Color</button>
      <button type="button" onClick={handleDeleteColor}>Delete Color</button>

      <div>
        <label>
          Preset Name:
          <input className="preset-input" type="text" value={presetName} onChange={(e) => setPresetName(e.target.value)} required />
        </label>
        <button type="button" onClick={handleSavePreset}>Save Preset</button>
      </div>
    </form>
  );
};

export default Settings;
