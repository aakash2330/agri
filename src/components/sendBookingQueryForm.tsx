"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { type z } from "zod";
import { Textarea } from "./ui/textarea";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { DatePickerWithRange } from "./datePicket";
import { type DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { Input } from "./ui/input";
import { api } from "@/trpc/react";
import { bookingQuerySchema, type TbookingQuerySchema } from "types/booking";
import { useToast } from "@/hooks/use-toast";

const DynamicGmapsAutosuggest = dynamic(() => import("./gmaps-autosuggest"), {
  ssr: false,
});

export function SendBookingQueryForm({ productId }: { productId: string }) {
  const { toast } = useToast();

  const sendMail = api.mail.sendMail.useMutation({
    onSuccess: async ({ success }) => {
      if (success) {
        toast({
          title: "Your Query has been sent",
          description: "You will be contacted soon",
          variant: "success",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description:
          "Please try again after some time or mail us at xagri2024@gmail.com",
        variant: "destructive",
      });
    },
  });

  const addBooking = api.booking.addBooking.useMutation({
    onSuccess: async ({ success }) => {
      if (success) {
        sendMail.mutate({ ...form.getValues() });
      }
    },
  });

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 1),
  });

  const gmapsInputRef = useRef<any>(null);

  const form = useForm<TbookingQuerySchema>({
    resolver: zodResolver(bookingQuerySchema),
    defaultValues: {
      bookingQuery: "",
      address: "",
      from: undefined,
      to: undefined,
      contactNumber: "",
      productId: productId,
    },
  });
  async function onSubmit(values: z.infer<typeof bookingQuerySchema>) {
    console.log(values);
    addBooking.mutate({ ...values });
  }

  useEffect(() => {
    if (date?.from && date?.to) {
      form.setValue("from", date.from);
      form.setValue("to", date.to);
    }
  }, [date, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <FormLabel>Location</FormLabel>
          <DynamicGmapsAutosuggest
            placeholder={"Where are you located?"}
            innerRef={gmapsInputRef}
            form={form}
          ></DynamicGmapsAutosuggest>
        </div>
        <div>
          <FormLabel>Select Dates</FormLabel>
          <DatePickerWithRange
            setDate={setDate}
            date={date}
          ></DatePickerWithRange>
        </div>
        <FormField
          control={form.control}
          name="bookingQuery"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Query</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Type your message here." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contactNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Number</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  pattern="[0-9]{10}"
                  {...field}
                  placeholder="xxxxxxxxxx"
                ></Input>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={form.formState.isSubmitting} type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
