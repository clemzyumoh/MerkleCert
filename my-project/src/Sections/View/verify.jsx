import React, { useState } from "react";
import { verifyCertificate } from "../../Services/api";
import CertificateCard from "../../Components/CertificateCard";

const Verify = () => {
  const [certificateID, setCertificateID] = useState("");
  const [certificateData, setCertificateData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!certificateID) {
      alert("Please enter a valid certificate ID.");
      return;
    }

    setLoading(true);

    try {
      const { certificate } = await verifyCertificate(certificateID);
      setCertificateData(certificate);
      
    } catch (error) {
      console.error("Error verifying certificate:", error);
      alert("Failed to verify certificate.");
      setCertificateData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 lg:my-28 mt-12 pt-10 mb-24 lg:mr-28 h-screen flex flex-col lg:flex-row justify-center items-center  bg-slate-900 text-white">
      <div className="flex flex-col justify-center items-center w-full">
        <h1 className="text-2xl  mb-6">Verify Certificate</h1>

        <div className="max-w-md flex w-full flex-col gap-4">
          <input
            type="text"
            className="p-2 rounded-md border-white border-2"
            placeholder="Enter Certificate ID"
            value={certificateID}
            onChange={(e) => setCertificateID(e.target.value)}
          />
          <button
            onClick={handleVerify}
            className="px-4 py-2 bg-indigo-600 cursor-pointer text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            disabled={loading}>
            {loading ? "Verifying..." : "Verify"}
          </button>
        </div>
      </div>

      {certificateData && (
        <div className="mt-10 flex flex-col justify-center items-center gap-4 w-full">
          <h2 className="text-xl mb-4">Certificate Verified</h2>
          <CertificateCard
            key={certificateData._id}
            metadata={certificateData.metadata}
            certId={certificateData.certId}
            mintTxId={certificateData.mintTxId}
            imageURL={certificateData.imageURL}
            ipfsHash={certificateData.ipfsHash}
            merkleRoot={certificateData.merkleRoot}
          />
        </div>
      )}
    </div>
  );
};

export default Verify;
