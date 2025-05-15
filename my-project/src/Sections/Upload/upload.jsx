import React, { useState, useEffect , useRef} from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  issueCertificate,
  merkleCertificateNFT,
  registerOrFindUser,
} from "../../Services/api";
import { useAppContext } from "../../Context/AppContext";
import toast from "react-hot-toast";



const Upload = () => {
  const [certificateName, setCertificateName] = useState("");
  const [issuer, setIssuer] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mintedCert, setMintedCert] = useState(null);
  // Add to Upload.jsx (top - inside component)
  const [recipientName, setRecipientName] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [issueDate, setIssueDate] = useState("");
  //const [expiryDate, setExpiryDate] = useState("");
  const [description, setDescription] = useState("");
   // Add input for user’s wallet address
  const [recipientWalletAddress, setRecipientWalletAddress] = useState(""); 
  const fileInputRef = useRef(null);
  const { publicKey, connected } = useWallet();
  const { role } = useAppContext();

  const isAdmin = role === "admin";
  const walletAddress = publicKey?.toString();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUploadAndMint = async () => {
    if (
      !certificateName ||
      !issuer ||
      !file ||
      !recipientName ||
      !courseTitle ||
      !issueDate ||
      !description ||
      !recipientWalletAddress
    ) {
      
      toast.error("Please fill in all fields and select a file.");
      return;
    }

    if (!walletAddress) {
    
      toast.error("Connect your wallet first.");
      return;
    }

    setLoading(true);
    try {
      // Step 0: Ensure user exists
      await registerOrFindUser(recipientWalletAddress);
      const certId = `CERT-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // // Step 1: Upload certificate metadata
      const formData = new FormData();

      formData.append("certId", certId); // Ensure certId is passed
      formData.append("name", certificateName); // Ensure name is passed
      formData.append("issuer", issuer);
      formData.append("recipientName", recipientName);
      formData.append("courseTitle", courseTitle);
      formData.append("issueDate", issueDate);
      formData.append("description", description);
      formData.append("file", file);
      formData.append("userWallet", recipientWalletAddress);

      const issuedCert = await issueCertificate(formData);

      const minted = await merkleCertificateNFT({
        certId: issuedCert.certificate.certId,
        recipientName: issuedCert.certificate.metadata.properties.recipientName,
        courseTitle: issuedCert.certificate.metadata.properties.courseTitle,
        issueDate: issuedCert.certificate.metadata.properties.issueDate,
        issuer: issuedCert.certificate.metadata.properties.issuer,
        userWallet: issuedCert.certificate.metadata.properties.issuedTo,
      });

      toast.success("✅ Certificate uploaded and verified!");
      setMintedCert(minted);
      setCertificateName("");
      setRecipientName("");
      setIssuer("");
      setRecipientWalletAddress("");
      setCourseTitle("");
      setIssueDate("");
      setDescription("");
      setFile(null);
      // in resetForm
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    } catch (error) {
      console.error("Upload/Mint error:", error);
      toast.error("Failed to upload and mint certificate.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Wallet:", walletAddress);
    console.log("Role:", role);
  }, [walletAddress, role]);

  return (
    <div className="p-4 my-20 lg:mt-24 flex  flex-col justify-center items-center ">
      <h1 className="text-2xl mb-6">Upload Certificate</h1>
      {!connected && (
        <p className="text-red-400 mb-4">Please connect your wallet.</p>
      )}
      {connected && !isAdmin && (
        <p className="text-red-400 mb-4">Access denied: Admins only.</p>
      )}

      <div className="flex flex-col gap-4 max-w-md">
        <input
          type="text"
          className="p-2 rounded-md border "
          placeholder="Certificate Name"
          value={certificateName}
          onChange={(e) => setCertificateName(e.target.value)}
          disabled={!isAdmin}
        />
        <input
          type="text"
          className="p-2 rounded-md border"
          placeholder="Recipient Name"
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value)}
          disabled={!isAdmin}
        />
        <input
          type="text"
          className="p-2 rounded-md border"
          placeholder="Issuer Name"
          value={issuer}
          onChange={(e) => setIssuer(e.target.value)}
          disabled={!isAdmin}
        />
        <input
          type="text"
          className="p-2 rounded-md border"
          placeholder="walletAddress"
          value={recipientWalletAddress}
          onChange={(e) => setRecipientWalletAddress(e.target.value)}
          disabled={!isAdmin}
        />
        <input
          type="text"
          className="p-2 rounded-md border"
          placeholder="Course Title"
          value={courseTitle}
          onChange={(e) => setCourseTitle(e.target.value)}
          disabled={!isAdmin}
        />
        <input
          type="date"
          className="p-2 rounded-md border "
          placeholder="Issue Date"
          value={issueDate}
          onChange={(e) => setIssueDate(e.target.value)}
          disabled={!isAdmin}
        />

        <textarea
          className="p-2 rounded-md border"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={!isAdmin}
        />

        <label className="border p-2 cursor-pointer w-[80vw] md:w-[60vw] lg:w-[30vw] rounded-2xl block">
          {file ? file.name : "Select a file"}
          <input
            type="file"
            ref={fileInputRef}
            // onChange={(e) => setFile(e.target.files?.[0] || null)}
            onChange={handleFileChange}
            className="hidden"
            required
            disabled={!isAdmin}
          />
        </label>

        <button
          onClick={handleUploadAndMint}
          className="px-4 py-2 bg-indigo-800 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          disabled={loading || !isAdmin}>
          {loading ? "Uploading...." : "Upload "}
        </button>
      </div>

      {/* {mintedCert && (
        <div className="mt-6 p-4 bg-green-800 rounded-md">
          <h2 className="text-lg font-semibold">
            Certificate Minted Successfully
          </h2>
          <p>
            Certificate ID:{" "}
            <span className="font-mono">{mintedCert.certId}</span>
          </p>
          <p>
            Mint Transaction ID:{" "}
            <span className="font-mono">{mintedCert.mintTxId}</span>
          </p>
        </div>
      )} */}
    </div>
  );
};

export default Upload;
