// Components/SkeletonCertificateCard.jsx
import React from "react";

const SkeletonCertificateCard = () => {
  return (
    <div className="bg-slate-800 p-4 rounded-xl animate-pulse h-48 flex flex-col justify-between space-y-4">
      <div className="h-5 bg-slate-700 rounded w-3/4" />
      <div className="h-4 bg-slate-700 rounded w-1/2" />
      <div className="h-3 bg-slate-700 rounded w-full" />
      <div className="h-3 bg-slate-700 rounded w-5/6" />
    </div>
  );
};

export default SkeletonCertificateCard;
