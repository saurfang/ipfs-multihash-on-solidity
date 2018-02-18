import { expect } from 'chai';

import { getBytes32FromMultiash, getMultihashFromContractResponse } from '../src/multihash';
import assertRevert from './helpers/assertRevert';
import expectEvent from './helpers/expectEvent';

const IPFSStorage = artifacts.require('./IPFSStorage.sol');

contract('IPFSStorage', (accounts) => {
  let ipfsStorage;

  beforeEach(async () => {
    ipfsStorage = await IPFSStorage.new();
  });

  const ipfsHashes = [
    'QmahqCsAUAw7zMv6P6Ae8PjCTck7taQA6FgGQLnWdKG7U8',
    'Qmb4atcgbbN5v4CDJ8nz5QG5L2pgwSTLd3raDrnyhLjnUH',
  ];

  async function setIPFSHash(account, hash) {
    const { digest, hashFunction, size } = getBytes32FromMultiash(hash);
    return ipfsStorage.setEntry(digest, hashFunction, size, { from: account });
  }

  async function getIPFSHash(account) {
    return getMultihashFromContractResponse(await ipfsStorage.getEntry(account));
  }

  it('should get IPFS hash after setting', async () => {
    await setIPFSHash(accounts[0], ipfsHashes[0]);

    expect(await getIPFSHash(accounts[0])).to.equal(ipfsHashes[0]);
  });

  it('should fire event when new has is set', async () => {
    await expectEvent(
      setIPFSHash(accounts[0], ipfsHashes[0]),
      'EntrySet',
    );
  });

  it('should set IPFS hash for each address', async () => {
    await setIPFSHash(accounts[0], ipfsHashes[0]);
    await setIPFSHash(accounts[1], ipfsHashes[1]);

    expect(await getIPFSHash(accounts[0])).to.equal(ipfsHashes[0]);
    expect(await getIPFSHash(accounts[1])).to.equal(ipfsHashes[1]);
  });

  it('should clear IPFS hash after set', async () => {
    await setIPFSHash(accounts[0], ipfsHashes[0]);
    expect(await getIPFSHash(accounts[0])).to.equal(ipfsHashes[0]);

    await ipfsStorage.clearEntry();
    expect(await getIPFSHash(accounts[0])).to.be.a('null');
  });

  it('should fire event when entry is cleared', async () => {
    await setIPFSHash(accounts[0], ipfsHashes[0]);

    await expectEvent(
      ipfsStorage.clearEntry(),
      'EntryDeleted',
    );
  });

  it('should prevent clearing non-exists entry', async () => {
    await assertRevert(ipfsStorage.clearEntry());
  });

  it('test gas', async () => {
    await setIPFSHash(accounts[0], ipfsHashes[0]);

    console.log(await ipfsStorage.getEntry.estimateGas(accounts[0]));
    console.log(await ipfsStorage.getEntryMemory.estimateGas(accounts[0]));
  });
});
