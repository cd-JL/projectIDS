import React from 'react'

function Ecommerce() {
  return (
    // <div>Ecommerce</div>
    <main className=" bg-white text-black">
  
    {/* COMPANY INTRO VIDEO SECTION */}
    <section className="relative h-screen w-full">
        <div className="absolute top-1/4  left-10  text-start z-10">
            <h1 className="font-black text-3xl mb-4">
                PROJECT VD <br /> Cyber Security Detector
            </h1>
            <p>Project VD application can detect any vulnerabilites on your computers <br /> (Only Windows computers for now)</p>
        </div>

        <video
            className="w-full h-full object-cover z-0"
            loop
            autoPlay
            muted
            src=""
        />
    </section>

    {/* BRAND PARTNERS SECTION */}
    <section className="mt-20">
        <h2 className=" font-bold text-2xl mb-12 ml-20">Better Way To Protect Your Computer </h2>
        <div className=" flex justify-between px-24">
            <div>More Safe</div>
            <div>More Secure</div>
            <div>More Trust</div>
        </div>
    </section>

    {/* ABOUT SECTION */}
    <section className=" flex mt-20">
        <div className=" basis-1/2 flex-col pl-24">
            <h2 className="font-black text-3xl text-black mb-4">Connect, Protect and Build Everywhere</h2>
            <p className=" mt-7">Our cybersecurity application ensures your digital assets are protected with advanced threat detection and round-the-clock monitoring.</p>
            {/* <Link href="/get-quote">
                <button type="button" className="bg-orange-500 hover:bg-orange-400 text-white py-4 px-3 rounded-md block w-2/5 border border-black mt-16">
                    GOT A PROJECT? LET’S TALK
                </button>
            </Link> */}
        </div>
        <div className=" basis-1/2">
            <img className=" w-full h-full px-10"
              
               
                src="https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            />
        </div>
    </section>
       <section className=" flex mt-20">
        <div className=" basis-1/2 flex-col pl-24">
            <h2 className="font-black text-3xl text-black mb-4">Project VD Info</h2>
            <p className=" mt-7">Our application scans your computer for vulnerabilities, identifying potential security risks before they can be exploited. Using real-time threat detection, it provides immediate alerts and recommendations to safeguard your system. With regular updates, it ensures protection against the latest cybersecurity threats.</p>
            {/* <Link href="/get-quote">
                <button type="button" className="bg-orange-500 hover:bg-orange-400 text-white py-4 px-3 rounded-md block w-2/5 border border-black mt-16">
                    GOT A PROJECT? LET’S TALK
                </button>
            </Link> */}
        </div>
        <div className=" basis-1/2">
            <img className=" w-full h-full px-10"
                // controls
                // muted
                src="https://images.pexels.com/photos/9783346/pexels-photo-9783346.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            />
        </div>
    </section>

    {/* 3 REASONS TO WORK WITH US */}
    <section className="mt-20 px-20">
        <h2 className=" text-3xl font-black text-black">Common Cybersecurity Risk</h2>
        <div className=" flex justify-between">
            <div>
                <div><h3 className=" font-bold text-xl my-10">Phishing Attacks</h3></div>
                <div><p>Malware that encrypts a victim's data and demands a ransom for its release, often leading to significant financial and operational damage.</p></div>
            </div>
            <div>
                <div><h3 className=" font-bold text-xl my-10">Ransomware</h3></div>
                <div><p>We amplify your message by creating custom-designed content <br /> tailored for social media and global audiences.</p></div>
            </div>
            <div>
                <div><h3 className=" font-bold text-xl my-10">Data Breaches</h3></div>
                <div><p>Unauthorized access to sensitive information, potentially resulting in identity theft, financial loss, and reputational harm for organizations.</p></div>
            </div>

        </div>
        {/* <div className=" flex justify-center">
            <Link href="/get-quote">
                <button type="button" className=" bg-orange-500 hover:bg-orange-400 text-white py-4 px-3 rounded-md block border border-black mt-16">
                    BOOK A CALL
                </button>
            </Link>
        </div> */}
    </section>

    {/* VIDEO TYPE SECTION */}
    <section className="mt-20 px-20">
        <h2 className=" text-3xl font-black ">Improve your computer protection</h2>
        <p className=" mt-7">Regularly updating software and using strong, unique passwords can significantly enhance your computer's protection against threats.</p>
        {/* <div className=" flex justify-between mt-10">
            <TypeOfVideos title="PRMOTIONAL VIDEO" src="" />
            <TypeOfVideos title="CORPORATE VIDEO" src="" />
            <TypeOfVideos title="SOCIAL VIDEO MARKETING" src="" />

        </div> */}
    </section>

    {/* SECTOR OF EXPERIENCE*/}
    <section className="mt-20 px-20">
        <h2 className=" text-3xl font-black ">SECTOR OF EXPERIENCE</h2>
        <p className=" mt-7">Whether you're a global enterprise, a dynamic start-up, or an individual looking to secure your personal devices, we're here to provide the cybersecurity solutions you need to stay protected and secure.</p>
        {/* <div className=" flex justify-between mt-10">
            <TypeOfVideos title="FASHION" src="" />
            <TypeOfVideos title="FOOD" src="" />
            <TypeOfVideos title="REAL ESTATE" src="" />

        </div> */}
    </section>

    {/* SAMPLE WORK SECTION */}
    {/* <section className="mt-20 px-20">
        <h2 className=" text-3xl font-black ">EXAMPLES OF WORK</h2>
        <div className=" flex justify-between mt-10">
            <ExamplesOfWork title="AFRICAN FASHION WEEK CALGARY" description=" FASHION RUNWAY SHOW" src="" />
            <ExamplesOfWork title="GOLDMARKIST" description=" MUSIC VIDEO PRODUCTION" src="" />
            <ExamplesOfWork title="BLACK HISTORY MONTH" description="Diversity and Inclusion" src="" />
        </div>
        <div className=" flex justify-between mt-10">
            <ExamplesOfWork title="AFRICAN FASHION WEEK CALGARY" description=" FASHION RUNWAY SHOW" src="" />
            <ExamplesOfWork title="GOLDMARKIST" description=" MUSIC VIDEO PRODUCTION" src="" />
            <ExamplesOfWork title="BLACK HISTORY MONTH" description="Diversity and Inclusion" src="" />
        </div>
    </section> */}

    {/* METRICS SECTION */}
    <section className="mt-20 px-20">
        <h2 className=" text-3xl font-black ">Best Protection Option For Your Device</h2>
        <div className=" flex justify-between">
            <div>
                {/* <div className=" mt-10 mb-5">Logo 1</div> */}
                <div><h3 className=" font-bold text-xl mb-5">Regular Software Updates</h3></div>
                <div><p>Install reputable antivirus software that offers <br />real-time threat detection, malware removal, 
                <br />and firewall protection to shield your <br />computer 
                from viruses, spyware, and other malicious programs.</p></div>
                {/* <div>
                    <Link href="">
                        <h3 className=" font-bold text-sm mt-10 hover:text-gray-600">READ FULL CASE STUDY &rarr;</h3>
                    </Link>
                </div> */}
            </div>
            <div>
                {/* <div className=" mt-10 mb-5">Logo 1</div> */}
                <div><h3 className=" font-bold text-xl mb-5">Comprehensive Antivirus Software</h3></div>
                <div><p>Keep your operating system, applications, <br />and security tools up-to-date <br />to patch 
                vulnerabilities and prevent cybercriminals 
                <br />from exploiting outdated software.</p></div>
                {/* <div>
                    <Link href="">
                        <h3 className=" font-bold text-sm mt-10 hover:text-gray-600">READ FULL CASE STUDY &rarr;</h3>
                    </Link>
                </div> */}
            </div>
            <div>
                {/* <div className=" mt-10 mb-5">Logo 1</div> */}
                <div><h3 className=" font-bold text-xl mb-5">Multi-Factor Authentication (MFA)</h3></div>
                <div><p>An Advertising Campaign to raise <br />awareness for a career in Higher <br />Education.</p></div>
                {/* <div>
                    <Link href="">
                        <h3 className=" font-bold text-sm mt-10 hover:text-gray-600">READ FULL CASE STUDY &rarr;</h3>
                    </Link>
                </div> */}
            </div>
        </div>
    </section>

    {/* PROJECT STEPS SECTION */}
    <section className="mt-20 px-20">
        <h2 className=" text-3xl font-bold ">GETTING STARTED</h2>
        <p className=" mt-7">Keep your device safe, relax and enjoy.</p>
        <div className=" flex justify-between">
            <div>
                <div><h3 className=" font-bold text-xl my-10">BOOK A CALL</h3></div>
                <div><p>Discover how our cybersecurity solutions can <br />protect your digital assets with tailored <br />strategies and expert guidance.</p></div>
            </div>
            <div>
    <div><h3 className="font-bold text-xl my-10">MEET THE TEAM</h3></div>
    <div><p>Meet our dedicated cybersecurity experts <br />who are committed to keeping your systems <br />secure and your data protected.</p></div>
</div>
            {/* <div>
                <div><h3 className=" font-bold text-xl my-10">MEET THE TEAM</h3></div>
                <div><p>We communicate the value of <br />complex tech products with clear <br />and simple storytelling and a <br />touch of creative flair.</p></div>
            </div>
        </div>
        <div className=" flex">
            <div>
                <div><h3 className=" font-bold text-xl my-10">PROJECT KICK-OFF</h3></div>
                <div><p>We communicate the value of <br />complex tech products with clear <br />and simple storytelling and a <br />touch of creative flair.</p></div>
            </div> */}
            {/* <div className=" ml-80 pt-8">
                <Link href="/get-quote">
                    <button type="button" className=" bg-orange-500 hover:bg-orange-400 text-white py-4 px-3 rounded-md block border border-black mt-16">
                        BOOK A CALL
                    </button>
                </Link>
            </div> */}
        </div>
    </section>

    {/* SERVICE PROPOSAL SECTION */}
    {/* <section className="mt-20 px-20"> */}
        {/* <h2 className=" text-3xl font-bold text-black">WHY VIDEO MARKETING?</h2>
        <div className=" flex justify-between">
            <div>
                <div><h3 className=" font-bold text-xl my-10">INCREASED ENGAGEMENT</h3></div>
                <div><p>We communicate the value of <br />complex tech products with clear <br />and simple storytelling and a <br />touch of creative flair.</p></div>
            </div>
            <div>
                <div><h3 className=" font-bold text-xl my-10">BROADER REACH</h3></div>
                <div><p>We communicate the value of <br />complex tech products with clear <br />and simple storytelling and a <br />touch of creative flair.</p></div>
            </div>
            <div>
                <div><h3 className=" font-bold text-xl my-10">STRONGER BRAND IDENTIY</h3></div>
                <div><p>We communicate the value of <br />complex tech products with clear <br />and simple storytelling and a <br />touch of creative flair.</p></div>
            </div>
        </div>
        <div className=" flex justify-between">
            <div>
                <div><h3 className=" font-bold text-xl my-10">VISUAL EXPLANATION</h3></div>
                <div><p>We communicate the value of <br />complex tech products with clear <br />and simple storytelling and a <br />touch of creative flair.</p></div>
            </div>
            <div>
                <div><h3 className=" font-bold text-xl my-10">BUILDING TRUST</h3></div>
                <div><p>We communicate the value of <br />complex tech products with clear <br />and simple storytelling and a <br />touch of creative flair.</p></div>
            </div> */}
            {/* <div className=" pt-8">
                <Link href="/get-quote">
                    <button type="button" className=" bg-orange-500 hover:bg-orange-400 text-white py-4 px-3 rounded-md block border border-black mt-16 mr-28">
                        BOOK A CALL
                    </button>
                </Link>
            </div> */}
        {/* </div>
    </section> */}
    {/* FAQ SECTION */}
    <section className="mt-20 px-20">
        <h2 className=" text-3xl font-bold text-black">FAQ</h2>
        <div className=" flex justify-center">
            <div className="mr-72">
                <details>
                    <summary className=" my-10"><h3 className=" font-bold text-xl">WHAT OTHER SECURITY SERVICES DOES PROJECT VD OFFERS?</h3>
                    </summary>
                    <p>BLAH BLAH BLAH BLAH.</p>
                </details>
            </div>
            <div className="ml-72">
                <details>
                    <summary className=" my-10"><h3 className=" font-bold text-xl">HOW LONG DOES THE PROTECTION LAST?</h3>
                    </summary>
                    <p></p>
                </details>
            </div>
        </div>
        <div className=" flex justify-center">
            <div className="mr-72">
                <details>
                    <summary className=" my-10"><h3 className=" font-bold text-xl">IS THERE A LIMIT TO THE PROTECTIONS?</h3>
                    </summary>
                    <p></p>
                </details>
            </div>
            <div className="ml-72">
                <details>
                    <summary className=" my-10"><h3 className=" font-bold text-xl">HOW MANY DEVICE CAN BE PROTECTED?</h3>
                    </summary>
                    <p></p>
                </details>
            </div>
        </div>
        <div className=" flex justify-center">
            <div className="mr-72">
                <details>
                    <summary className=" my-10"><h3 className=" font-bold text-xl">WHAT TYPE OF DEVICE?</h3>
                    </summary>
                    <p></p>
                </details>
            </div>
            <div className="ml-72">
                <details>
                    <summary className=" my-10"><h3 className=" font-bold text-xl">HOW LONG DOES THE SERVICE TAKE?</h3>
                    </summary>
                    <p></p>
                </details>
            </div>
        </div>
    </section>
</main>
    
  )
}

export default Ecommerce