iframe sandboxing woes

definition: a `src`-less iframe is an iframe with no `src` attribute, into which we intend to write HTML

`sandbox="allow-same-origin"` on a `src`-less iframe allows an iframe to access and modify parent data. note that an iframe needs a script to actually do that.

`sandbox="allow-same-origin allow-scripts"` is thus useless when embedding arbitrary third party content into a `src`-less iframe as it can just reach into the parent document and remove its own sandboxing (jsfiddle is a WIP)

to load content from IPFS without a gateway, we need the ability to write into a `src`-less iframe on our own page. `allow-same-origin` is a necessity as without it the iframe is marked with a 'unique origin' (which never matches any other origin) and then the parent frame cannot write into it. (jsfiddle proving this is available in my notes).

argument 1: we cannot write arbitrary third party content into a `src`-less iframe (which requires `allow-same-origin`) AND allow that iframe to execute scripts

one idea to circumvent this looks like:
1. create iframe with `sandbox="allow-same-origin allow-scripts"`
2. write our library into it
3. write arbitrary third party content from IPFS into it
4. remove the `allow-same-origin` sandbox attribute from the iframe
  * blocks the iframe from accessing the parent page
  * forces all further communication to be done safely via `postMessage`

is step 4 secure? [WIP]
* possible race condition allowing the adversarial third-party iframe to still remove its own sandbox
* can we mitigate that by placing all third party code inside a 1 second timeout, ensuring that step 4 executes? 

if my investigation reveals that argument 1 is indeed correct, the best we can do is load arbitrary HTML and CSS but strip out all <script> tags (except for the ones that we put in which contain our library). ive coded up a jsfiddle showing that this is enough to provide a decent UI development experience, except the part where all custom components (such as the canvas that renders a box around a face) would need to be PR'ed into our library. a corollary of this is that we probably should spend some time coding/porting a good selection of components into our library.
