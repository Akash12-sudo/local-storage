import { getFiles, getTotalSpaceUsed, getTypeDetailsSummary } from '@/lib/actions/file.actions';
import Chart from '@/components/Chart';
import SummaryCard from '@/components/SummaryCard';
import RecentFilesUploaded from '@/components/RecentFilesUploaded';
import { fetchCurrentUser } from '@/lib/actions/user.action';
import SignIn from '../(auth)/sign-in/page';

const Dashboard = async () => {

  const [files, currentUser, totalSpace, typeSummary] = await Promise.all([
    getFiles({ types: [], limit: 10 }),
    fetchCurrentUser(),
    getTotalSpaceUsed(),
    getTypeDetailsSummary()
  ]);

  const types = ["images", 'documents', 'media', 'others'];

  // console.log('Types Summary... ', typeSummary);
  if (!currentUser) {
    // return router.push('/sign-in');
  }

  return (
    <div className="dashboard-container">
      <section>
        <Chart used={totalSpace?.used || 0} />
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-8 my-8'>
          {types.map((type, id) => (
            <SummaryCard key={id} type={type} size={typeSummary[type].size} lastUpdated={typeSummary[type].lastUpdated} />
          ))}
        </div>
      </section>
      <RecentFilesUploaded files={files.documents} currentUser={currentUser} />
      {/* <SummaryCard type="image" totalSpace={totalSpace} /> */}
    </div>
  );
};

export default Dashboard;
