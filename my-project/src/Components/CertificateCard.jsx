
import React from "react";

const CertificateCard = ({ metadata, certId, imageURL, ipfsHash ,merkleRoot}) => {
  //const ipfsHash = metadata?.ipfsHash;
  const ipfsUrl = ipfsHash ? `https://ipfs.io/ipfs/${ipfsHash}` : imageURL;

  return (
    <div className="bg- text-white p-6  max-w-[500px] rounded-2xl shadow-xl border-4 border-indigo-400 relative">
      <div className="text-center  mb-4">
        <iframe
          src={ipfsUrl}
          width="100%"
          height="300px"
          title="Certificate Preview"
          className="rounded-md  shadow-lg"></iframe>

        <h2 className="text-2xl md:text-3xl font-bold mt-4">
          {metadata?.name || "Certificate of Achievement"}
        </h2>

        <p className="text-sm text-gray-200">
          Issued by: {metadata?.properties?.issuer || "Unknown"}
        </p>
      </div>
      <div className="text-sm text-center text-gray-300 my-4">
        <p>
          ID: <span className="text-white font-bold">{certId}</span>
        </p>
        <p className="my-3">Merkle Proof: ✅ Valid </p>
        <p className="">
          {" "}
          Merkle Root:
          <span className="break-all font-bold">
            {merkleRoot}
          </span>
        </p>
      </div>
      <div className="text-center w-full">
        {ipfsHash ? (
          <a
            href={ipfsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-indigo-600 px-3 py-2 rounded-2xl  text-xl ">
            View
          </a>
        ) : (
          <p className="text-yellow-300 text-xs">No link available</p>
        )}
      </div>
    </div>
  );
};

export default CertificateCard;
