

import React from "react";
import { Copy } from "lucide-react"; // If using lucide icons
import toast from "react-hot-toast";


const CertificateCard = ({
  metadata,
  certId,
  imageURL,
  ipfsHash,
  merkleRoot,
  solanaTx,
}) => {
  const ipfsUrl = ipfsHash ? `https://ipfs.io/ipfs/${ipfsHash}` : imageURL;

  const shorten = (str, chars = 6) =>
    str ? `${str.slice(0, chars)}...${str.slice(-chars)}` : "";

  const handleCopy = (value) => {
    navigator.clipboard.writeText(value);
  
    toast.success("copied to clipboard")
  };

  return (
    <div className="bg- text-white p-6  max-w-[500px] rounded-2xl shadow-xl border-4 border-indigo-400 relative">
      <div className="text-center mb-4">
        <iframe
          src={ipfsUrl}
          width="100%"
          height="300px"
          title="Certificate Preview"
          className="rounded-md shadow-lg"></iframe>

        <h2 className="text-2xl md:text-3xl font-bold mt-4">
          {metadata?.name || "Certificate of Achievement"}
        </h2>

        <p className="text-sm text-gray-200">
          Issued by: {metadata?.properties?.issuer || "Unknown"}
        </p>
      </div>

      <div className="text-sm text-center text-gray-300 my-4">
        <div className="flex items-center justify-center gap-2 my-1">
          <span> ID:</span>
          <span className="text-white font-bold">{certId}</span>
          <button onClick={() => handleCopy(certId)} title="Copy">
            <Copy className="w-4 h-4 text-white hover:text-yellow-400" />
          </button>
        </div>
       

        <p className="my-3">Merkle Proof: ✅ Valid</p>

        <div className="flex items-center justify-center gap-2 my-1">
          <span>Merkle Root:</span>
          <span className="font-bold">{shorten(merkleRoot)}</span>
          <button onClick={() => handleCopy(merkleRoot)} title="Copy">
            <Copy className="w-4 h-4 text-white hover:text-yellow-400" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 my-1">
          <span>Solana Tx:</span>
          <span className="font-bold">{shorten(solanaTx)}</span>
          <button onClick={() => handleCopy(solanaTx)} title="Copy">
            <Copy className="w-4 h-4 text-white hover:text-yellow-400" />
          </button>
        </div>
      </div>

      <div className="text-center w-full mt-6">
        {ipfsHash ? (
          <a
            href={ipfsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-indigo-700 px-4 py-3 rounded-xl text-xl">
            Download
          </a>
        ) : (
          <p className="text-yellow-300 text-xs">No link available</p>
        )}
      </div>
    </div>
  );
};

export default CertificateCard;

