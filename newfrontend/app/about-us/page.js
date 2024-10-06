"use client";
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link'; // Import Link from next/link
import NavBar from "@/app/_components/nav-bar";
import Footer from "@/app/_components/footer";

// IntersectionObserver for triggering animations when elements enter the viewport
const useOnScreen = (ref) => {
    const [isIntersecting, setIntersecting] = useState(false);

    useEffect(() => {
        if (!ref.current) return; // Check if ref is initialized

        const observer = new IntersectionObserver(([entry]) => {
            setIntersecting(entry.isIntersecting);
        });

        observer.observe(ref.current);

        return () => observer.disconnect();
    }, [ref]);

    return isIntersecting;
};

const AboutUs = () => {
    // Refs for scroll animation on sections
    const heroRef = useRef(null);
    const reasonsRef = useRef(null);
    const missionRef = useRef(null);
    const workRef = useRef(null);
    const teamRef = useRef(null);
    const timelineRef = useRef(null);
    const valuesRef = useRef(null);
    const testimonialsRef = useRef(null);
    const ctaRef = useRef(null);

    const heroVisible = useOnScreen(heroRef);
    const reasonsVisible = useOnScreen(reasonsRef);
    const missionVisible = useOnScreen(missionRef);
    const workVisible = useOnScreen(workRef);
    const teamVisible = useOnScreen(teamRef);
    const timelineVisible = useOnScreen(timelineRef);
    const valuesVisible = useOnScreen(valuesRef);
    const testimonialsVisible = useOnScreen(testimonialsRef);
    const ctaVisible = useOnScreen(ctaRef);

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: '1.6', backgroundColor: '#FFFFFF' }}>
            {/* Navbar */}
            <NavBar />

            {/* Hero Section */}
            <section
                ref={heroRef}
                style={{
                    textAlign: 'center',
                    padding: '10rem 2rem 4rem',
                    backgroundColor: '#FFFFFF',
                    color: '#000000',
                    borderBottom: '2px solid #f46b02',
                    transform: heroVisible ? 'scale(1)' : 'scale(0.95)',
                    opacity: heroVisible ? 1 : 0,
                    transition: 'transform 0.5s ease, opacity 0.5s ease',
                }}
            >
                <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Why Choose On The Go?</h1>
                <p style={{ fontSize: '1.5rem' }}>
                    We are a creative media production company with a passion for storytelling and cutting-edge technology. Discover why we're the best choice for your next project!
                </p>
            </section>

            {/* Reasons to Choose Us Section */}
            <section
                ref={reasonsRef}
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    padding: '3rem 2rem',
                    maxWidth: '1200px',
                    margin: 'auto',
                    color: '#000000',
                    transform: reasonsVisible ? 'scale(1)' : 'scale(0.95)',
                    opacity: reasonsVisible ? 1 : 0,
                    transition: 'transform 0.5s ease, opacity 0.5s ease',
                }}
            >
                <div style={{ flex: '1', paddingRight: '2rem', minWidth: '300px' }}>
                    <h2 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem', color: '#000000' }}>3 Reasons to Choose Us</h2>
                    <div>
                        <h3 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#000000' }}>01 <span style={{ color: '#f46b02' }}>Creative Storytelling</span></h3>
                        <p style={{ fontSize: '1.25rem', color: '#666' }}>
                            We engage and inspire your audience with clear and simple storytelling that connects deeply and leaves an impression.
                        </p>
                    </div>
                    <div>
                        <h3 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#000000' }}>02 <span style={{ color: '#f46b02' }}>Maximize Your Reach</span></h3>
                        <p style={{ fontSize: '1.25rem', color: '#666' }}>
                            We take your content further with custom-designed content that is optimized for various platforms, from social media to international markets.
                        </p>
                    </div>
                    <div>
                        <h3 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#000000' }}>03 <span style={{ color: '#f46b02' }}>Fully Managed Process</span></h3>
                        <p style={{ fontSize: '1.25rem', color: '#666' }}>
                            We handle everything for you, from pre-production to post-production, so you can sit back while we do the hard work.
                        </p>
                    </div>
                </div>
                <div style={{ flex: '1', minWidth: '300px' }}>
                    <img
                        src="https://via.placeholder.com/400x300"
                        alt="Why Choose Us Visual"
                        style={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: '10px',
                            border: '1px solid #f46b02',
                            transition: 'transform 0.3s ease',
                            cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                </div>
            </section>

            {/* Mission Section */}
            <section
                ref={missionRef}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: '5rem 2rem',
                    backgroundColor: '#f46b02',
                    color: '#FFFFFF',
                    transform: missionVisible ? 'scale(1)' : 'scale(0.95)',
                    opacity: missionVisible ? 1 : 0,
                    transition: 'transform 0.5s ease, opacity 0.5s ease',
                }}
            >
                <h2 style={{ fontSize: '3rem', fontWeight: 'bold' }}>Our Mission</h2>
                <p style={{ fontSize: '1.5rem', maxWidth: '800px', margin: '1rem 0' }}>
                    At <strong>On The Go</strong>, we turn ideas into visual narratives that leave lasting impressions. With a passion for pushing creative boundaries, we bring innovative concepts to life and ensure that every project meets the highest standards of quality and engagement.
                </p>
            </section>

            {/* Company Timeline Section */}
            <section
                ref={timelineRef}
                style={{
                    padding: '5rem 2rem',
                    backgroundColor: '#FFFFFF',
                    color: '#000000',
                    borderTop: '2px solid #f46b02',
                }}
            >
                <h2 style={{ textAlign: 'center', fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem' }}>Our Journey</h2>
                <div style={{ maxWidth: '800px', margin: 'auto', position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3rem' }}>
                        <div style={{ flex: '1', paddingRight: '1rem' }}>
                            <h3 style={{ fontSize: '1.8rem', color: '#f46b02' }}>2015</h3>
                            <p>Founded as a small media production company.</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3rem' }}>
                        <div style={{ flex: '1', paddingRight: '1rem' }}>
                            <h3 style={{ fontSize: '1.8rem', color: '#f46b02' }}>2017</h3>
                            <p>Produced our first award-winning documentary.</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '3rem' }}>
                        <div style={{ flex: '1', paddingRight: '1rem' }}>
                            <h3 style={{ fontSize: '1.8rem', color: '#f46b02' }}>2021</h3>
                            <p>Expanded our services to international markets.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section
                ref={teamRef}
                style={{
                    padding: '4rem 2rem',
                    backgroundColor: '#f9f9f9',
                    textAlign: 'center',
                    color: '#000',
                }}
            >
                <h2 style={{ fontSize: '3rem', fontWeight: 'bold' }}>Meet Our Team</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', gap: '2rem', marginTop: '2rem' }}>
                    {[
                        { name: 'John Doe', position: 'CEO', image: 'https://via.placeholder.com/150' },
                        { name: 'Jane Smith', position: 'Creative Director', image: 'https://via.placeholder.com/150' },
                        { name: 'Mike Johnson', position: 'Producer', image: 'https://via.placeholder.com/150' },
                    ].map((member) => (
                        <div key={member.name} style={{ width: '200px' }}>
                            <img
                                src={member.image}
                                alt={member.name}
                                style={{ width: '100%', borderRadius: '50%', marginBottom: '1rem' }}
                            />
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{member.name}</h3>
                            <p style={{ fontSize: '1.2rem', color: '#666' }}>{member.position}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Core Values Section */}
            <section
                ref={valuesRef}
                style={{
                    padding: '5rem 2rem',
                    backgroundColor: '#f4f4f4',
                    color: '#000',
                    textAlign: 'center',
                }}
            >
                <h2 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem' }}>Our Core Values</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', gap: '2rem' }}>
                    {[
                        { title: 'Creativity', description: 'We value creativity and originality in every aspect of our work.' },
                        { title: 'Customer Focus', description: 'Our clients are at the core of everything we do.' },
                        { title: 'Innovation', description: 'Constant innovation keeps us ahead of industry trends.' },
                    ].map((value, index) => (
                        <div key={index} style={{ width: '300px' }}>
                            <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f46b02' }}>{value.title}</h3>
                            <p style={{ fontSize: '1.25rem', color: '#666' }}>{value.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Testimonials Section */}
            <section
                ref={testimonialsRef}
                style={{
                    padding: '5rem 2rem',
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    textAlign: 'center',
                    borderTop: '2px solid #f46b02',
                }}
            >
                <h2 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem' }}>What Our Clients Say</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', gap: '2rem' }}>
                    {[
                        {
                            name: 'Emily Rose',
                            feedback: 'On The Go helped bring our ideas to life with amazing creativity and professionalism.',
                            image: 'https://via.placeholder.com/150',
                        },
                        {
                            name: 'David White',
                            feedback: 'The team went above and beyond. I was impressed with their attention to detail.',
                            image: 'https://via.placeholder.com/150',
                        },
                    ].map((testimonial) => (
                        <div key={testimonial.name} style={{ maxWidth: '300px', textAlign: 'center' }}>
                            <img
                                src={testimonial.image}
                                alt={testimonial.name}
                                style={{ width: '80px', borderRadius: '50%', marginBottom: '1rem' }}
                            />
                            <p style={{ fontSize: '1.25rem', fontStyle: 'italic', color: '#666' }}>"{testimonial.feedback}"</p>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '1rem' }}>{testimonial.name}</h3>
                        </div>
                    ))}
                </div>
            </section>

            {/* Call to Action (CTA) Section */}
            <section
                ref={ctaRef}
                style={{
                    padding: '4rem 2rem',
                    backgroundColor: '#f46b02',
                    color: '#ffffff',
                    textAlign: 'center',
                }}
            >
                <h2 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>Ready to Start Your Project?</h2>
                <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
                    Get in touch with us today, and let’s bring your vision to life.
                </p>
                <Link href="/get-quote">
                    <button
                        style={{
                            padding: '1rem 2rem',
                            fontSize: '1.25rem',
                            backgroundColor: '#ffffff',
                            color: '#f46b02',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        Contact Us
                    </button>
                </Link>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default AboutUs;
