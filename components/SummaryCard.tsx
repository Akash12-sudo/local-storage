'use client';

import React from 'react';
import Link from 'next/link';
import FormattedDateTime from './FormattedDateTime';
import { Models } from 'node-appwrite';
import { convertFileSize, formatDateTime } from '@/lib/utils';

const SummaryCard = ({
  type,
  size,
  lastUpdated,
}: {
  type: string;
  size: number;
  lastUpdated: string;
}) => {
  const mapTypeIcon: { [key: string]: string } = {
    images: 'orange',
    documents: 'green',
    media: 'red',
    others: 'blue',
  };

  return (
    <Link
      href={`/${type}`}
      className="file-card h-auto duration-1000 animate-pulse"
    >
      <div className="w-full flex flex-col items-center text-center antialiased text-pretty">
        <div className="w-full flex justify-between items-center text-end text-sm font-medium text-slate-400">
          <div
            className={`w-4 h-4 rounded-full`}
            style={{ backgroundColor: mapTypeIcon[type] }}
          />
          {convertFileSize(size)}
        </div>
        <div className="flex border-b w-full justify-center text-center capitalize font-semibold pt-4 pb-2">
          {type}
        </div>
        <div className="flex flex-col gap-2 my-4">
          <p className="text-slate-400">Last Updated</p>
          <p className="text-slate-800">{formatDateTime(lastUpdated)}</p>
        </div>
      </div>
    </Link>
  );
};

export default SummaryCard;
