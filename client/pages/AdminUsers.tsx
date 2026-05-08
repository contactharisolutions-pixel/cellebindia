import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUsers, createUser, updateUser, deleteUser } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import {
  UserPlus, Shield, MoreVertical, Mail, User as UserIcon,
  BadgeCheck, Ban, Trash2, Edit2, Lock, UserCheck, Fingerprint, Loader2,
  ArrowUpDown, ArrowUp, ArrowDown
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const roleConfig: Record<string, { color: string; icon: any }> = {
  Admin: { color: "text-violet-700 bg-violet-50 border-violet-200", icon: Shield },
  Editor: { color: "text-blue-700 bg-blue-50 border-blue-200", icon: Edit2 },
  Contributor: { color: "text-slate-600 bg-slate-50 border-slate-200", icon: UserIcon },
};

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Editor");

  const { data: users, isLoading } = useQuery({ queryKey: ["users"], queryFn: fetchUsers });

  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = useMemo(() => {
    let items = users || [];
    if (sortConfig !== null) {
      items = [...items].sort((a, b) => {
        const aValue = a[sortConfig.key as keyof typeof a];
        const bValue = b[sortConfig.key as keyof typeof b];
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return items;
  }, [users, sortConfig]);

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User created successfully.");
      setIsOpen(false); resetForm();
    },
    onError: (err: any) => toast.error(err.message || "Failed to create user."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User updated.");
      setEditingUser(null); resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted.");
    },
  });

  const resetForm = () => { setName(""); setEmail(""); setRole("Editor"); };

  const handleEdit = (user: any) => {
    setEditingUser(user); setName(user.name); setEmail(user.email); setRole(user.role);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      updateMutation.mutate({ id: editingUser.id, data: { name, email, role, status: editingUser.status } });
    } else {
      createMutation.mutate({ name, email, role });
    }
  };

  const toggleStatus = (user: any) => {
    const newStatus = user.status === "Active" ? "Suspended" : "Active";
    updateMutation.mutate({ id: user.id, data: { ...user, status: newStatus } });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Users</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage team members and their account access.</p>
        </div>

        <Dialog
          open={isOpen || !!editingUser}
          onOpenChange={(val) => {
            if (!val) { setIsOpen(false); setEditingUser(null); resetForm(); }
          }}
        >
          <DialogTrigger asChild>
            <Button
              onClick={() => setIsOpen(true)}
              className="bg-primary hover:bg-primary/90 text-white gap-2 shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              Add New User
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-xl border-slate-200 shadow-xl max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-900">
                {editingUser ? "Edit User" : "Add New User"}
              </DialogTitle>
              <p className="text-sm text-slate-500">
                {editingUser ? "Update user profile and role." : "Create a new team member account."}
              </p>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-5 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Full Name</Label>
                  <Input
                    value={name} onChange={(e) => setName(e.target.value)}
                    className="rounded-lg border-slate-200 focus-visible:ring-primary/30" required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Email Address</Label>
                  <Input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="rounded-lg border-slate-200 focus-visible:ring-primary/30" required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">User Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="rounded-lg border-slate-200 focus:ring-primary/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Admin">System Administrator</SelectItem>
                    <SelectItem value="Editor">Content Editor</SelectItem>
                    <SelectItem value="Contributor">Guest Contributor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button
                  type="submit"
                  disabled={updateMutation.isPending || createMutation.isPending}
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg h-10"
                >
                  {updateMutation.isPending || createMutation.isPending ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving…</>
                  ) : editingUser ? "Save Changes" : "Create Account"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span className="text-sm">Loading users…</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th 
                    className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3.5 px-5 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => requestSort("name")}
                  >
                    <div className="flex items-center gap-2">
                      Name
                      {sortConfig?.key === "name" ? (
                        sortConfig.direction === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                      ) : (
                        <ArrowUpDown className="w-3 h-3 opacity-30" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3.5 px-4 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => requestSort("role")}
                  >
                    <div className="flex items-center gap-2">
                      User Role
                      {sortConfig?.key === "role" ? (
                        sortConfig.direction === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                      ) : (
                        <ArrowUpDown className="w-3 h-3 opacity-30" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3.5 px-4 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => requestSort("status")}
                  >
                    <div className="flex items-center gap-2">
                      Status
                      {sortConfig?.key === "status" ? (
                        sortConfig.direction === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
                      ) : (
                        <ArrowUpDown className="w-3 h-3 opacity-30" />
                      )}
                    </div>
                  </th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider py-3.5 px-5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedUsers?.map((user: any) => {
                  const rc = roleConfig[user.role] || roleConfig["Contributor"];
                  const RoleIcon = rc.icon;
                  return (
                    <tr key={user.id} className="hover:bg-slate-50/60 transition-colors group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3.5">
                          <Avatar className="w-10 h-10 rounded-full border-2 border-slate-100">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold rounded-full">
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-semibold text-slate-800 leading-tight">{user.name}</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <span className="text-xs text-slate-400">{user.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={cn("inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border", rc.color)}>
                          <RoleIcon className="w-3 h-3" />
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full",
                          user.status === "Active"
                            ? "text-emerald-700 bg-emerald-50"
                            : "text-red-600 bg-red-50"
                        )}>
                          <span className={cn("w-1.5 h-1.5 rounded-full", user.status === "Active" ? "bg-emerald-500" : "bg-red-400")} />
                          {user.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl border-slate-200 shadow-lg w-44">
                            <DropdownMenuLabel className="text-xs font-semibold text-slate-400 px-3 py-2">User Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-slate-100" />
                            <DropdownMenuItem onClick={() => handleEdit(user)} className="gap-2 text-sm cursor-pointer">
                              <Edit2 className="w-3.5 h-3.5" /> Edit Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleStatus(user)} className="gap-2 text-sm cursor-pointer">
                              {user.status === "Active"
                                ? <><Ban className="w-3.5 h-3.5 text-amber-500" /> Suspend</>
                                : <><UserCheck className="w-3.5 h-3.5 text-emerald-500" /> Activate</>
                              }
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-100" />
                            <DropdownMenuItem
                              onClick={() => { if (confirm("Delete this user?")) deleteMutation.mutate(user.id); }}
                              className="gap-2 text-sm cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <BadgeCheck className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">Secure User Management</p>
            <p className="text-xs text-slate-400">All user changes are logged for security compliance.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
