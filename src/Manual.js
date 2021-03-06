import React, { Component, Fragment } from 'react'
import Frame from 'react-frame-component'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import getWeb3 from './utils/getWeb3'
import getIpfs from './utils/getIpfs';
import Parser from 'html-react-parser'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class HashForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      value: "default"
    }
  }

  handleChange(event) {
    this.props.onHashFormChange(event.target.value);
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onHashFormSubmit(event);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

class Manual extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      web3: null,
      ipfs: null,
      keyToGet: null,
      ipfsHash: null,
      utf8Content: null,
      base64Content: null
    }

    this.handleTextBoxChange = this.handleTextBoxChange.bind(this);
    this.handleTextBoxSubmit = this.handleTextBoxSubmit.bind(this);
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })
    })
    .catch(() => {
      console.log('Error finding web3.')
    })

    getIpfs
      .then(results => {
        this.setState({
          ipfs: results.ipfs
        })
      })
  }

  handleTextBoxChange(text) {
    this.setState({
      keyToGet: text
    });
  }

  handleTextBoxSubmit(event) {
    console.log(this);
    const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    var simpleStorageInstance

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      simpleStorage.deployed().then((instance) => {
        simpleStorageInstance = instance

        // Get the value from the contract to prove it worked.
        return simpleStorageInstance.get.call(this.state.keyToGet)
      }).then((result) => {
        console.log("before ipfs");
        console.log(result);

        this.state.ipfs.files.cat(result, (err, file) => {
          if (err) {
            console.log(err);
          } else {
            const utf8 = file.toString('utf8');
            const base64 = file.toString('base64');
            this.setState({ipfsHash: result, utf8Content: utf8, base64Content: base64});
          }
        });
      })
    })
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Lev's IPFS Testbed</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Testing IPFS Integration -</h1>
            </div>
            <div className="pure-u-1-1">
              <HashForm onHashFormChange={this.handleTextBoxChange} onHashFormSubmit={this.handleTextBoxSubmit}></HashForm>
              <br/>
              <div>{this.state.ipfsHash ? `IPFS Hash: ${this.state.ipfsHash}` : ''}</div>
              <div>
                <div className="pure-g">
                  <div className="pure-u-1-2">
                    <iframe id="Raw_iFrame" width="100%" height="750" ref={(f) => { this.rawIframe = f; }} />
                  </div>
                  <div className="pure-u-1-2">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

class LevFrame extends Component {
    componentDidMount() {
        // this.frameRef.onload
    }

    shouldComponentUpdate() {
        return false;
    }

    componentWillUnmount() {
        window.removeEventListener('message', this.frameLambda);
    }

    frameLambda = (event) => {
        
    }
}

export default Manual