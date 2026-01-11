'use server';

import { sql } from './db';
import { contactSchema, eventBookingSchema, sanitizeHtml } from './validations';

export interface ActionResult {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

// Submit contact enquiry
export async function submitContactEnquiry(formData: FormData): Promise<ActionResult> {
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    enquiry_type: formData.get('enquiry_type'),
    message: formData.get('message'),
  };

  const validation = contactSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: 'Please check your input and try again.',
      errors: validation.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { name, email, enquiry_type, message } = validation.data;

  try {
    await sql`
      INSERT INTO contact_enquiries (name, email, enquiry_type, message, status)
      VALUES (${sanitizeHtml(name)}, ${email}, ${enquiry_type}, ${sanitizeHtml(message)}, 'new')
    `;

    return {
      success: true,
      message: 'Your message has been received. We will be in touch shortly.',
    };
  } catch (error) {
    console.error('Error submitting contact enquiry:', error);
    return {
      success: false,
      message: 'Something went wrong. Please try again later.',
    };
  }
}

// Submit event booking enquiry
export async function submitEventBooking(formData: FormData): Promise<ActionResult> {
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    event_type: formData.get('event_type'),
    event_date: formData.get('event_date'),
    location: formData.get('location'),
    guest_count: formData.get('guests'),
    notes: formData.get('notes') || undefined,
  };

  const validation = eventBookingSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: 'Please check your input and try again.',
      errors: validation.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { name, email, event_type, event_date, location, guest_count, notes } = validation.data;

  try {
    await sql`
      INSERT INTO event_bookings (
        event_type, event_date, location, guest_count,
        name, email, notes, status
      )
      VALUES (
        ${event_type}, ${event_date}, ${sanitizeHtml(location)}, ${guest_count},
        ${sanitizeHtml(name)}, ${email}, ${notes ? sanitizeHtml(notes) : null}, 'new'
      )
    `;

    return {
      success: true,
      message: 'Your booking enquiry has been received. We will be in touch within 24 hours.',
    };
  } catch (error) {
    console.error('Error submitting event booking:', error);
    return {
      success: false,
      message: 'Something went wrong. Please try again later.',
    };
  }
}
