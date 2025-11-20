import React from "react";
import { useForm } from "react-hook-form";
import { useCreateRequest } from "../hooks/useRequests";
import { getAuthState } from "../store/authStore";

export default function RequestForm({
  categories,
}: {
  categories: { id: number; name: string }[];
}) {
  const { register, handleSubmit } = useForm();
  const create = useCreateRequest();
  const { user } = getAuthState();

  const onSubmit = (vals: any) => {
    if (!user?.id) {
      alert("User ID missing — please login again");
      return;
    }

    const payload = {
      title: vals.title,
      description: vals.description,
      category: { id: Number(vals.categoryId) },
      createdBy: { id: user.id }, // ✅ Correct — backend expects this
    };

    create.mutate(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <input
        {...register("title")}
        placeholder="Title"
        className="w-full p-2 border rounded"
      />

      <textarea
        {...register("description")}
        placeholder="Description"
        className="w-full p-2 border rounded"
      />

      <select
        {...register("categoryId")}
        className="w-full p-2 border rounded"
      >
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <button type="submit" className="p-2 bg-blue-500 text-white rounded">
        Submit Request
      </button>
    </form>
  );
}
