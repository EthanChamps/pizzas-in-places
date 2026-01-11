'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { submitContactEnquiry, ActionResult } from '@/lib/actions';

export default function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionResult | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const response = await submitContactEnquiry(formData);
      setResult(response);
    });
  };

  if (result?.success) {
    return (
      <div className="flex flex-col items-start justify-center h-full text-left">
        <h3 className="font-serif text-2xl text-neutral-900 mb-4">Thank you</h3>
        <p className="font-sans text-neutral-600">{result.message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {result?.success === false && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="font-sans text-sm text-red-600">{result.message}</p>
        </div>
      )}

      <Input
        label="Name"
        name="name"
        type="text"
        required
        disabled={isPending}
      />
      {result?.errors?.name && (
        <p className="text-sm text-red-600 -mt-4">{result.errors.name[0]}</p>
      )}

      <Input
        label="Email"
        name="email"
        type="email"
        required
        disabled={isPending}
      />
      {result?.errors?.email && (
        <p className="text-sm text-red-600 -mt-4">{result.errors.email[0]}</p>
      )}

      <Select label="Enquiry Type" name="enquiry_type" required disabled={isPending}>
        <option value="general">General Question</option>
        <option value="private-hire">Private Hire</option>
        <option value="event">Event Booking</option>
        <option value="feedback">Feedback</option>
      </Select>
      {result?.errors?.enquiry_type && (
        <p className="text-sm text-red-600 -mt-4">{result.errors.enquiry_type[0]}</p>
      )}

      <Textarea
        label="Message"
        name="message"
        required
        disabled={isPending}
      />
      {result?.errors?.message && (
        <p className="text-sm text-red-600 -mt-4">{result.errors.message[0]}</p>
      )}

      <div className="pt-2">
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Sending...' : 'Send message'}
        </Button>
      </div>
    </form>
  );
}
