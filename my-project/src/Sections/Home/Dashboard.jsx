
// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { fetchCertificates } from "../../Services/api";
import CertificateCard from "../../Components/CertificateCard";
import SkeletonCertificate from "../../Components/SkeletonCertificate";
import { useAppContext } from "../../Context/AppContext";

const Dashboard = () => {
  const { publicKey, connected } = useWallet();
  const { role } = useAppContext();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCertificates = async () => {
      if (!connected || !publicKey) return;
      setLoading(true);
      try {
        const wallet = publicKey.toString();
        const certs = await fetchCertificates(wallet);
        setCertificates(certs);
      } catch (error) {
        console.error("Error loading certificates:", error.message || error);
      } finally {
        setLoading(false);
      }
    };

    loadCertificates();
  }, [connected, publicKey]);

  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center lg:mt-24 py-[200px] px-10 lg:mx-20 text-white bg-slate-900">
        <h2 className="text-2xl mb-4 font-semibold">Connect your wallet to view certificates</h2>
        <p className="text-gray-400">Click the "Connect Wallet" button in the header to get started.</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:my-28 mt-16 mb-28 min-h-screen lg:mr-10 text-white rounded-2xl bg-slate-900">
      <h1 className="text-3xl text-center font-bold mb-6">Your Certificates</h1>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCertificate key={i} />
          ))}
        </div>
      ) : certificates.length === 0 ? (
        <div className="text-center mt-20 text-gray-400">
          <h2 className="text-xl font-semibold mb-2">
            {role === "admin"
              ? "No certificates available for admin accounts."
              : "No certificates found."}
          </h2>
          <p>
            {role === "admin"
              ? "Admin accounts can issue and mint certificates, but they don't receive them."
              : "Once you complete a course or receive a certificate, it will appear here."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <CertificateCard
              key={cert._id}
              metadata={cert.metadata}
              certId={cert.certId}
              mintTxId={cert.mintTxId}
              imageURL={cert.imageURL}
              ipfsHash={cert.ipfsHash}
              merkleRoot={cert.merkleRoot}
              solanaTx={cert.solanaTx}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
