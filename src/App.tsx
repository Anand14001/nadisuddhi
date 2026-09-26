/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PillarsSection } from './components/PillarsSection';
import { AdvisorSection } from './components/AdvisorSection';
import { JourneySection } from './components/JourneySection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FaqSection } from './components/FaqSection';
import { FinalCtaSection } from './components/FinalCtaSection';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);

  const handleOpenBooking = () => {
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#140d27] text-[#ffffff] font-sans antialiased selection:bg-[#2433b3] selection:text-[#ffffff]">
      {/* Fixed Navigation Header */}
      <Navbar onOpenBooking={handleOpenBooking} />

      {/* Main Landing Sections */}
      <main>
        <Hero onOpenBooking={handleOpenBooking} />
        <PillarsSection onOpenBooking={handleOpenBooking} />
        <AdvisorSection onOpenBooking={handleOpenBooking} />
        <JourneySection onOpenBooking={handleOpenBooking} />
        <TestimonialsSection />
        <FaqSection onOpenBooking={handleOpenBooking} />
        <FinalCtaSection onOpenBooking={handleOpenBooking} />
      </main>

      {/* Footer */}
      <Footer onOpenBooking={handleOpenBooking} />

      {/* Booking Session Dialog */}
      <BookingModal isOpen={isBookingOpen} onClose={handleCloseBooking} />
    </div>
  );
}

