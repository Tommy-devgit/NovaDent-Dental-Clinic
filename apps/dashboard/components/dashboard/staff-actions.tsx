"use client";

import { KeyRound, MoreHorizontal, ShieldCheck, ShieldOff, UserCheck, UserX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
} from "@novadent/ui";
import type { StaffRole, StaffStatus } from "@novadent/types";

type StaffEntry = {
  id: string;
  role: StaffRole;
  status: StaffStatus;
};

async function patchStaff(id: string, body: Record<string, string>): Promise<{ ok: boolean; error?: string }> {
  const response = await fetch(`/api/staff/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    return { ok: false, error: (data as { error?: string }).error ?? "Something went wrong" };
  }

  return { ok: true };
}

export function StaffActions({
  staff,
  currentUserId,
}: {
  staff: StaffEntry;
  currentUserId: string | undefined;
}) {
  const router = useRouter();
  const [resetOpen, setResetOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const isSelf = staff.id === currentUserId;
  const isSuspended = staff.status === "SUSPENDED";

  async function handleRoleToggle() {
    const nextRole: StaffRole = staff.role === "ADMIN" ? "RECEPTIONIST" : "ADMIN";
    const result = await patchStaff(staff.id, { role: nextRole });
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(`Role changed to ${nextRole.charAt(0) + nextRole.slice(1).toLowerCase()}`);
    router.refresh();
  }

  async function handleStatusToggle() {
    const nextStatus: StaffStatus = isSuspended ? "ACTIVE" : "SUSPENDED";
    const result = await patchStaff(staff.id, { status: nextStatus });
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(nextStatus === "SUSPENDED" ? "Staff member suspended" : "Staff member activated");
    router.refresh();
  }

  async function handleResetPassword() {
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsResetting(true);
    const response = await fetch(`/api/staff/${staff.id}/password`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setIsResetting(false);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      toast.error((data as { error?: string }).error ?? "Couldn't reset password");
      return;
    }

    toast.success("Password reset");
    setPassword("");
    setResetOpen(false);
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Staff actions">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={handleRoleToggle}>
            {staff.role === "ADMIN" ? (
              <>
                <ShieldOff className="mr-2 size-4" />
                Make receptionist
              </>
            ) : (
              <>
                <ShieldCheck className="mr-2 size-4" />
                Make admin
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuItem
            disabled={isSelf && !isSuspended}
            onSelect={handleStatusToggle}
            className={!isSuspended && !isSelf ? "text-destructive focus:text-destructive" : ""}
          >
            {isSuspended ? (
              <>
                <UserCheck className="mr-2 size-4" />
                Activate
              </>
            ) : (
              <>
                <UserX className="mr-2 size-4" />
                Suspend
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onSelect={() => setResetOpen(true)}>
            <KeyRound className="mr-2 size-4" />
            Reset password
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset password</DialogTitle>
          </DialogHeader>
          <Input
            type="password"
            placeholder="New password (min. 8 characters)"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <DialogFooter>
            <Button onClick={handleResetPassword} disabled={isResetting}>
              {isResetting ? "Saving…" : "Set password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
