
'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CreateGoalDialogProps {
  onCreateGoal: (name: string) => void;
  children: React.ReactNode; // Trigger element
}

export function CreateGoalDialog({ onCreateGoal, children }: CreateGoalDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [nameInput, setNameInput] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = nameInput.trim();
    if (trimmedName) {
      onCreateGoal(trimmedName);
      setIsOpen(false);
      setNameInput(''); 
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) setNameInput(''); 
    }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Goal</DialogTitle>
            <DialogDescription>
              Give your new goal a name to start tracking your progress.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-goal-name" className="text-right">
                Name
              </Label>
              <Input
                id="new-goal-name"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="col-span-3"
                placeholder="e.g., Learn to code"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={!nameInput.trim()}>Save Goal</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
