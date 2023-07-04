import { ethers } from "ethers";

const getSignerAddress = (msg: string, signature: string) => {
  try {
    const signerAddress = ethers.verifyMessage(msg, signature);
    return signerAddress;
  } catch (e) {
    return "";
  }
};

const verifySignature = (signer: string, msg: string, signature: string) => {
  try {
    const signerAddress = getSignerAddress(msg, signature);
    return signerAddress.toLocaleLowerCase() === signer.toLocaleLowerCase();
  } catch (e) {
    return false;
  }
};

export { getSignerAddress, verifySignature };
