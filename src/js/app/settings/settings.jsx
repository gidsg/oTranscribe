import { h, render, Component } from 'preact';
import KeyboardShortcuts from './KeyboardShortcuts.jsx';
import { bindPlayerToUI, keyboardShortcutSetup } from '../ui';
const localStorageManager = require('local-storage-manager');

const defaultSettings = {};
defaultSettings.keyboardShortcuts = {
    shortcuts: {
        playPause: ['escape'],
        backwards: ['f1','mod+1'],
        forwards: ['f2','mod+2'],
        returnToStart: ['mod+0'],
        timeSelection: ['mod+k'],
        speedDown: ['f3','mod+3'],
        speedUp: ['f4','mod+4'],
        addTimestamp: ['mod+j'],
        bold: ['mod+b'],
        italic: ['mod+i'],
        underline: ['mod+u']
    }
}

export function getSettings() {
    const savedSettings = localStorageManager.getItem('oTranscribe-settings');
    let settings = Object.assign({}, defaultSettings);
    if (savedSettings) {
        settings = Object.assign({}, defaultSettings, savedSettings);
    }
    return settings;
}

const cleanup = {};
cleanup.keyboardShortcuts = (state, prevState) => {
    bindPlayerToUI();
    keyboardShortcutSetup();
    // TODO: check if any keyboard shortcuts are no longer present in current state
    const shortcuts = state.keyboardShortcuts.shortcuts;
    const prevShortcuts = prevState.keyboardShortcuts.shortcuts;
    console.log(shortcuts, prevShortcuts)
}

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = getSettings();
    }
    componentDidUpdate(prevProps, prevState) {
        localStorageManager.setItem('oTranscribe-settings', this.state);
        cleanup.keyboardShortcuts(this.state, prevState);
    }
    render() {
        const update = function(key, value) {
            this.setState({
                [key]: Object.assign({}, value)
            });
        }
        const reset = function(key) {
            this.setState({
                [key]: defaultSettings[key]
            });
        }
        return (
            <div>
                <h2 class="panel-title">Settings</h2>
                <KeyboardShortcuts
                    settings={this.state.keyboardShortcuts}
                    reset={reset.bind(this, 'keyboardShortcuts')}
                    onChange={update.bind(this, 'keyboardShortcuts')}
                />
            </div>
        );
    }
}

export function showSettings(el) {
    render(<Settings />, el);    
}
