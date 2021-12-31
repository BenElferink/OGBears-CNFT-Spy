function getImageFromIPFS(ipfsUri) {
  return `https://ipfs.io/ipfs/${ipfsUri.replace('ipfs://', '')}`
}

export default getImageFromIPFS
