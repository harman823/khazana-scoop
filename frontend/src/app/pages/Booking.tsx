import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, ChevronRight, CalendarDays, MapPin } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { fetchServices, fetchDaySlots, initiateBooking, fetchMonthlyAvailability, verifyPayment } from "../../lib/api";
import { FALLBACK_SERVICES, REGISTRATION_PRICE, getServicePriceUnit, normalizeServicesResponse } from "../../lib/services";

const ENABLE_RAZORPAY_CHECKOUT = false;

export function Booking() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", location: "online" });

  const [services, setServices] = useState<any[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [unavailableDays, setUnavailableDays] = useState<Date[]>([]);

  const selectedServiceData = services.find((service) => service.id === selectedService);
  const selectedServicePrice = selectedServiceData?.price ?? 0;

  useEffect(() => {
    if (!selectedService) return;
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    fetchMonthlyAvailability(year, month, selectedService).then(res => {
      if (res.success && res.data?.days) {
        const disabled = res.data.days
          .filter((d: any) => !d.hasSlots)
          .map((d: any) => new Date(year, month - 1, d.day));
        setUnavailableDays(disabled);
      }
    }).catch(err => console.error(err));
  }, [currentMonth, selectedService]);

  useEffect(() => {
    fetchServices().then(res => {
      setServices(normalizeServicesResponse(res));
      const params = new URLSearchParams(window.location.search);
      const serviceId = params.get("service");
      if (serviceId) {
        setSelectedService(serviceId);
        setStep(2);
      }
    }).catch((err) => {
      console.error("Failed to load services", err);
      setServices(FALLBACK_SERVICES);
    }).finally(() => setLoadingServices(false));
  }, []);

  useEffect(() => {
    if (selectedDate && selectedService) {
      setLoadingSlots(true);
      const dateStr = selectedDate.toLocaleDateString("en-CA");
      fetchDaySlots(dateStr, selectedService).then(res => {
        if (res.success && res.data?.slots) {
          setTimeSlots(res.data.slots);
        } else {
          setTimeSlots([]);
        }
      }).catch(err => {
        console.error(err);
        setTimeSlots([]);
      }).finally(() => setLoadingSlots(false));
    } else {
      setTimeSlots([]);
    }
  }, [selectedDate, selectedService]);

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);

  const handleCheckout = async () => {
    if (!selectedService || !selectedDate || !selectedTime || !formData.name || !formData.email || !formData.phone) return;

    setIsBooking(true);
    try {
      if (!ENABLE_RAZORPAY_CHECKOUT) {
        handleNext();
        return;
      }

      const payload = {
        serviceId: selectedService,
        bookingDateTime: selectedTime,
        clientName: formData.name,
        clientEmail: formData.email,
        clientPhone: formData.phone,
        clientTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };

      const response = await initiateBooking(payload);
      const pData = response.data || response;

      if (pData.paymentMode === "mock") {
        await verifyPayment({ orderId: pData.orderId });
        handleNext();
        return;
      }

      const options = {
        key: pData.razorpayKeyId,
        amount: pData.amount,
        currency: pData.currency,
        name: "Kosmic Align",
        description: "Session Booking",
        order_id: pData.orderId,
        handler: async function (razorpayResponse: any) {
          try {
            await verifyPayment({
              orderId: pData.orderId,
              razorpayPaymentId: razorpayResponse.razorpay_payment_id,
              razorpaySignature: razorpayResponse.razorpay_signature
            });
            handleNext();
          } catch (err) {
            console.error("Payment verification failed", err);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#E84C3D"
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (resp: any) {
        alert("Payment failed: " + resp.error.description);
      });
      rzp.open();
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Failed to submit booking request. Please contact support.");
    } finally {
      setIsBooking(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 className="text-3xl font-serif font-semibold text-[#585858] mb-8 text-center">Select a Service</h3>
            {loadingServices ? (
              <div className="text-center text-[#7A7A7A] py-8">Loading services...</div>
            ) : (
              <div className="space-y-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all flex flex-col md:flex-row gap-4 md:justify-between md:items-center ${
                      selectedService === service.id
                        ? "border-[#E84C3D] bg-[#FDEBD0]"
                        : "border-transparent bg-[#FFF5EA] hover:bg-[#FDF3E6]"
                    }`}
                  >
                    <div>
                      <h4 className="text-xl font-serif font-semibold text-[#585858] mb-1">{service.title}</h4>
                      <p className="text-sm text-[#7A7A7A] flex items-center gap-2">
                        <CalendarDays className="w-4 h-4" /> {service.durationMin} mins
                      </p>
                      <p className="text-xs text-[#7A7A7A] mt-2">
                        Each session would be of 1½ hr. Sessions may vary for each client.
                      </p>
                    </div>
                    <div className="text-left md:text-right">
                      <span className="font-semibold text-[#585858] bg-white px-4 py-2 rounded-full text-sm shadow-sm">
                        ₹{service.price}
                      </span>
                      <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-[#7A7A7A]">
                        {getServicePriceUnit(service.title)}
                      </p>
                      <p className="mt-2 text-xs font-semibold text-[#7A7A7A]">
                        Registration ₹{REGISTRATION_PRICE}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="rounded-[2rem] bg-white/80 p-5 text-sm text-[#7A7A7A] border border-[#E5BE90]/30">
                  Registration charges: ₹{REGISTRATION_PRICE} per head, one-time.
                </div>
              </div>
            )}
            <button
              onClick={handleNext}
              disabled={!selectedService}
              className="mt-12 w-full py-4 bg-[#E84C3D] text-white rounded-full text-lg font-semibold disabled:opacity-50 hover:bg-[#C0392B] transition-all flex items-center justify-center gap-2"
            >
              Continue <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        );
      case 2:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 className="text-3xl font-serif font-semibold text-[#585858] mb-8 text-center">Choose Date & Time</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-[#FFF5EA] p-4 md:p-8 rounded-[3rem]">
              <div className="flex justify-center">
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  onMonthChange={setCurrentMonth}
                  disabled={[{ before: new Date(new Date().setHours(0,0,0,0)) }, ...unavailableDays]}
                  className="bg-white p-4 rounded-3xl shadow-sm"
                  classNames={{
                    day_selected: "bg-[#E84C3D] text-white rounded-full",
                    day_today: "font-bold text-[#E84C3D]",
                  }}
                />
              </div>
              <div>
                <h4 className="text-lg font-serif font-semibold text-[#585858] mb-4">Available Times</h4>
                {selectedDate && loadingSlots ? (
                  <div className="text-[#7A7A7A] text-sm">Loading slots...</div>
                ) : selectedDate ? (
                  <div className="grid grid-cols-2 gap-3">
                    {timeSlots.length > 0 ? timeSlots.map((slot: any, idx: number) => {
                      const timeStr = slot.start || slot;
                      const isBooked = slot.booked;
                      return (
                        <button
                          key={idx}
                          disabled={isBooked}
                          onClick={() => setSelectedTime(timeStr)}
                          className={`py-3 rounded-xl border transition-all text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed ${
                            selectedTime === timeStr
                              ? "bg-[#E84C3D] text-white border-[#E84C3D]"
                              : "bg-white text-[#7A7A7A] border-transparent hover:border-[#E84C3D]/30"
                          }`}
                        >
                          {timeStr.includes("T") ? new Date(timeStr).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : timeStr}
                        </button>
                      );
                    }) : <div className="text-[#7A7A7A] text-sm col-span-2">No slots available.</div>}
                  </div>
                ) : (
                  <p className="text-[#7A7A7A] text-sm">Please select a date first.</p>
                )}
              </div>
            </div>
            <div className="flex gap-4 mt-12">
              <button
                onClick={handlePrev}
                className="w-1/3 py-4 bg-white border border-[#E5BE90]/50 text-[#7A7A7A] rounded-full text-lg font-medium hover:bg-[#FFF5EA] transition-all"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!selectedDate || !selectedTime}
                className="w-2/3 py-4 bg-[#E84C3D] text-white rounded-full text-lg font-semibold disabled:opacity-50 hover:bg-[#C0392B] transition-all flex items-center justify-center gap-2"
              >
                Continue <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h3 className="text-3xl font-serif font-semibold text-[#585858] mb-8 text-center">Your Details</h3>
            <div className="space-y-6 max-w-lg mx-auto">
              <div>
                <label className="block text-sm font-medium text-[#585858] mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#FFF5EA] border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#E84C3D]/30 transition-all text-[#585858]"
                  placeholder="Jane Doe"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#585858] mb-2">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#FFF5EA] border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#E84C3D]/30 transition-all text-[#585858]"
                    placeholder="jane@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#585858] mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#FFF5EA] border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#E84C3D]/30 transition-all text-[#585858]"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#585858] mb-2">Session Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setFormData({ ...formData, location: "online" })}
                    className={`py-4 rounded-2xl flex items-center justify-center gap-2 transition-all ${
                      formData.location === "online" ? "bg-[#E84C3D] text-white" : "bg-[#FFF5EA] text-[#7A7A7A]"
                    }`}
                  >
                    Online (Zoom)
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, location: "inperson" })}
                    className={`py-4 rounded-2xl flex items-center justify-center gap-2 transition-all ${
                      formData.location === "inperson" ? "bg-[#E84C3D] text-white" : "bg-[#FFF5EA] text-[#7A7A7A]"
                    }`}
                  >
                    <MapPin className="w-4 h-4" /> Delhi Clinic
                  </button>
                </div>
              </div>
              <div className="rounded-[2rem] bg-white p-5 text-sm text-[#7A7A7A] border border-[#E5BE90]/30">
                Registration charges: ₹{REGISTRATION_PRICE} per head, one-time. Payment collection is currently offline.
              </div>
            </div>
            <div className="flex gap-4 mt-12 max-w-lg mx-auto">
              <button
                onClick={handlePrev}
                className="w-1/3 py-4 bg-white border border-[#E5BE90]/50 text-[#7A7A7A] rounded-full text-lg font-medium hover:bg-[#FFF5EA] transition-all"
              >
                Back
              </button>
              <button
                onClick={handleCheckout}
                disabled={!formData.name || !formData.email || !formData.phone || isBooking}
                className="w-2/3 py-4 bg-[#E84C3D] text-white rounded-full text-lg font-semibold hover:bg-[#C0392B] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isBooking ? "Processing..." : "Submit Request"} <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
            <div className="w-24 h-24 bg-[#FDEBD0] rounded-full flex items-center justify-center mx-auto mb-8 relative">
              <CheckCircle className="w-12 h-12 text-[#E84C3D] absolute z-10" />
              <div className="absolute inset-0 bg-[#FDEBD0] animate-ping rounded-full opacity-50" />
            </div>
            <h3 className="text-4xl font-serif font-semibold text-[#585858] mb-4">Session Request Received</h3>
            <p className="text-[#7A7A7A] text-lg max-w-md mx-auto mb-8">
              Thank you. Your selected session details have been captured, and the team will coordinate confirmation and payment offline.
            </p>
            <div className="bg-[#FFF5EA] p-8 rounded-[2rem] max-w-md mx-auto text-left mb-12">
              <h4 className="font-serif font-semibold text-[#585858] text-xl mb-4 border-b border-[#E5BE90]/30 pb-4">Booking Details</h4>
              <div className="space-y-3 text-sm text-[#7A7A7A]">
                <div className="flex justify-between"><span className="font-medium">Service:</span> <span>{selectedServiceData?.title}</span></div>
                <div className="flex justify-between"><span className="font-medium">Date:</span> <span>{selectedDate?.toLocaleDateString()}</span></div>
                <div className="flex justify-between"><span className="font-medium">Time:</span> <span>{selectedTime.includes("T") ? new Date(selectedTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : selectedTime}</span></div>
                <div className="flex justify-between"><span className="font-medium">Mode:</span> <span className="capitalize">{formData.location}</span></div>
                <div className="flex justify-between"><span className="font-medium">Session Fee:</span> <span>₹{selectedServicePrice}</span></div>
                <div className="flex justify-between"><span className="font-medium">Registration:</span> <span>₹{REGISTRATION_PRICE}</span></div>
              </div>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-20 pb-32">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-serif font-semibold text-[#585858] mb-4">Book Your Session</h1>
        <p className="text-lg text-[#7A7A7A]">Secure your spot for clarity, healing, and alignment.</p>
      </div>

      <div className="bg-white p-6 md:p-16 rounded-[3rem] shadow-[0_8px_32px_rgba(88,88,88,0.02)] min-h-[600px] relative overflow-hidden">
        {step < 4 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col items-center relative z-10 w-1/3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-serif font-semibold transition-colors ${
                    step >= i ? "bg-[#E84C3D] text-white" : "bg-[#FFF5EA] text-[#7A7A7A]"
                  }`}>
                    {i}
                  </div>
                  <span className="text-xs text-[#7A7A7A] mt-2 font-medium hidden md:block">
                    {i === 1 ? "Service" : i === 2 ? "Schedule" : "Details"}
                  </span>
                </div>
              ))}
            </div>
            <div className="absolute top-[4.5rem] left-[15%] right-[15%] h-[2px] bg-[#FFF5EA] -z-0">
              <div
                className="h-full bg-[#E84C3D] transition-all duration-500 ease-in-out"
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {renderStepContent()}
        </AnimatePresence>
      </div>
    </div>
  );
}
