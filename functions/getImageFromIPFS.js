const getImageFromIPFS = (ipfsUri) => {
  return `https://ipfs.io/ipfs/${ipfsUri.replace('ipfs://', '')}`
}

module.exports = getImageFromIPFS
