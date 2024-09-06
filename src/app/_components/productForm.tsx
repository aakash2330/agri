"use client";

import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const createProductFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name of the product must be at least 2 characters.",
  }),

  description: z.string().min(2, {
    message: "description of the product must be at least 2 characters.",
  }),
});

type TcreateProductFormSchema = typeof createProductFormSchema;

export function ProfileForm() {
  const utils = api.useUtils();
  const createPost = api.product.create.useMutation({
    onSuccess: async () => {
      await utils.product.invalidate();
      form.reset();
    },
  });

  const form = useForm<z.infer<TcreateProductFormSchema>>({
    resolver: zodResolver(createProductFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  function onSubmit(values: z.infer<TcreateProductFormSchema>) {
    const { name, description } = values;
    createPost.mutate({ name, description });
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center space-y-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Product Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Product Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
