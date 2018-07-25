## Motivation

The SingularityNET network allows developers to register their AI services on an open marketplace and charge for access. Though the expectation is that service consumers will primarily call services from code, the [SingularityNET Dapp](https://github.com/singnet/alpha-dapp) offers a rich UI/UX for people to explore the services offered on the network. Currently there is a default UI (also called "Fallback UI") for each service that is generated from the protobuf models that the service registers and service developers can override the Fallback UI with a custom UI by submitting a PR to the SingularityNET Dapp repository. This PR-based solution does not scale at all and this document aims to outline options for replacing this solution with a self-service workflow for AI service developers to register rich custom UIs for their own services.

## Core Tenets

1. Service developers should be able to craft a Custom UI locally
1. Service developers should be able to register their Custom UIs without participation from the SingularityNET team
1. Custom UIs handle collecting parameters and displaying results, while the SingularityNET Dapp itself handles the service request/response flow
1. Custom UIs should match the overall style and aesthetic of the SingularityNET Dapp

## Project Components
1. Load Custom UI from IPFS into the DApp's DOM
   1. Option 1: Set iframe src to ifps-gateway/<ipfsHash> 
   1. Option 2: UI developers package and upload a tarball which is downloaded from IPFS and contents injected into iframe DOM 
1. Javascript SDK for communication between SingularityNET Dapp and Custom UI
   1. SDK is written by SingularityNET developers, uses the window.postMessage standard and is either injected into iframe or required for Custom UI developers to import
1. Custom functionality
   1. Do we need to enable UI developers to embed arbitrary javascript in their UIs?
1. Look-n-feel
   1. Option 1: Allow service developers to Do Whatever They Want™
   1. Option 2: Provide service developers with a CSS stylesheet to match the surrounding Dapp.
   1. Option 3: Provide service developers with Custom Elements to use for various options
   1. Option 4: Allow only plain HTML and a specified set of Custom Elements with attributes that map to their protobuf models
   1. Option 5: Declarative Semantic UI language (loosely based on something like swagger) which allows developers to specify their UI but have no control over any layout, styling, or functionality.
1. Security
   1. sandboxed iframe should give us the necessary security guarantees

## Links
1. [WHATWG HTML Custom Elements Spec](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements)
   * required naming convention
   * must call `window.customElements.define()` or else custom element behaves as a span
1. Quip doing something similar
   * https://quip.com/blog/quip-engineering-live-apps-platform
   * https://quip.com/blog/quip-engineering-live-apps-platform-pt2
   
