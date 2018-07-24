import ipfsApi from 'ipfs-api';

const useInfura = false;

let getIpfs = new Promise(function(resolve, reject) {
  window.addEventListener('load', function() {
    var results;

    if (useInfura) {
      results = {
        ipfs: new ipfsApi({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })
      };
    } else {
      results = {
        ipfs: new ipfsApi('localhost', '5001', {protocol:'http'})
      };
    }

    resolve(results);
  });
});

export default getIpfs;