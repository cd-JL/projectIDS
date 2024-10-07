
import Breadcrumb from "../Breadcrumbs/Breadcrumb";

const Calendar = () => {
  return (
    <div className="mx-auto max-w-7xl">
         {/* Hero Section with Background Video */}
      <section className="relative h-screen w-full flex justify-center items-center z-0">
        {/* Background video */}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          src="/back-round2.mp4"
          autoPlay
          loop
          muted
        />
        {/* Overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>

        {/* Text and Button */}
        <div className="relative z-10 text-center text-white">
          <h1 className="text-6xl font-bold mb-6">Security Services</h1>
          <button className="bg-white text-black px-8 py-4 text-xl rounded-full hover:bg-gray-600 transition duration-300">
            See more!
          </button>
        </div>
      </section>

      {/* Services Section with Filters */}
      <section className="py-20 bg-gray-100 z-10 relative">
        <div className="container mx-auto">
          <h2 className="text-5xl font-bold text-center mb-12">Protect your Device</h2>

          {/* Services Cards with Hover Effects */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Promotional Video */}
            <div className="group relative bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <img
                src="https://images.pexels.com/photos/2148216/pexels-photo-2148216.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Promotional Video"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-75 transition duration-300 flex justify-center items-center">
                <button className="bg-white text-black px-6 py-2 rounded-full text-lg opacity-0 group-hover:opacity-100 transition duration-300">
                Choose this option
                </button>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">Protect your own computer</h3>
                <p>This option will let you protect only one device or computer.</p>
              </div>
            </div>

            {/* Corporate Video */}
            <div className="group relative bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <img
                src="https://images.pexels.com/photos/4158/apple-iphone-smartphone-desk.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Corporate Video"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-75 transition duration-300 flex justify-center items-center">
                <button className="bg-white text-black px-6 py-2 rounded-full text-lg opacity-0 group-hover:opacity-100 transition duration-300">
                Choose this option
                </button>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">Protect your whole family and friends device</h3>
                <p>This option will let you protect up to 10 users, additional user will lead to increasing cost.</p>
              </div>
            </div>

            {/* Protect your business */}
            <div className="group relative bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <img
                src="https://www.sralab.org/sites/default/files/styles/hero_full_width_1200_800_/public/2023-02/istockphoto-1340023944-170667a.jpg?itok=xtwe-zeh"
                alt="Protect your business"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-75 transition duration-300 flex justify-center items-center">
                <button className="bg-white text-black px-6 py-2 rounded-full text-lg opacity-0 group-hover:opacity-100 transition duration-300">
                  Choose this option
                </button>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">Protect your Business</h3>
                <p>This option will let you protect unlimited device and computer within your bussiness.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial or Need a Video Section */}
      <section className="bg-black text-white py-16 text-center">
        <h2 className="text-4xl font-bold mb-6">Want to know more?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Let's turn your computer and device to the safest it can ever be.
        </p>
        <a className="bg-white text-black px-8 py-4 rounded-full hover:bg-gray-200 transition duration-300">
          Learn more about cyber security →
        </a>
      </section>
    </div>
  );
};

export default Calendar;
