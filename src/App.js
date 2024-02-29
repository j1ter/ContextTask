import React, { createContext, Component, useContext, useState, useEffect } from 'react';
import './App.css';

const UserSettingsContext = createContext();

const UserSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const storedSettings = localStorage.getItem('userSettings');
    return storedSettings
      ? JSON.parse(storedSettings)
      : {
          theme: 'light',
          language: 'en',
          displayPreferences: {
            showImages: true,
            showNotifications: true,
          },
        };
  });

  const updateSettings = (newSettings) => {
    setSettings({ ...settings, ...newSettings });
  };

  useEffect(() => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
  }, [settings]);

  return (
    <UserSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </UserSettingsContext.Provider>
  );
};

const useUserSettings = () => {
  return useContext(UserSettingsContext);
};

const SettingsForm = () => {
  const { settings, updateSettings } = useUserSettings();

  const handleThemeChange = (e) => {
    updateSettings({ theme: e.target.value });
  };

  const handleLanguageChange = (e) => {
    updateSettings({ language: e.target.value });
  };

  const handleDisplayPreferencesChange = (preference) => {
    updateSettings({
      displayPreferences: {
        ...settings.displayPreferences,
        [preference]: !settings.displayPreferences[preference],
      },
    });
  };

  return (
    <div className="settings">
      <h2>User Settings</h2>
      <div className="setting">
        <label>
          Theme:
          <select value={settings.theme} onChange={handleThemeChange}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
      </div>
      <div className="setting">
        <label>
          Language:
          <select value={settings.language} onChange={handleLanguageChange}>
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
          </select>
        </label>
      </div>
      <div className="setting">
        <label>
          Display Preferences:
          <input
            type="checkbox"
            checked={settings.displayPreferences.showImages}
            onChange={() => handleDisplayPreferencesChange('showImages')}
          />
          Show Images
        </label>
      </div>
      <div className="setting">
        <label>
          <input
            type="checkbox"
            checked={settings.displayPreferences.showNotifications}
            onChange={() => handleDisplayPreferencesChange('showNotifications')}
          />
          Show Notifications
        </label>
      </div>
    </div>
  );
};

const DisplaySettings = () => {
  const { settings } = useUserSettings();

  return (
    <div className="display-settings">
      <h2>Current User Settings</h2>
      <p><strong>Theme:</strong> {settings.theme}</p>
      <p><strong>Language:</strong> {settings.language}</p>
      <p><strong>Display Preferences:</strong></p>
      <ul>
        <li>Show Images: {settings.displayPreferences.showImages ? 'Yes' : 'No'}</li>
        <li>Show Notifications: {settings.displayPreferences.showNotifications ? 'Yes' : 'No'}</li>
      </ul>
    </div>
  );
};

const withTimeTracker = (WrappedComponent) => {
  return class WithTimeTracker extends Component {
    constructor(props) {
      super(props);
      this.state = {
        timeSpent: 0,
      };
      this.timer = null;
    }

    componentDidMount() {
      this.timer = setInterval(() => {
        this.setState((prevState) => ({
          timeSpent: prevState.timeSpent + 1,
        }));
      }, 1000);
    }

    componentWillUnmount() {
      clearInterval(this.timer);
    }

    render() {
      return <WrappedComponent timeSpent={this.state.timeSpent} {...this.props} />;
    }
  };
};

class PageComponent extends Component {
  render() {
    const { timeSpent } = this.props;
    const currentTime = new Date().toLocaleTimeString();

    return (
      <div className="page-component">
        <h2>Page Component</h2>
        <p><strong>Current Time:</strong> {currentTime}</p>
        <p><strong>Time Spent on Page:</strong> {timeSpent} seconds</p>
      </div>
    );
  }
}

const PageWithTimeTracker = withTimeTracker(PageComponent);

const App = () => {
  return (
    <UserSettingsProvider>
      <div className="app-container">
        <SettingsForm />
        <PageWithTimeTracker />
        <DisplaySettings />
      </div>
    </UserSettingsProvider>
  );
};

export default App;
