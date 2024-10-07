import DefaultLayout from '@/components/Layouts/DefaultLayout';

function ProfilePage() {
  return (
    <DefaultLayout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <div className="flex flex-col items-center">
          <img
            src={"/images/user/user-01.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-gray-300 mb-4"
          />
          <h2 className="text-2xl font-semibold text-gray-800">John Doe</h2>
          <p className="text-gray-600">Company XYZ</p>
        </div>

       
        
      </div>
    </div>
    </DefaultLayout>
    
  );
}

export default ProfilePage;
