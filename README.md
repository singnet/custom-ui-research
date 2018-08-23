## Overview

The SingularityNET network allows developers to register their AI services on an open marketplace and charge for access. Though the expectation is that service consumers will primarily call services from code, the [SingularityNET Dapp](https://github.com/singnet/alpha-dapp) offers a rich UI/UX for people to explore the services offered on the network. Currently there is a default UI (also called "Fallback UI") for each service that is generated from the protobuf models that the service registers and service developers can override the Fallback UI with a custom UI by submitting a PR to the SingularityNET Dapp repository. This PR-based solution does not scale at all and this document aims to outline options for replacing this solution with a self-service workflow for AI service developers to register rich custom UIs for their own services.

This repository serves as a research project exploring what is possible with safely loading an arbitrary custom ui from an IPFS location and letting it execute scripts 


## Core Tenets

1. Service developers should be able to craft a Custom UI locally
1. Service developers should be able to register their Custom UIs without participation from the SingularityNET team
1. Custom UIs handle collecting parameters and displaying results, while the SingularityNET Dapp itself handles the service request/response flow
1. Custom UIs should match the overall style and aesthetic of the SingularityNET Dapp

## Getting Started

Make sure you have node, npm, ipfs, and truffle installed.

1. `git clone https://github.com/ldub/ipfs-testbed/ && cd ipfs-testbed`
    * clones the repo
1. `npm install`
    * installs dependencies
1. `truffle develop`
    * launches a testnet on port 9545
    * you can also use ganache if you prefer
1. `truffle migrate --network develop --reset`
    * deploys contracts to testnet
1. `ipfs init`
    * skip this step if you've already set up ipfs
1. `ipfs add resources/ipfs_resources/*`
    * this adds the example files to IPFS in case nobody else is hosting them
    * output should look like:
        ```
        λ ipfs add resources/ipfs_resources/*
        added QmSj6BSHYpPBLxVDdUKXwUZyRMmnxksR2NZXaqUWRB4Wjd airedale.jpeg
        added QmRKCcyjToCWrwCe8i2PzeFjhepkgSyUXWwFYjfJ3w6HA8 betterwebsite.html
        added QmPZ9gcCEpqKTo6aq61g2nXGUhM4iCL3ewB6LDXZCtioEB readme.txt
        ```
    * hashes have to match exactly what is inserted in `SimpleStorage.sol` constructor
1. `npm run start`
    * serves the react app at `localhost:3000`
1. Navigate to `localhost:3000` in your web browser
    * try entering `website` in the textbox and hit submit
        * on the left side you see the UTF8 content retrieved from IPFS
        * on the right side you see the content rendered as HTML inside an iFrame
    * also try typing `readme` and `airedale` in the textbox
        * TODO: `airedale` loads an image and is currently broken with:
            ```
            Uncaught DOMException: Failed to execute 'createElement' on 'Document': The tag name provided ('hug�v�...') is not a valid name.
            ```


## Project Components
1. Load Custom UI from IPFS into the DApp's DOM
    1. Option 1: Set iframe src to `ifps-gateway/<ipfsHash>`
        * iframe same-origin policy makes this secure, and a `window.postMessage`-based API can make it easy for developers to communicate with the DApp to hand over the parameters to send to the gRPC service
        * requires a dependency on an ipfs-gateway
    1. Option 2: UI developers package and upload a tarball (or even plain HTML file) which is downloaded from IPFS and contents injected into iframe DOM
        * requires exploration of proper iframe sandboxing techniques in order to make this secure
1. Javascript SDK for communication between SingularityNET Dapp and Custom UI
    * SDK is written by SingularityNET developers, uses the window.postMessage standard
    * either injected into iframe or required for Custom UI developers to import
1. Custom functionality
    1. Do we need to enable UI developers to embed arbitrary javascript in their UIs?
        * Yes: `sandbox='allow-scripts'`
        * No: `sandbox='allow-same-origin'`
        * Setting both the allow-scripts and allow-same-origin keywords together when the embedded page has the same origin as the page containing the iframe allows the embedded page to simply remove the sandbox attribute and then reload itself, effectively breaking out of the sandbox altogether. [src](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#attr-iframe-sandbox)
1. Look-n-feel
    1. Option 1: Allow service developers to Do Whatever They Want™
    1. Option 2: Provide service developers with a CSS stylesheet to match the surrounding Dapp.
    1. Option 3: Provide service developers with Custom Elements to use for various options
       * demo below
    1. Option 4: Allow only plain HTML and a specified set of Custom Elements with attributes that map to their protobuf models
    1. Option 5: Declarative Semantic UI language (loosely based on something like swagger) which allows developers to specify their UI but have no control over any layout, styling, or functionality.
1. Security
    1. a properly sandboxed iframe should give us the necessary security guarantees
    1. research preventing metamask popups from within iframe
    1. research preventing gRPC calls from within iframe 

## Demos
1. Parent window cannot write into (or access) child cross-origin iframe [jsfiddle](https://jsfiddle.net/appleyard/yph8o3x0/)
  1. Parent window cannot write (or access) child sandboxed iframe [jsfiddle](https://jsfiddle.net/appleyard/ja51L76s/) 
1. Custom Elements demo [jsfiddle](https://jsfiddle.net/appleyard/m2syf4zj/)
   * Not implemented in Firefox or IE yet but polyfill available from webcomponents.org
1. Simple window.postMessage demo, communication between iframes [jsfiddle](https://google.com)
1. Input elements outside of form are valid HTML5: https://imgur.com/a/HFciXEg from https://checker.html5.org/
1. Write HTML+JS into unsandboxed iframe and it gets hacked: [jsfiddle](https://jsfiddle.net/appleyard/61w3tapz/)
1. Write HTML+JS into `allow-same-origin` iframe (but no `allow-scripts`) and it is not hacked: [jsfiddle](https://jsfiddle.net/appleyard/vhbuysLd/)
1. Write HTML+JS into `allow-same-origin` iframe, then replace with `allow-scripts` and ideally the scripts will execute but they wont have access to parent page data: [jsfiddle](https://jsfiddle.net/appleyard/acb6w4s8/)
    * THIS DOES NOT CURRENTLY WORK
    * crucial feature for making the custom ui project work well

## Questions
1. Given that metamask only works in Chrome (+ opera,brave) and has limited support for Firefox, how much do we care about IE and Safari compatibility from day 1?
1. Do custom elements defined in parent still work in iframe?
1. use shadow dom on custom elements in order to force styling on our custom elements
   1. the shadow dom can be opened/hacked around but the idea is that if our custom elements are styled in a certain way, UI developers will try to match those styles

## Links
1. [WHATWG HTML Custom Elements Spec](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements)
   * required naming convention
   * must call `window.customElements.define()` or else custom element behaves as a span]
   * https://developers.google.com/web/fundamentals/web-components/customelements#historysupport
   * chrome and safari implemented and enabled by default, firefox implemented but not enabled, edge is prototyping
1. Quip doing something similar
   * https://quip.com/blog/quip-engineering-live-apps-platform
   * https://quip.com/blog/quip-engineering-live-apps-platform-pt2
   