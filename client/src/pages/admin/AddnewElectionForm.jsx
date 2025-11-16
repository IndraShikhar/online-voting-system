import { useState } from "react";
import axios from "../../api/api.js";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function DialogDemo() {
  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await axios.post("/elections/create", form);

      console.log("Candidate added:", res.data);
      alert("Candidate added successfully!");

      // Clear form
      setForm({ title: "", description: "" });

      // Close dialog using JS (shadcn API)
      document.getElementById("close-dialog").click();

    } catch (err) {
      console.log(err);
      alert("Failed to add candidate");
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add New Candidate</Button>
      </DialogTrigger>

      {/* Put form inside content so submit works */}
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Candidate</DialogTitle>
            <DialogDescription>
              Please fill correct details of the candidate.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Title */}
            <div className="grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="GS, CR, etc."
              />
            </div>

            {/* Description */}
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Candidate details..."
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button id="close-dialog" variant="outline">
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit">Add</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default DialogDemo;
