## Overview

## Getting Started

Make sure you have node, npm, ipfs, and truffle installed.

1. `git clone https://github.com/ldub/ipfs-testbed/ && cd ipfs-testbed`
    * clones the repo
1. `npm install`
    * installs dependencies
1. `truffle develop`
    * launches a testnet on port 9545
    * you can also use ganache if you prefer
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