import Card from '@/components/Card';
import Sort from '@/components/Sort';
import { getFiles, getTotalSpaceUsed } from '@/lib/actions/file.actions';
import { fetchCurrentUser } from '@/lib/actions/user.action';
import { convertFileSize, getFileType, getFileTypesParams } from '@/lib/utils';
import { Models } from 'node-appwrite';
import React from 'react';

const Page = async ({ searchParams, params }: SearchParamProps) => {
  const type = ((await params)?.type as string) || ''; // { images, documents, media, others }
  const searchText = ((await searchParams)?.query as string) || '';
  const sort = ((await searchParams)?.sort as string) || '';

  const types = getFileTypesParams(type) as FileType[];

  const files = await getFiles({ types, searchText, sort });
  const totalSpace = await getTotalSpaceUsed();

  const currentUser = await fetchCurrentUser();

  console.log('Current User ...', currentUser);
  console.log('Total Space ...', totalSpace);
  // console.log('Type & types', type, types);

  let extractTotalTypeSize = 0;
  types.forEach((type) => (extractTotalTypeSize += totalSpace[type].size));

  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="h1 capitalize">{type}</h1>

        <div className="total-size-section">
          <p className="body-1">
            Total:{' '}
            <span className="h5">{convertFileSize(extractTotalTypeSize)}</span>
          </p>

          <div className="sort-container">
            <p className="body-1 hidden sm:block text-light-200">Sort by:</p>
            <Sort />
          </div>
        </div>
      </section>

      {files.total > 0 ? (
        <section className="file-list">
          {files.documents.map((file: Models.Document) => (
            <Card key={file.$id} file={file} currentUser={currentUser} />
          ))}
        </section>
      ) : (
        <p className="empty-list">No files uploaded</p>
      )}
    </div>
  );
};

export default Page;
