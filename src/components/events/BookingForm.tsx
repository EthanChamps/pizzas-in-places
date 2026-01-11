'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { submitEventBooking, ActionResult } from '@/lib/actions';

export default function BookingForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionResult | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const response = await submitEventBooking(formData);
      setResult(response);
    });
  };

  if (result?.success) {
    return (
      <div className="text-center py-12">
        <h3 className="font-serif text-3xl text-neutral-900 mb-4">Enquiry sent</h3>
        <p className="font-sans text-neutral-600 max-w-md mx-auto">{result.message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      {result?.success === false && (
        <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-lg">
          <p className="font-sans text-sm text-red-600">{result.message}</p>
        </div>
      )}

      <fieldset className="space-y-6" disabled={isPending}>
        <legend className="font-serif text-2xl text-neutral-900 mb-6 w-full border-b border-neutral-200 pb-4">
          Your Details
        </legend>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <Input label="Full Name" name="name" type="text" required />
            {result?.errors?.name && (
              <p className="text-sm text-red-600 mt-1">{result.errors.name[0]}</p>
            )}
          </div>
          <div>
            <Input label="Email Address" name="email" type="email" required />
            {result?.errors?.email && (
              <p className="text-sm text-red-600 mt-1">{result.errors.email[0]}</p>
            )}
          </div>
        </div>
      </fieldset>

      <fieldset className="mt-12 space-y-6" disabled={isPending}>
        <legend className="font-serif text-2xl text-neutral-900 mb-6 w-full border-b border-neutral-200 pb-4">
          Event Details
        </legend>
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <Input label="Event Date" name="event_date" type="date" required />
            {result?.errors?.event_date && (
              <p className="text-sm text-red-600 mt-1">{result.errors.event_date[0]}</p>
            )}
          </div>
          <div>
            <Select label="Event Type" name="event_type" required>
              <option value="">Select an event type</option>
              <option value="wedding">Wedding</option>
              <option value="corporate">Corporate Event</option>
              <option value="party">Private Party</option>
              <option value="other">Other</option>
            </Select>
            {result?.errors?.event_type && (
              <p className="text-sm text-red-600 mt-1">{result.errors.event_type[0]}</p>
            )}
          </div>
        </div>
        <div>
          <Input
            label="Venue or Location"
            name="location"
            type="text"
            placeholder="e.g., Town or specific venue"
            required
          />
          {result?.errors?.location && (
            <p className="text-sm text-red-600 mt-1">{result.errors.location[0]}</p>
          )}
        </div>
        <div>
          <Select label="Estimated Number of Guests" name="guests" required>
            <option value="">How many people?</option>
            <option value="30-50">30-50</option>
            <option value="50-75">50-75</option>
            <option value="75-100">75-100</option>
            <option value="100-150">100-150</option>
            <option value="150-200">150-200</option>
            <option value="200+">200+</option>
          </Select>
          {result?.errors?.guest_count && (
            <p className="text-sm text-red-600 mt-1">{result.errors.guest_count[0]}</p>
          )}
        </div>
      </fieldset>

      <fieldset className="mt-12 space-y-6" disabled={isPending}>
        <legend className="font-serif text-2xl text-neutral-900 mb-6 w-full border-b border-neutral-200 pb-4">
          Additional Information
        </legend>
        <Textarea
          label="Tell us a bit about your event"
          name="notes"
          placeholder="Any special requests, dietary needs, or details about the day."
        />
      </fieldset>

      <div className="mt-12 text-center">
        <Button type="submit" className="w-full sm:w-auto" disabled={isPending}>
          {isPending ? 'Sending...' : 'Send Enquiry'}
        </Button>
        <p className="font-sans text-sm text-neutral-500 mt-4">
          This is a no-obligation enquiry.
        </p>
      </div>
    </form>
  );
}
