"use client"

import React, { useState, useEffect } from "react";
import { ChevronLeft, MapPin, Search } from "lucide-react";

const API_BASE = "http://localhost:5000/api/";

// Type definitions
interface PromoCode {
  type: "percentage" | "flat";
  value: number;
}

interface Slot {
  date: string;
  time: string;
  available: number;
}

interface Experience {
  _id: string;
  title: string;
  location: string;
  description: string;
  fullDescription: string;
  price: number;
  imageUrl: string;
  dates: string[];
  slots: Slot[];
}

interface BookingData {
  fullName: string;
  email: string;
  promoCode: string;
  agreedToTerms: boolean;
}

interface BookingResult {
  success: boolean;
  message: string;
  bookingId: string | null;
}

const promoCodes: Record<string, PromoCode> = {
  SAVE10: { type: "percentage", value: 10 },
  FLAT100: { type: "flat", value: 100 },
};

function App() {
  const [page, setPage] = useState<string>("home");
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [bookingData, setBookingData] = useState<BookingData>({
    fullName: "",
    email: "",
    promoCode: "",
    agreedToTerms: false,
  });
  const [promoDiscount, setPromoDiscount] = useState<number>(0);
  const [promoApplied, setPromoApplied] = useState<boolean>(false);
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}experiences`);
      const data = await response.json();

      const list = Array.isArray(data) ? data : data.experiences || [];
      setExperiences(list);
      console.log(list);
    } catch (error) {
      console.error("Error fetching experiences:", error);
      setExperiences([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchExperienceDetails = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}experiences/${id}`);
      const data: Experience = await response.json();
      setSelectedExperience(data);
      setSelectedDate(data.dates?.[0] || "");
      setPage("details");
    } catch (error) {
      console.error("Error fetching experience details:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyPromoCode = () => {
    const code = bookingData.promoCode.toUpperCase();
    if (promoCodes[code] && selectedExperience) {
      const promo = promoCodes[code];
      let discount = 0;
      const subtotal = selectedExperience.price * quantity;

      if (promo.type === "percentage") {
        discount = (subtotal * promo.value) / 100;
      } else {
        discount = promo.value;
      }

      setPromoDiscount(discount);
      setPromoApplied(true);
    } else {
      alert("Invalid promo code");
    }
  };

  const handleBooking = async () => {
    if (
      !bookingData.fullName ||
      !bookingData.email ||
      !bookingData.agreedToTerms
    ) {
      alert("Please fill all required fields and agree to terms");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingData.email)) {
      alert("Please enter a valid email");
      return;
    }

    setLoading(true);
    try {
      setTimeout(() => {
        const success = Math.random() > 0.1;
        setBookingResult({
          success,
          message: success
            ? "Booking confirmed! Check your email for details."
            : "Booking failed. Please try again.",
          bookingId: success ? `BK${Date.now()}` : null,
        });
        setLoading(false);
        setPage("result");
      }, 1000);
    } catch (error) {
      console.error("Error creating booking:", error);
      setBookingResult({
        success: false,
        message: "An error occurred. Please try again.",
        bookingId: null,
      });
      setLoading(false);
      setPage("result");
    }
  };

  const calculateTotal = () => {
    if (!selectedExperience) return { subtotal: 0, taxes: 0, total: 0 };
    
    const subtotal = selectedExperience.price * quantity;
    const taxes = Math.round(subtotal * 0.05);
    const total = subtotal + taxes - promoDiscount;
    return { subtotal, taxes, total };
  };

  const filteredExperiences = experiences.filter(
    (exp) =>
      exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (page === "home") {
    return (
      <div className="min-h-screen bg-gray-50 text-black">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-black">highway</div>
                  <div className="text-xs text-black">delite</div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-1 max-w-lg mx-8">
                <input
                  type="text"
                  placeholder="Search experiences"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <button className="px-6 py-2 bg-yellow-400 text-black font-medium rounded-lg hover:bg-yellow-500 transition">
                  Search
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading experiences...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredExperiences.map((exp) => (
                <div
                  key={exp._id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
                >
                  <img
                    src={exp.imageUrl}
                    alt={exp.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold">{exp.title}</h3>
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded">
                        {exp.location}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      {exp.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-500">From </span>
                        <span className="text-lg font-bold">₹{exp.price}</span>
                      </div>
                      <button
                        onClick={() => fetchExperienceDetails(exp._id)}
                        className="px-4 py-2 bg-yellow-400 text-black font-medium rounded hover:bg-yellow-500 transition text-sm"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    );
  }

  if (page === "details" && selectedExperience) {
    const { subtotal, taxes, total } = calculateTotal();

    return (
      <div className="min-h-screen bg-gray-50 text-black">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold">highway</div>
                  <div className="text-xs text-gray-600">delite</div>
                </div>
              </div>
              <button className="px-6 py-2 bg-yellow-400 text-black font-medium rounded-lg hover:bg-yellow-500 transition">
                Search
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => setPage("home")}
            className="flex items-center gap-2 text-gray-700 mb-6 hover:text-black"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Details</span>
          </button>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <img
                src={selectedExperience.imageUrl}
                alt={selectedExperience.title}
                className="w-full h-96 object-cover rounded-lg mb-6"
              />

              <h1 className="text-3xl font-bold mb-4">
                {selectedExperience.title}
              </h1>
              <p className="text-gray-700 mb-8">
                {selectedExperience.fullDescription}
              </p>

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Choose date</h2>
                <div className="flex gap-3 flex-wrap">
                  {selectedExperience.dates.map((date) => {
                    const dateObj = new Date(date);
                    const day = dateObj.getDate();
                    const month = dateObj.toLocaleString("default", {
                      month: "short",
                    });
                    return (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`px-4 py-2 rounded border-2 transition ${
                          selectedDate === date
                            ? "bg-yellow-400 border-yellow-400 text-black font-medium"
                            : "bg-white border-gray-300 hover:border-yellow-400"
                        }`}
                      >
                        {month} {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Choose time</h2>
                <div className="flex gap-3 flex-wrap">
                  {selectedExperience.slots
                    .filter((slot) => slot.date === selectedDate)
                    .map((slot, idx) => (
                      <button
                        key={idx}
                        onClick={() =>
                          slot.available > 0 && setSelectedSlot(slot.time)
                        }
                        disabled={slot.available === 0}
                        className={`px-4 py-2 rounded border-2 transition relative ${
                          slot.available === 0
                            ? "bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed"
                            : selectedSlot === slot.time
                            ? "bg-yellow-400 border-yellow-400 text-black font-medium"
                            : "bg-white border-gray-300 hover:border-yellow-400"
                        }`}
                      >
                        {slot.time}
                        {slot.available > 0 && slot.available <= 5 && (
                          <span className="ml-2 text-xs text-red-600">
                            {slot.available} left
                          </span>
                        )}
                        {slot.available === 0 && (
                          <span className="ml-2 text-xs">Sold out</span>
                        )}
                      </button>
                    ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 shadow-md sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Starts at</span>
                  <span className="text-2xl font-bold">
                    ₹{selectedExperience.price}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4 pb-4 border-b">
                  <span className="text-gray-600">Quantity</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mb-4 pb-4 border-b">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Taxes</span>
                    <span>₹{taxes}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl font-bold">Total</span>
                  <span className="text-2xl font-bold">₹{total}</span>
                </div>

                <button
                  onClick={() => {
                    if (!selectedSlot) {
                      alert("Please select a time slot");
                      return;
                    }
                    setPage("checkout");
                  }}
                  className="w-full py-3 bg-yellow-400 text-black font-medium rounded-lg hover:bg-yellow-500 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                  disabled={!selectedSlot}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (page === "checkout" && selectedExperience) {
    const { subtotal, taxes, total } = calculateTotal();

    return (
      <div className="min-h-screen bg-gray-50 text-black">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold">highway</div>
                  <div className="text-xs text-gray-600">delite</div>
                </div>
              </div>
              <button className="px-6 py-2 bg-yellow-400 text-black font-medium rounded-lg hover:bg-yellow-500 transition">
                Search
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => setPage("details")}
            className="flex items-center gap-2 text-gray-700 mb-6 hover:text-black"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Checkout</span>
          </button>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-lg p-8">
              <div className="grid sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 mb-2">Full name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={bookingData.fullName}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        fullName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    value={bookingData.email}
                    onChange={(e) =>
                      setBookingData({ ...bookingData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Promo code</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Promo code"
                    value={bookingData.promoCode}
                    onChange={(e) =>
                      setBookingData({
                        ...bookingData,
                        promoCode: e.target.value,
                      })
                    }
                    className="flex-1 px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                  <button
                    onClick={applyPromoCode}
                    className="px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition"
                  >
                    Apply
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-green-600 text-sm mt-2">
                    Promo code applied! Discount: ₹{promoDiscount}
                  </p>
                )}
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={bookingData.agreedToTerms}
                  onChange={(e) =>
                    setBookingData({
                      ...bookingData,
                      agreedToTerms: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded border-gray-300 text-yellow-400 focus:ring-yellow-400"
                />
                <span className="text-gray-700">
                  I agree to the terms and safety policy
                </span>
              </label>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="space-y-3 mb-4 pb-4 border-b">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience</span>
                    <span className="font-medium">
                      {selectedExperience.title}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date</span>
                    <span className="font-medium">{selectedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time</span>
                    <span className="font-medium">{selectedSlot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Qty</span>
                    <span className="font-medium">{quantity}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4 pb-4 border-b">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Taxes</span>
                    <span>₹{taxes}</span>
                  </div>
                  {promoDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-₹{promoDiscount}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl font-bold">Total</span>
                  <span className="text-2xl font-bold">₹{total}</span>
                </div>

                <button
                  onClick={handleBooking}
                  disabled={loading}
                  className="w-full py-3 bg-yellow-400 text-black font-medium rounded-lg hover:bg-yellow-500 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : "Pay and Confirm"}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (page === "result" && bookingResult) {
    return (
      <div className="min-h-screen bg-gray-50 text-black">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold">highway</div>
                  <div className="text-xs text-gray-600">delite</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-white rounded-lg p-12 text-center shadow-md">
            {bookingResult.success ? (
              <>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold mb-4">Booking Confirmed!</h1>
                <p className="text-gray-600 mb-2">{bookingResult.message}</p>
                {bookingResult.bookingId && (
                  <p className="text-gray-500 mb-8">
                    Booking ID: {bookingResult.bookingId}
                  </p>
                )}
                <button
                  onClick={() => {
                    setPage("home");
                    setSelectedExperience(null);
                    setSelectedDate("");
                    setSelectedSlot(null);
                    setQuantity(1);
                    setBookingData({
                      fullName: "",
                      email: "",
                      promoCode: "",
                      agreedToTerms: false,
                    });
                    setPromoDiscount(0);
                    setPromoApplied(false);
                    setBookingResult(null);
                  }}
                  className="px-8 py-3 bg-yellow-400 text-black font-medium rounded-lg hover:bg-yellow-500 transition"
                >
                  Book Another Experience
                </button>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold mb-4">Booking Failed</h1>
                <p className="text-gray-600 mb-8">{bookingResult.message}</p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => setPage("checkout")}
                    className="px-8 py-3 bg-yellow-400 text-black font-medium rounded-lg hover:bg-yellow-500 transition"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => {
                      setPage("home");
                      setSelectedExperience(null);
                      setSelectedDate("");
                      setSelectedSlot(null);
                      setQuantity(1);
                      setBookingData({
                        fullName: "",
                        email: "",
                        promoCode: "",
                        agreedToTerms: false,
                      });
                      setPromoDiscount(0);
                      setPromoApplied(false);
                      setBookingResult(null);
                    }}
                    className="px-8 py-3 bg-gray-200 text-black font-medium rounded-lg hover:bg-gray-300 transition"
                  >
                    Back to Home
                  
                  </button>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    );
  }

  return null;
}

export default App;
