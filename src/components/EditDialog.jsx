"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const EditDialog = ({ open, onOpenChange, selectedRow, children, onSave, title }) => {
  if (!selectedRow) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white !p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[80vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-blue-600">{title || 'Edit'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">{children}</div>
        <DialogFooter className="!pt-6">
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="border border-blue-600 cursor-pointer !p-4 text-blue-600 rounded-md"
          >
            Cancel
          </Button>
          <Button onClick={onSave} className="bg-blue-600 cursor-pointer !p-4 text-white rounded-md hover:bg-blue-700">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const DeleteDialog = ({ open, onOpenChange, selectedRow, onConfirm, title }) => {
  if (!selectedRow) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white !p-6 rounded-lg shadow-lg w-full max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-blue-600">{title || 'Confirm Deletion'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-gray-600">This action will permanently delete your account and all associated data.</p>
        </div>
        <DialogFooter className="!pt-6">
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="border border-blue-600 cursor-pointer !p-4 text-blue-600 rounded-md"
          >
            Cancel
          </Button>
          <Button onClick={onConfirm} className="bg-red-600 cursor-pointer !p-4 text-white rounded-md hover:bg-red-700">
            Sure
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};