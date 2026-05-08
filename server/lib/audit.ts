import { db } from "./storage";

export async function logAction(action: string, module: string, targetId?: string, userName: string = "Vinay Admin") {
  try {
    await db.from('audit_logs').insert({
      action,
      module,
      target_id: targetId || null,
      user_name: userName
    });
  } catch (err) {
    console.error("Failed to log audit action:", err);
  }
}
