import React from 'react';
import Hero from '../components/home/Hero';
import SearchBar from '../components/home/SearchBar';
import TrustBadges from '../components/home/TrustBadges';
import FeaturedPackages from '../components/home/FeaturedPackages';
import Services from '../components/home/Services';
import HowItWorks from '../components/home/HowItWorks';
import Testimonials from '../components/home/Testimonials';
import Stats from '../components/home/Stats';
import CallToAction from '../components/home/CallToAction';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <Hero />
      <SearchBar />
      <TrustBadges />
      <FeaturedPackages />
      <Services />
      <HowItWorks />
      <Stats />
      <Testimonials />
      <CallToAction />
    </div>
  );
};

export default HomePage;
