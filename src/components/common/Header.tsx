"use client";
import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <div className="h-20 bg-card  w-full flex justify-between items-center px-20">
      <div className="flex w-full items-center justify-between">
        <div className="text-primary font-bold text-xl">
          Plant Diseases Detection System
        </div>
        <div className="flex gap-10 items-center">
          <Link href={"/scan"} className="text-white">
            Scan
          </Link>
          <div>
            {/* profile menu */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
