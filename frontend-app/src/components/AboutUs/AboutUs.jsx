import React from 'react';
import './AboutUs.css';

import visionImg from '../../assets/vision.jpg';
import missionImg from '../../assets/mission.jpg';
import valuesImg from '../../assets/values.jpg';
import teamPlaceholder from '../../assets/team-placeholder.png';
import founder from '../../assets/founder.jpg';

import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const infoData = [
  {
    title: "Vision",
    text: `To be the leading provider of exceptional eatery and catering services,
      car hire, tents, chairs, and usher hiring. We are known for our commitment
      to quality, customer satisfaction, and a welcoming environment that reflects
      our faith-based principles.`,
    image: visionImg,
  },
  {
    title: "Mission",
    text: `To deliver outstanding culinary experiences that honor God and enrich the lives
      of our customers through exceptional services.`,
    image: missionImg,
  },
  {
    title: "Core Values",
    isList: true,
    listItems: [
      "Faith  We operate with integrity, guided by our Christian values.",
      "Community  We build strong relationships through our services.",
      "Customer Satisfaction  We are dedicated to exceeding expectations.",
      "Hospitality  We provide a warm and welcoming atmosphere for all.",
    ],
    image: valuesImg,
  },
];

// Team members array
const teamMembers = [
  {
    name: "Katende Ericc Njakasi",
    position: "Founder & CEO",
    image: founder,
    socials: {
      facebook: "https://facebook.com/",
      twitter: "https://twitter.com/",
      instagram: "https://instagram.com/",
      linkedin: "https://linkedin.com/"
    }
  },
  {
    name: "Jane Smith",
    position: "Head Chef",
    image: teamPlaceholder,
    socials: {
      facebook: "https://facebook.com/",
      twitter: "https://twitter.com/",
      instagram: "https://instagram.com/",
      linkedin: "https://linkedin.com/"
    }
  },
  {
    name: "Samuel Lee",
    position: "Operations Manager",
    image: teamPlaceholder,
    socials: {
      facebook: "https://facebook.com/",
      twitter: "https://twitter.com/",
      instagram: "https://instagram.com/",
      linkedin: "https://linkedin.com/"
    }
  }
];

const AboutUs = () => {
  return (
    <section className="aboutus-section">
      <div className="container">
        <h2 className="section-title">ABOUT US</h2>
        <p className="intro-text">
          Jesus Is Lord is a business dedicated to providing high-quality services with a touch of excellence and a heart of service.
          We are a food company passionate about providing mouth-watering meals, snacks, and drinks to satisfy every craving.
        </p>

        {infoData.map((block, index) => (
          <div key={index} className={`info-block ${index % 2 !== 0 ? 'reverse' : ''}`}>
            <img src={block.image} alt={block.title} />
            <div className="text-block">
              <h3>{block.title}</h3>
              {block.isList ? (
                <ul>
                  {block.listItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>{block.text}</p>
              )}
            </div>
          </div>
        ))}

        {/* Team Section */}
        <div className="team-section">
          <h3>OUR TEAMMATES</h3>
          <div className="team-members">
            {teamMembers.map((member, idx) => (
              <div className="team-card" key={idx}>
                <img src={member.image} alt={member.name} />
                <h4>{member.name}</h4>
                <p className="team-position">{member.position}</p>
                <div className="social-links">
                  <a href={member.socials.facebook} target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
                  <a href={member.socials.twitter} target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                  <a href={member.socials.instagram} target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                  <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer"><FaLinkedinIn /></a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
