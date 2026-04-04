export const fetchServices = async () => {
  const response = await fetch('/api/v1/services');
  if (!response.ok) {
    throw new Error('Failed to fetch services');
  }
  return response.json();
};

export const initiateBooking = async (payload: any) => {
  const response = await fetch('/api/v1/bookings/initiate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to initiate booking');
  }
  
  return response.json();
};

export const verifyPayment = async (payload: {
  orderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
}) => {
  const response = await fetch('/api/v1/payments/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to verify payment');
  }

  return response.json();
};

export const fetchMonthlyAvailability = async (year: number, month: number, serviceId?: string) => {
  const searchParams = new URLSearchParams({
    year: String(year),
    month: String(month),
  });

  if (serviceId) {
    searchParams.set('serviceId', serviceId);
  }

  const response = await fetch(`/api/v1/calendar/days?${searchParams.toString()}`);
  if (!response.ok) throw new Error('Failed to fetch availability');
  return response.json(); // { success, data: { days: [{day, hasSlots}] } }
};

export const fetchDaySlots = async (date: string, serviceId?: string) => {
  const searchParams = new URLSearchParams({ date });

  if (serviceId) {
    searchParams.set('serviceId', serviceId);
  }

  const response = await fetch(`/api/v1/calendar/slots?${searchParams.toString()}`);
  if (!response.ok) throw new Error('Failed to fetch slots');
  return response.json(); // { success, data: { slots: [{start, end, label, booked}] } }
};

export const fetchAdminDashboard = async (adminKey: string) => {
  const response = await fetch('/api/v1/analytics/dashboard', {
    headers: {
      'x-admin-key': adminKey,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to fetch admin dashboard');
  }

  return response.json();
};
