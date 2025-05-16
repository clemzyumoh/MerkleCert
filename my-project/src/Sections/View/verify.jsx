

import React, { useState, useEffect } from "react";
import { verifyCertificate } from "../../Services/api";
import CertificateCard from "../../Components/CertificateCard";
import { Connection, PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import toast from "react-hot-toast";



const connection = new Connection("https://api.devnet.solana.com");
import keccak256 from "keccak";

function hash(data) {
  return keccak256("keccak256").update(data).digest(); // returns Buffer
}







async function confirmOnChainRoot(txSignature, expectedRoot) {
  const tx = await connection.getTransaction(txSignature, {
    commitment: "confirmed",
    maxSupportedTransactionVersion: 0,
  });

  if (!tx) throw new Error("Transaction not found");

  const instructions = tx.transaction.message.instructions;
  const accountKeys = tx.transaction.message.accountKeys;

  console.log("Transaction instructions program IDs:");
  instructions.forEach((ix, i) => {
    try {
      const programId =
        typeof ix.programId === "string"
          ? ix.programId
          : accountKeys[ix.programIdIndex]?.toBase58?.() ?? "<unavailable>";
      console.log(`Instruction ${i} Program ID:`, programId);
    } catch {
      console.log(`Instruction ${i} Program ID: <unavailable>`);
    }
  });

  const memoIx = instructions.find((ix) => {
    try {
      const programId =
        typeof ix.programId === "string"
          ? ix.programId
          : accountKeys[ix.programIdIndex]?.toBase58?.();
      return programId === "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr";
    } catch {
      return false;
    }
  });

  if (!memoIx) throw new Error("Memo instruction missing");

  //const onChainRoot = memoIx.data; // Already a UTF-8 string
  //const onChainRoot = Buffer.from(memoIx.data, "utf8").toString(); // ✅ forces UTF-8
  const onChainRoot = memoIx.data.toString("utf8"); // ✅ CORRECT
  //const onChainRoot = memoIx.data.toString("utf8");

  const expectedRootHex = expectedRoot.replace(/^0x/, "");

  const match = onChainRoot === expectedRootHex;

  console.log("Expected Hex Root:", expectedRootHex);
  console.log("On-chain Memo (hex):", onChainRoot);
  console.log("Expected:", expectedRootHex);
  console.log("Memo:", memoIx.data);

  console.log("Match?", match);

  return match;
}



const Verify = () => {
  const [certificateID, setCertificateID] = useState("");
  const [certificateData, setCertificateData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  // Inputs for user to manually confirm merkleRoot and tx
  const [inputMerkleRoot, setInputMerkleRoot] = useState("");
  const [inputSolanaTx, setInputSolanaTx] = useState("");

  const handleFetchCertificate = async () => {
    if (!certificateID) {
      toast.error("Please enter a valid certificate ID.");
      return;
    }
    setLoading(true);
    setVerificationResult(null);
    try {
      const { certificate } = await verifyCertificate(certificateID);
      if (!certificate) {
      
        toast.error("Certificate not found.");
        setCertificateData(null);
        setInputMerkleRoot("");
        setInputSolanaTx("");
      } else {
        setCertificateData(certificate);
        // Prefill inputs for user convenience
        setInputMerkleRoot(certificate.merkleRoot || "");
        setInputSolanaTx(certificate.solanaTx || "");
      }
    } catch (error) {
      console.error("Error fetching certificate:", error);
      
      toast.error("Failed to fetch certificate.");
      setCertificateData(null);
      setInputMerkleRoot("");
      setInputSolanaTx("");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAuthenticity = async () => {
    if (!certificateData) return;
    setVerifying(true);
    setVerificationResult(null);

    try {
      console.log("Checking on-chain memo...");

      const txValid = await confirmOnChainRoot(
        inputSolanaTx || certificateData.solanaTx,
        inputMerkleRoot || certificateData.merkleRoot
      );

      if (!txValid) {
        setVerificationResult({
          success: false,
          message: "On-chain transaction memo does not match Merkle root.",
        });
        return;
      }

      setVerificationResult({
        success: true,
        message: "Certificate is authentic! Verified on-chain.",
      });
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationResult({
        success: false,
        message: error.message || "Verification failed.",
      });
    } finally {
      setVerifying(false);
    }
  };
  
  

  return (
    <div className="p-4 lg:my-28 mt-12 pt-10 mb-28 lg:mr-28 min-h-[500px]  flex flex-col lg:flex-row justify-center items-center bg-slate-900 text-white">
      <div className="flex flex-col justify-center items-center w-full">
        <h1 className="text-2xl mb-6">Verify Certificate</h1>

        <div className="max-w-md flex w-full flex-col gap-4">
          <input
            type="text"
            className="p-2 rounded-md border-white border-2"
            placeholder="Enter Certificate ID"
            value={certificateID}
            onChange={(e) => setCertificateID(e.target.value)}
          />
          <button
            onClick={handleFetchCertificate}
            className="px-4 py-2 bg-indigo-600 cursor-pointer text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            disabled={loading}>
            {loading ? "Fetching..." : "Fetch Certificate"}
          </button>
        </div>
      </div>

      {certificateData && (
        <div className="mt-10 flex flex-col justify-center items-center gap-4 w-full max-w-lg">
          <h2 className="text-xl mb-4">Certificate Details</h2>
          <CertificateCard
            key={certificateData._id}
            metadata={certificateData.metadata}
            certId={certificateData.certId}
            mintTxId={certificateData.mintTxId}
            imageURL={certificateData.imageURL}
            ipfsHash={certificateData.ipfsHash}
            merkleRoot={certificateData.merkleRoot}
            solanaTx={certificateData.solanaTx}
          />

        
        </div>
      )}
    </div>
  );
};

export default Verify;
