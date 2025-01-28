'use client';

import Image from 'next/image';
import React from 'react';
import Thumbnail from './Thumbnail';
import { formatDateTime } from '@/lib/utils';
import ActionsDropdown from './ActionsDropdown';
import { Models } from 'node-appwrite';

interface File {
  type: string;
  extension: string;
  url: string;
  name: string;
  $createdAt: string;
}

const RecentFilesUploaded = ({
  files,
  currentUser,
}: {
  files: Models.Document[];
  currentUser: Models.Document;
}) => {
  // console.log("See file...")
  // console.log(files);

  return (
    <div className=" w-full h-full p-2 rounded-2xl shadow-sm flex flex-col bg-white cursor-pointer hover:animate-pulse duration-200 ">
      <div className="header text-2xl font-bold antialiased tracking-wide text-pretty border-b border-slate-100 ">
        Recent uploads
      </div>
      {files.map((file, id) => (
        <div
          key={id}
          className="w-full flex justify-center items-start m-2 gap-x-4"
        >
          <Thumbnail
            type={file.type}
            extension={file.extension}
            url={file.url}
            className="!size-12 my-2"
            imageClassName="!size-6"
          />
          <div className="w-full h-full flex flex-row items-start justify-between gap-x-4 antialiased mt-2">
            <div className="w-full flex flex-col">
              <p className="w-1/2 text-sm font-medium line-clamp-1 text-wrap">
                {file.name}
              </p>
              <p className="w-1/2 text-slate-400">
                {formatDateTime(file.$createdAt)}
              </p>
            </div>
            <div className="w-1/3 h-full flex items-start justify-center mt-1">
              <ActionsDropdown file={file} currentUser={currentUser} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentFilesUploaded;
