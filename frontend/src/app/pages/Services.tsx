import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Button } from '../components/Button';
import { ManifestItem } from '../components/ManifestItem';
import { fetchServices } from '../../lib/api';
import { useUI } from '../components/UIContext';

type ServiceOption = {
  id: string;
  slug: string;
  title: string;
  description: string;
  durationMin: number;
  price: number;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as any },
  },
};

const scrollVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as any },
  },
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export function Services() {
  const { isLoaded } = useUI();
  const navigate = useNavigate();
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const loadServices = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchServices();
        if (!ignore) {
          setServices(response.data || []);
        }
      } catch (loadError) {
        if (!ignore) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to load services.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadServices();

    return () => {
      ignore = true;
    };
  }, []);

  const openBooking = (service?: ServiceOption) => {
    if (service?.slug) {
      navigate(`/booking?service=${encodeURIComponent(service.slug)}`);
      return;
    }

    navigate('/booking');
  };

  return (
    <div className="flex flex-col flex-grow bg-surface">
      <section className="px-6 lg:px-24 py-32 bg-surface-container-lowest text-on-surface">
        <motion.div variants={containerVariants} initial="hidden" animate={isLoaded ? "visible" : "hidden"}>
          <div className="overflow-hidden mb-8">
            <motion.h1
              variants={itemVariants}
              className="font-display text-6xl md:text-8xl font-bold uppercase tracking-tighter leading-none max-w-5xl"
            >
              The Manifest
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-24">
            <motion.p
              variants={itemVariants}
              className="font-body text-xl md:text-2xl text-on-surface-variant max-w-2xl leading-relaxed"
            >
              Our services are designed to cut through the confusion. Select a reading type below to begin your journey toward clarity.
            </motion.p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-start">
          <motion.div
            className="lg:col-span-4 sticky top-32 hidden lg:block"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={scrollVariants}
          >
            <h2 className="font-display text-4xl font-bold uppercase tracking-tighter mb-8">Live Services</h2>
            <ul className="space-y-4">
              <li className="font-mono text-primary font-bold tracking-widest uppercase text-sm">
                {loading ? 'Loading...' : `${services.length} Active Offerings`}
              </li>
              <li className="font-mono text-on-surface-variant tracking-widest uppercase text-sm">
                Live pricing from database
              </li>
              <li className="font-mono text-on-surface-variant tracking-widest uppercase text-sm">
                Duration-aware scheduling
              </li>
              <li className="font-mono text-on-surface-variant tracking-widest uppercase text-sm">
                Reminder emails included
              </li>
            </ul>
          </motion.div>

          <div className="lg:col-span-8 flex flex-col gap-6">
            {loading ? (
              <div className="border border-outline-variant p-6 font-mono text-sm text-on-surface-variant uppercase tracking-widest">
                Loading live services...
              </div>
            ) : error ? (
              <div className="border border-primary p-6 font-mono text-sm text-primary uppercase tracking-widest">
                {error}
              </div>
            ) : (
              services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  variants={scrollVariants}
                  transition={{ delay: index * 0.1 }}
                >
                  <ManifestItem
                    title={service.title}
                    subtitle={service.description}
                    price={formatCurrency(service.price)}
                    meta={`${service.durationMin} Minutes`}
                    onClick={() => openBooking(service)}
                  />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-24 py-32 bg-surface-container overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={containerVariants}
          >
            <div className="overflow-hidden mb-8">
              <motion.h2 variants={itemVariants} className="font-display text-5xl font-bold uppercase tracking-tighter mb-8 text-on-surface">
                How It Works
              </motion.h2>
            </div>
            <div className="space-y-12">
              <motion.div variants={itemVariants} className="border-l-4 border-primary pl-6 py-2">
                <span className="font-mono text-primary font-bold uppercase tracking-widest block mb-2">01. Book</span>
                <p className="font-body text-xl text-on-surface-variant">
                  Select your service, choose a live time slot, and lock the booking through checkout.
                </p>
              </motion.div>
              <motion.div variants={itemVariants} className="border-l-4 border-on-surface-variant pl-6 py-2">
                <span className="font-mono text-on-surface-variant font-bold uppercase tracking-widest block mb-2">02. Prepare</span>
                <p className="font-body text-xl text-on-surface-variant">
                  Fill out the intake form with your precise birth details so the session is prepared around your exact chart.
                </p>
              </motion.div>
              <motion.div variants={itemVariants} className="border-l-4 border-on-surface-variant pl-6 py-2">
                <span className="font-mono text-on-surface-variant font-bold uppercase tracking-widest block mb-2">03. Connect</span>
                <p className="font-body text-xl text-on-surface-variant">
                  Receive your confirmation, join details, and reminder emails in your own timezone.
                </p>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col justify-end items-end"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <Button variant="primary" onClick={() => openBooking(services[0])}>Book Your Session</Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
