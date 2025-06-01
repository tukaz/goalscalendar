
'use client';

import React, { useState, useEffect } from 'react';
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

interface SetGoalNameDialogProps {
  currentGoalName: string | null;
  onSetGoalName: (name: string) => void;
  children: React.ReactNode; // Trigger element
}

export function SetGoalNameDialog({ currentGoalName, onSetGoalName, children }: SetGoalNameDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [nameInput, setNameInput] = useState('');

  useEffect(() => {
    if (isOpen && currentGoalName !== null) {
      setNameInput(currentGoalName);
    } else if (!isOpen) {
      setNameInput('');
    }
  }, [isOpen, currentGoalName]);


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = nameInput.trim();
    if (trimmedName) {
      onSetGoalName(trimmedName);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (open && currentGoalName) {
        setNameInput(currentGoalName);
      } else if (!open) {
        // setNameInput(currentGoalName || ''); 
      }
    }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Goal Name</DialogTitle>
            <DialogDescription>
              Update the name of your current goal.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="goal-name-edit" className="text-right">
                Name
              </Label>
              <Input
                id="goal-name-edit"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="col-span-3"
                placeholder="e.g., Daily exercise"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={!nameInput.trim()}>Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
