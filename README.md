[![Build Status](https://travis-ci.org/saurfang/ipfs-multihash-on-solidity.svg?branch=master)](https://travis-ci.org/saurfang/ipfs-multihash-on-solidity)

# IPFS hash (multihash) with Solidity and web3.js

Example of using Solidity and web3.js to store and retrieve IPFS hash and more generally [multihash](https://github.com/multiformats/multihash).

IPFS hash is often represented using 46 character long Base58 encoding(e.g. `QmahqCsAUAw7zMv6P6Ae8PjCTck7taQA6FgGQLnWdKG7U8`). It might be attempting to store IPFS hash using `bytes` or `string` which are dynamically sized byte array since it cannot fit in the largest [fixed-size byte arrays](https://solidity.readthedocs.io/en/develop/types.html#fixed-size-byte-arrays) `bytes32`.

However this can be both expensive and challenging to use IPFS hashes in arrays. Luckily as one might notice that IPFS hashes commonly start with `Qm`, they in fact follow the [multihash](https://github.com/multiformats/multihash) self describing hash format:

```
 <varint hash function code><varint digest size in bytes><hash function output>
```

This makes it possible to break down IPFS hash into a struct like so:

```solidity
  struct Multihash {
    bytes32 digest;
    uint8 hashFunction;
    uint8 size;
  }
```

This repository gives an end-to-end example on how to store IPFS hash in Solidity as well as how to call the smart contract using web3.js to get and set IPFS hash.

[IPFSStorage.sol](contracts/IPFSStorage.sol) is a smart contract that stores IPFS hash in a mapping from address key to Multihash struct. Because web3.js ABI doesn't support passing tuple as parameter and return type, additional care is taken to normalize the function interface to be web3.js friendly.

[multihash.js](src/multihash.js) contains the Javascript code that converts base58 encoded multihash string to and from smart contract friendly arguments and responses.

Refer to [test cases](test/IPFSStorage.test.js) for additional example code how to interact with the contract.

## Reference

Multihash Format: https://github.com/multiformats/multihash

[zeppelin-solidity](https://github.com/OpenZeppelin/zeppelin-solidity/) for project setup and test helpers.

Previous discussions and examples:

[How to store IPFS hash using bytes?](https://ethereum.stackexchange.com/questions/17094/how-to-store-ipfs-hash-using-bytes)

[A practical guide to cheap IPFS hash storage in an Ethereum smart contract](https://www.reddit.com/r/ethdev/comments/6lbmhy/a_practical_guide_to_cheap_ipfs_hash_storage_in/)

[OriginProtocol Demo Code](https://github.com/OriginProtocol/demo-dapp/blob/master/src/services/contract-service.js#L18)
