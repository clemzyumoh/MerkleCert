

//const MerkleTools = require("merkle-tools");
//const crypto = require("crypto");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

function hashCertificate(cert) {
  const str = JSON.stringify({
    certId: cert.certId, // include this if it's part of the hash
    recipientName: cert.recipientName,
    courseTitle: cert.courseTitle,
    issueDate: cert.issueDate,
    issuer: cert.issuer,
    userWallet: cert.userWallet,
  });
  return keccak256(str); // ✅ keep this
}



function generateMerkleTree(certInputs) {
  const leaves = certInputs.map(hashCertificate);
  const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });

  const root = tree.getHexRoot();
  const proofs = leaves.map((leaf) => tree.getHexProof(leaf));

  return { root, proofs };
}




function verifyCertificate(cert, rootHex, proofHexArray) {
  const leaf = hashCertificate(cert);
  console.log("Verifying hash:", leaf.toString("hex"));
  const tree = new MerkleTree([], keccak256, { sortPairs: true });

  return tree.verify(
    proofHexArray.map((p) => Buffer.from(p.slice(2), "hex")),
    leaf,
    Buffer.from(rootHex.slice(2), "hex")
  );
}





module.exports = {
  generateMerkleTree,
  verifyCertificate,
  hashCertificate,
};
