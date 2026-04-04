import { useCallback, useEffect, useState } from 'react';
import { format, isSaturday, isSunday, startOfToday } from 'date-fns';
import { AnimatePresence, motion } from 'motion/react';
import { DayPicker } from 'react-day-picker';
import { useSearchParams } from 'react-router';
import 'react-day-picker/dist/style.css';
import { Button } from '../components/Button';
import { Input, Textarea } from '../components/Input';
import { ManifestItem } from '../components/ManifestItem';
import {
  fetchDaySlots,
  fetchMonthlyAvailability,
  fetchServices,
  initiateBooking,
  verifyPayment,
} from '../../lib/api';
import { useUI } from '../components/UIContext';

type ServiceOption = {
  id: string;
  slug: string;
  title: string;
  description: string;
  durationMin: number;
  price: number;
};

type TimeSlot = {
  start: string;
  end: string;
  label: string;
  booked: boolean;
};

type IntakeFormState = {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientTimezone: string;
  dob: string;
  birthTime: string;
  birthPlace: string;
  keyConcern: string;
  customQuestions: string;
};

type PaymentConfirmation = {
  meetLink?: string | null;
  confirmationEmailSent?: boolean;
};

type PendingPayment = {
  orderId: string;
  amount: number;
  currency: string;
  paymentMode: 'mock' | 'razorpay';
  razorpayKeyId?: string;
};

type RazorpaySuccessPayload = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpaySuccessPayload) => void;
  modal?: { ondismiss?: () => void };
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => {
      open: () => void;
      on: (event: string, handler: (response: any) => void) => void;
    };
  }
}

const stepVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] as any } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
};

const initialFormState: IntakeFormState = {
  clientName: '',
  clientEmail: '',
  clientPhone: '',
  clientTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
  dob: '',
  birthTime: '',
  birthPlace: '',
  keyConcern: '',
  customQuestions: '',
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const getDayKey = (day: Date) => format(day, 'yyyy-MM-dd');

const loadRazorpayScript = async () => {
  if (window.Razorpay) {
    return true;
  }

  return new Promise<boolean>((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export function Booking() {
  const { isLoaded } = useUI();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState('');

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [displayMonth, setDisplayMonth] = useState(new Date());
  const [daysWithSlots, setDaysWithSlots] = useState<string[]>([]);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [calendarLoaded, setCalendarLoaded] = useState(false);
  const [calendarError, setCalendarError] = useState<string | null>(null);

  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  const [formData, setFormData] = useState<IntakeFormState>(initialFormState);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentConfirmation, setPaymentConfirmation] = useState<PaymentConfirmation | null>(null);
  const [pendingPayment, setPendingPayment] = useState<PendingPayment | null>(null);

  const selectedServiceRecord = services.find((service) => service.id === selectedService) || null;
  const requestedService = searchParams.get('service');
  const intakeFormIsValid =
    formData.clientName.trim().length >= 2 &&
    /\S+@\S+\.\S+/.test(formData.clientEmail) &&
    formData.clientPhone.replace(/\D/g, '').length >= 10 &&
    !!formData.dob &&
    !!formData.birthTime &&
    formData.birthPlace.trim().length >= 2 &&
    formData.keyConcern.trim().length >= 2;

  const loadMonthAvailability = useCallback(async (month: Date) => {
    if (!selectedService) {
      setDaysWithSlots([]);
      setCalendarLoaded(false);
      return;
    }

    setCalendarLoading(true);
    setCalendarError(null);

    try {
      const res = await fetchMonthlyAvailability(month.getFullYear(), month.getMonth() + 1, selectedService);
      const availableDays = (res.data.days || [])
        .filter((day: { day: number; hasSlots: boolean }) => day.hasSlots)
        .map((day: { day: number }) =>
          format(new Date(month.getFullYear(), month.getMonth(), day.day), 'yyyy-MM-dd')
        );

      setDaysWithSlots(availableDays);
      setCalendarLoaded(true);
    } catch (error) {
      setCalendarLoaded(false);
      setDaysWithSlots([]);
      setCalendarError(error instanceof Error ? error.message : 'Failed to fetch live availability.');
    } finally {
      setCalendarLoading(false);
    }
  }, [selectedService]);

  const loadSlots = useCallback(async (day: Date) => {
    if (!selectedService) {
      setSlots([]);
      return;
    }

    setSlotsLoading(true);
    setSlotsError(null);
    setSlots([]);

    try {
      const res = await fetchDaySlots(format(day, 'yyyy-MM-dd'), selectedService);
      setSlots(res.data.slots || []);
    } catch (error) {
      setSlotsError(error instanceof Error ? error.message : 'Failed to fetch live slots.');
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  }, [selectedService]);

  useEffect(() => {
    let ignore = false;

    const loadServices = async () => {
      setServicesLoading(true);
      setServicesError(null);

      try {
        const response = await fetchServices();
        const liveServices = (response.data || []) as ServiceOption[];

        if (!ignore) {
          setServices(liveServices);
          setSelectedService((current) => {
            if (current) {
              return current;
            }

            const requested = liveServices.find((service) =>
              service.slug === requestedService || service.id === requestedService
            );

            return requested?.id || liveServices[0]?.id || '';
          });
        }
      } catch (error) {
        if (!ignore) {
          setServices([]);
          setServicesError(error instanceof Error ? error.message : 'Failed to load services.');
        }
      } finally {
        if (!ignore) {
          setServicesLoading(false);
        }
      }
    };

    loadServices();

    return () => {
      ignore = true;
    };
  }, [requestedService]);

  useEffect(() => {
    if (!selectedService) {
      return;
    }

    loadMonthAvailability(displayMonth);
  }, [displayMonth, loadMonthAvailability, selectedService]);

  useEffect(() => {
    setSelectedSlot(null);

    if (!date || !selectedService) {
      setSlots([]);
      setSlotsError(null);
      return;
    }

    loadSlots(date);
  }, [date, loadSlots, selectedService]);

  useEffect(() => {
    setPendingPayment(null);
    setPaymentConfirmation(null);
  }, [
    selectedService,
    date?.getTime(),
    selectedSlot?.start,
    formData.clientName,
    formData.clientEmail,
    formData.clientPhone,
    formData.clientTimezone,
    formData.dob,
    formData.birthTime,
    formData.birthPlace,
    formData.keyConcern,
    formData.customQuestions,
  ]);

  const handleDateSelect = (selectedDay: Date | undefined) => {
    setDate(selectedDay);
    setSelectedSlot(null);
    setSubmitError(null);
  };

  const handleInputChange = (field: keyof IntakeFormState, value: string) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const openRazorpayCheckout = async (payment: PendingPayment) => {
    const isLoaded = await loadRazorpayScript();

    if (!isLoaded || !window.Razorpay || !payment.razorpayKeyId) {
      throw new Error('Unable to load Razorpay checkout.');
    }

    return new Promise<RazorpaySuccessPayload>((resolve, reject) => {
      let settled = false;

      const checkout = new window.Razorpay({
        key: payment.razorpayKeyId,
        amount: payment.amount,
        currency: payment.currency,
        name: 'Kosmic Align',
        description: selectedServiceRecord?.title || 'Session Booking',
        order_id: payment.orderId,
        prefill: {
          name: formData.clientName,
          email: formData.clientEmail,
          contact: formData.clientPhone,
        },
        theme: {
          color: '#ff5a1f',
        },
        modal: {
          ondismiss: () => {
            if (!settled) {
              settled = true;
              reject(new Error('Payment checkout was closed before completion.'));
            }
          },
        },
        handler: (response) => {
          if (!settled) {
            settled = true;
            resolve(response);
          }
        },
      });

      checkout.on('payment.failed', (response: any) => {
        if (!settled) {
          settled = true;
          reject(new Error(response?.error?.description || 'Payment failed.'));
        }
      });

      checkout.open();
    });
  };

  const handleConfirmPayment = async () => {
    if (!selectedServiceRecord || !selectedSlot) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payment = pendingPayment;

      let verificationPayload: {
        orderId: string;
        razorpayPaymentId?: string;
        razorpaySignature?: string;
      };

      if (!pendingPayment) {
        const bookingResponse = await initiateBooking({
          serviceId: selectedServiceRecord.id,
          bookingDateTime: selectedSlot.start,
          clientName: formData.clientName.trim(),
          clientEmail: formData.clientEmail.trim(),
          clientPhone: formData.clientPhone.trim(),
          clientTimezone: formData.clientTimezone,
          dob: formData.dob || undefined,
          birthTime: formData.birthTime || undefined,
          birthPlace: formData.birthPlace.trim() || undefined,
          keyConcern: formData.keyConcern.trim() || undefined,
          customQuestions: formData.customQuestions.trim() || undefined,
        });

        const nextPayment = bookingResponse.data as PendingPayment;
        setPendingPayment(nextPayment);

        if (nextPayment.paymentMode === 'mock') {
          return;
        }

        const checkoutResponse = await openRazorpayCheckout(nextPayment);
        verificationPayload = {
          orderId: checkoutResponse.razorpay_order_id,
          razorpayPaymentId: checkoutResponse.razorpay_payment_id,
          razorpaySignature: checkoutResponse.razorpay_signature,
        };
      } else if (payment.paymentMode === 'mock') {
        verificationPayload = { orderId: payment.orderId };
      } else {
        const checkoutResponse = await openRazorpayCheckout(payment);
        verificationPayload = {
          orderId: checkoutResponse.razorpay_order_id,
          razorpayPaymentId: checkoutResponse.razorpay_payment_id,
          razorpaySignature: checkoutResponse.razorpay_signature,
        };
      }

      const paymentResponse = await verifyPayment(verificationPayload);
      setPaymentConfirmation(paymentResponse.data || null);
      setPendingPayment(null);

      await loadMonthAvailability(displayMonth);
      if (date) {
        await loadSlots(date);
      }

      setStep(5);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to complete your booking.';
      setSubmitError(message);

      if (message.toLowerCase().includes('slot') || message.toLowerCase().includes('calendar conflict')) {
        setSelectedSlot(null);
        setStep(2);
        await loadMonthAvailability(displayMonth);
        if (date) {
          await loadSlots(date);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDayDisabled = (day: Date) => {
    if (day < startOfToday()) return true;
    if (isSaturday(day) || isSunday(day)) return true;

    if (calendarLoaded && format(day, 'yyyy-MM') === format(displayMonth, 'yyyy-MM')) {
      return !daysWithSlots.includes(getDayKey(day));
    }

    return false;
  };

  return (
    <div className="flex flex-col flex-grow bg-surface">
      <section className="px-6 lg:px-24 py-32 bg-surface-container-lowest text-on-surface">
        <motion.h1
          className="font-display text-6xl md:text-8xl font-bold uppercase tracking-tighter mb-16 leading-none"
          initial={{ opacity: 0, y: 40 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] as any }}
        >
          Secure A Time
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          <motion.div
            className="lg:col-span-4 sticky top-32"
            initial={{ opacity: 0, x: -40 }}
            animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] as any }}
          >
            <h2 className="font-display text-3xl font-bold uppercase tracking-tighter mb-8">Process</h2>
            <ul className="space-y-4 font-mono text-sm tracking-widest uppercase">
              <li className={`flex items-center gap-4 ${step >= 1 ? 'text-primary' : 'text-on-surface-variant'}`}>
                <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs">1</span>
                Select Service
              </li>
              <li className={`flex items-center gap-4 ${step >= 2 ? 'text-primary' : 'text-on-surface-variant'}`}>
                <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs">2</span>
                Date & Time
              </li>
              <li className={`flex items-center gap-4 ${step >= 3 ? 'text-primary' : 'text-on-surface-variant'}`}>
                <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs">3</span>
                Intake Form
              </li>
              <li className={`flex items-center gap-4 ${step >= 4 ? 'text-primary' : 'text-on-surface-variant'}`}>
                <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs">4</span>
                Payment
              </li>
            </ul>

            <div className="mt-16 bg-surface-container p-8">
              <h3 className="font-display font-bold uppercase tracking-tighter mb-4 text-on-surface text-xl">Email Triggers</h3>
              <ul className="font-mono text-xs text-on-surface-variant uppercase tracking-widest space-y-2">
                <li>- Booking Confirmed</li>
                <li>- 24hr Reminder</li>
                <li>- 1hr Reminder</li>
                <li>- Cancellation Notice</li>
              </ul>
            </div>
          </motion.div>

          <div className="lg:col-span-8 relative overflow-hidden min-h-[500px]">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step-1"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-8"
                >
                  <h3 className="font-display text-4xl font-bold uppercase tracking-tighter mb-8">Choose Your Reading</h3>

                  {servicesLoading ? (
                    <div className="border border-outline-variant p-6 font-mono text-sm text-on-surface-variant uppercase tracking-widest">
                      Loading live services...
                    </div>
                  ) : servicesError ? (
                    <div className="border border-primary p-6 font-mono text-sm text-primary uppercase tracking-widest">
                      {servicesError}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {services.map((service) => (
                        <ManifestItem
                          key={service.id}
                          title={service.title}
                          subtitle={service.description}
                          price={formatCurrency(service.price)}
                          meta={`${service.durationMin} Min`}
                          active={selectedService === service.id}
                          onClick={() => setSelectedService(service.id)}
                        />
                      ))}
                    </div>
                  )}

                  <div className="mt-12 flex justify-end">
                    <Button
                      variant="primary"
                      onClick={() => setStep(2)}
                      disabled={!selectedService || servicesLoading || !!servicesError}
                    >
                      Next: Date & Time
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step-2"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-8 bg-surface-container p-8 lg:p-12 shadow-ambient"
                >
                  <h3 className="font-display text-4xl font-bold uppercase tracking-tighter mb-8 text-on-surface">Select Alignment Date</h3>
                  <div className="flex flex-col lg:flex-row gap-12">
                    <div className="flex-1">
                      <style>{`
                        .rdp { --rdp-cell-size: 40px; --rdp-accent-color: var(--color-primary); --rdp-background-color: var(--color-surface-container-high); margin: 0; }
                        .rdp-day_selected, .rdp-day_selected:focus-visible, .rdp-day_selected:hover { background-color: var(--color-primary); color: var(--color-on-primary); }
                        .rdp-button:hover:not([disabled]):not(.rdp-day_selected) { background-color: var(--color-surface-container-highest); }
                        .rdp-day_disabled { opacity: 0.3 !important; }
                      `}</style>
                      <div className="bg-surface p-6 flex justify-center border border-outline-variant relative">
                        {calendarLoading && (
                          <div className="absolute top-2 right-3 font-mono text-xs text-on-surface-variant animate-pulse">Loading...</div>
                        )}
                        <DayPicker
                          mode="single"
                          selected={date}
                          onSelect={handleDateSelect}
                          disabled={isDayDisabled}
                          month={displayMonth}
                          onMonthChange={setDisplayMonth}
                          showOutsideDays
                          className="font-mono text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col">
                      <h4 className="font-mono text-sm tracking-widest uppercase text-on-surface-variant mb-6">
                        {date ? format(date, 'EEEE, MMMM do') : 'Select a Date'}
                      </h4>

                      {calendarError && (
                        <p className="font-mono text-xs text-primary mb-4 border border-primary px-3 py-2">
                          {calendarError}
                        </p>
                      )}

                      {slotsError && (
                        <p className="font-mono text-xs text-primary mb-4 border border-primary px-3 py-2">
                          {slotsError}
                        </p>
                      )}

                      {!date ? (
                        <div className="flex-grow flex items-center justify-center border border-dashed border-outline-variant text-on-surface-variant text-sm font-mono p-6 text-center">
                          Awaiting date selection...
                        </div>
                      ) : slotsLoading ? (
                        <div className="flex-grow flex items-center justify-center border border-dashed border-outline-variant text-on-surface-variant text-sm font-mono p-6 text-center animate-pulse">
                          Fetching live slots...
                        </div>
                      ) : slots.length === 0 ? (
                        <div className="flex-grow flex items-center justify-center border border-dashed border-outline-variant text-on-surface-variant text-sm font-mono p-6 text-center">
                          This day is fully booked for the selected service.
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-4">
                          {slots.map((slot) => {
                            const isSelected = selectedSlot?.start === slot.start;

                            return (
                              <button
                                key={slot.start}
                                disabled={slot.booked}
                                onClick={() => setSelectedSlot(slot)}
                                className={`
                                  py-3 px-4 font-mono text-sm tracking-wider border transition-colors flex justify-center items-center relative
                                  ${slot.booked
                                    ? 'border-outline-variant text-outline opacity-50 cursor-not-allowed bg-surface-container-lowest'
                                    : isSelected
                                      ? 'border-primary bg-primary text-on-primary'
                                      : 'border-outline text-on-surface hover:border-primary hover:text-primary'
                                  }
                                `}
                              >
                                {slot.label}
                                {slot.booked && (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-full h-[1px] bg-outline-variant rotate-12 absolute"></div>
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-12 flex justify-between items-center border-t border-outline-variant pt-8">
                    <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                    <Button
                      variant="primary"
                      onClick={() => setStep(3)}
                      disabled={!date || !selectedSlot}
                    >
                      Next: Intake Form
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step-3"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-8 bg-surface-container p-8 lg:p-12 shadow-ambient"
                >
                  <div className="flex justify-between items-end mb-8 border-b border-outline-variant pb-8">
                    <div>
                      <h3 className="font-display text-4xl font-bold uppercase tracking-tighter text-on-surface">Intake Information</h3>
                      <p className="font-mono text-sm text-primary mt-2">
                        {date && selectedSlot && `${format(date, 'MMM do, yyyy')} @ ${selectedSlot.label}`}
                      </p>
                    </div>
                  </div>

                  <p className="font-body text-on-surface-variant mb-12">
                    The brutal truth requires brutal accuracy. Provide your exact birth details below.
                  </p>

                  <div className="space-y-6">
                    <div>
                      <label className="block font-mono text-xs text-on-surface-variant uppercase tracking-widest mb-2">Full Name</label>
                      <Input
                        placeholder="John Doe"
                        value={formData.clientName}
                        onChange={(event) => handleInputChange('clientName', event.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-mono text-xs text-on-surface-variant uppercase tracking-widest mb-2">Email Address</label>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          value={formData.clientEmail}
                          onChange={(event) => handleInputChange('clientEmail', event.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-xs text-on-surface-variant uppercase tracking-widest mb-2">Phone Number</label>
                        <Input
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={formData.clientPhone}
                          onChange={(event) => handleInputChange('clientPhone', event.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-mono text-xs text-on-surface-variant uppercase tracking-widest mb-2">Date of Birth</label>
                        <Input
                          type="date"
                          value={formData.dob}
                          onChange={(event) => handleInputChange('dob', event.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block font-mono text-xs text-on-surface-variant uppercase tracking-widest mb-2">Time of Birth (Exact)</label>
                        <Input
                          type="time"
                          value={formData.birthTime}
                          onChange={(event) => handleInputChange('birthTime', event.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-mono text-xs text-on-surface-variant uppercase tracking-widest mb-2">Location of Birth (City, Country)</label>
                      <Input
                        placeholder="Delhi, India"
                        value={formData.birthPlace}
                        onChange={(event) => handleInputChange('birthPlace', event.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-xs text-on-surface-variant uppercase tracking-widest mb-2">Primary Question / Focus</label>
                      <Textarea
                        placeholder="What do you seek clarity on?"
                        value={formData.keyConcern}
                        onChange={(event) => handleInputChange('keyConcern', event.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-xs text-on-surface-variant uppercase tracking-widest mb-2">Additional Context (Optional)</label>
                      <Textarea
                        placeholder="Anything else that will help prepare for your session."
                        value={formData.customQuestions}
                        onChange={(event) => handleInputChange('customQuestions', event.target.value)}
                      />
                    </div>
                  </div>

                  <div className="mt-12 flex justify-between items-center">
                    <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
                    <Button variant="primary" onClick={() => setStep(4)} disabled={!intakeFormIsValid}>
                      Next: Payment
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 4 && selectedServiceRecord && (
                <motion.div
                  key="step-4"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-8 bg-surface p-8 lg:p-12 shadow-ambient"
                >
                  <h3 className="font-display text-4xl font-bold uppercase tracking-tighter mb-8 text-on-surface">Payment Summary</h3>
                  <div className="border-b-2 border-surface-container pb-8 mb-8 space-y-4">
                    <ManifestItem
                      title={selectedServiceRecord.title}
                      subtitle={selectedServiceRecord.description}
                      price={formatCurrency(selectedServiceRecord.price)}
                      meta={`${selectedServiceRecord.durationMin} Minutes`}
                    />
                    <div className="flex font-mono text-sm tracking-widest uppercase border border-outline-variant p-4 justify-between text-on-surface">
                      <span>Schedule:</span>
                      <span className="text-primary font-bold">
                        {date && format(date, 'MMM do, yyyy')} | {selectedSlot?.label}
                      </span>
                    </div>
                    <div className="flex font-mono text-sm tracking-widest uppercase border border-outline-variant p-4 justify-between text-on-surface">
                      <span>Reminder Email:</span>
                      <span className="text-primary font-bold">{formData.clientEmail}</span>
                    </div>
                  </div>

                  {submitError && (
                    <div className="border border-primary px-4 py-3 font-mono text-xs tracking-widest uppercase text-primary">
                      {submitError}
                    </div>
                  )}

                  {pendingPayment?.paymentMode === 'mock' && (
                    <div className="border border-primary bg-surface-container px-6 py-6 space-y-4">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                          <p className="font-mono text-xs tracking-widest uppercase text-primary">Placeholder Payment</p>
                          <h4 className="font-display text-2xl font-bold uppercase tracking-tighter text-on-surface mt-2">
                            Demo checkout ready
                          </h4>
                        </div>
                        <div className="border border-outline-variant px-4 py-3 font-mono text-xs tracking-widest uppercase text-on-surface">
                          Visa ending in 4242
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs tracking-widest uppercase">
                        <div className="border border-outline-variant px-4 py-3">
                          <div className="text-on-surface-variant mb-2">Order ID</div>
                          <div className="text-on-surface break-all">{pendingPayment.orderId}</div>
                        </div>
                        <div className="border border-outline-variant px-4 py-3">
                          <div className="text-on-surface-variant mb-2">Amount</div>
                          <div className="text-on-surface">{formatCurrency(selectedServiceRecord.price)}</div>
                        </div>
                        <div className="border border-outline-variant px-4 py-3">
                          <div className="text-on-surface-variant mb-2">Status</div>
                          <div className="text-on-surface">Awaiting confirmation</div>
                        </div>
                      </div>

                      <p className="font-body text-on-surface-variant">
                        This environment is using placeholder payment mode. Complete this demo payment to confirm the slot and send the booked-session email to {formData.clientEmail}.
                      </p>
                    </div>
                  )}

                  <p className="font-body text-on-surface-variant mb-12">
                    Complete your payment to lock this slot in the database, send the confirmation, and trigger the automated reminder emails to the address you entered in the intake form.
                  </p>

                  <div className="mt-12 flex justify-between items-center">
                    <Button variant="ghost" onClick={() => setStep(3)} disabled={isSubmitting}>Back</Button>
                    <Button variant="primary" onClick={handleConfirmPayment} disabled={isSubmitting}>
                      {isSubmitting
                        ? 'Processing...'
                        : pendingPayment?.paymentMode === 'mock'
                          ? 'Complete Placeholder Payment'
                        : pendingPayment?.paymentMode === 'razorpay'
                          ? 'Open Razorpay Checkout'
                          : `Continue to Payment`}
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 5 && selectedServiceRecord && (
                <motion.div
                  key="step-5"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-8 bg-surface p-8 lg:p-12 text-center shadow-ambient"
                >
                  <div className="inline-flex w-24 h-24 bg-surface-container rounded-none items-center justify-center mb-8">
                    <span className="font-display text-4xl text-primary">OK</span>
                  </div>
                  <h3 className="font-display text-4xl font-bold uppercase tracking-tighter mb-4 text-on-surface">Session Confirmed</h3>
                  <p className="font-body text-on-surface-variant mb-12 max-w-lg mx-auto">
                    Your booking for {selectedServiceRecord.title} is confirmed. {paymentConfirmation?.confirmationEmailSent
                      ? `A booked-session email has been sent to ${formData.clientEmail}.`
                      : `We could not confirm the booked-session email send to ${formData.clientEmail} yet.`} Reminder emails will be sent before the session, and the selected slot is now blocked in the live schedule.
                  </p>
                  {paymentConfirmation?.meetLink && (
                    <a
                      href={paymentConfirmation.meetLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center border border-primary px-6 py-3 font-mono text-xs tracking-widest uppercase text-primary hover:bg-primary hover:text-on-primary transition-colors"
                    >
                      Open Session Link
                    </a>
                  )}
                  <Button variant="secondary" onClick={() => { window.location.href = '/'; }}>Return Home</Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}
