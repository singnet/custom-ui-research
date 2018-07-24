var SimpleStorage = artifacts.require("./SimpleStorage.sol");

contract('SimpleStorage', function(accounts) {

  it("...should store the value hey:hey", function() {
    return SimpleStorage.deployed().then(function(instance) {
      simpleStorageInstance = instance;

      return simpleStorageInstance.set("hey", "hey", {from: accounts[0]});
    }).then(function() {
      return simpleStorageInstance.get.call("hey");
    }).then(function(storedData) {
      assert.equal(storedData, "hey", "The value hey was not stored.");
    });
  });

});
