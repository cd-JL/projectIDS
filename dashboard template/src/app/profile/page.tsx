import DefaultLayout from '@/components/Layouts/DefaultLayout';

function ProfilePage() {
  return (
    <DefaultLayout>
      <div className=" flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-full max-h-full">
        <div className="flex flex-col items-center h-80">
          <img
            src={"/images/user/user-01.png"}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-gray-300 mb-4"
          />
          <h2 className="text-2xl font-semibold text-gray-800">Username</h2>
          <h3 className="text-xl font-semibold text-gray-800">Company XYZ</h3>
          <p className="text-gray-600">email@xyz.com</p>
          <p className="text-gray-600">role</p>

        </div>

       
        
      </div>
    </div>
    </DefaultLayout>
    
  );
}

export default ProfilePage;
